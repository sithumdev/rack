import { AUDIT_ACTION } from "@prisma/client";
import { auditInventory } from "./audit/inventory.audit";
import { TABLE_ROW_SIZE } from "./globals";
import prisma from "./prisma";
import { createProductReporting } from "./product-reporting";
import { ReleaseType } from "./types";
import * as Sentry from "@sentry/nextjs";
import { diff } from "deep-diff";

export async function getReleaseInvoices(
  query: string = "",
  take = TABLE_ROW_SIZE,
  skip = 0
): Promise<{
  releases?: ReleaseType[];
  total?: number;
  error?: unknown;
}> {
  try {
    const purchaseInvoices = await prisma.release.findMany({
      include: {
        createdBy: true,
        updatedBy: true,
        releases: {
          include: {
            createdBy: true,
            updatedBy: true,
            inventory: {
              select: {
                mrp: true,
                product: true,
              },
            },
          },
        },
      },
      skip,
      take,
      where: {
        AND: {
          whom: {
            contains: query,
            mode: "insensitive",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const formatted: ReleaseType[] = purchaseInvoices.map((invoice) => ({
      id: invoice.id,
      whom: invoice.whom,
      items: invoice.releases.map((item) => ({
        id: item.id,
        mrp: item.inventory.mrp,
        name: item.inventory.product.name,
        quantity: item.quantity,
        createdBy: item.createdBy.name,
        updatedBy: item.updatedBy.name,
        updatedAt: item.updatedAt,
      })),
      createdBy: invoice.createdBy.name,
      updatedBy: invoice.updatedBy.name,
      updatedAt: invoice.updatedAt,
    }));

    const total = await prisma.release.count();

    return { releases: formatted, total };
  } catch (error) {
    console.log(error);

    return { error };
  }
}

export async function createReleaseInvoice(invoice: any) {
  try {
    const createdPurchaseInvoice = await prisma.release.create({
      data: {
        whom: invoice.whom,
        releases: {
          createMany: {
            data: invoice.items.map((item: any) => ({
              quantity: item.quantity,
              inventoryId: item.inventoryId,
              createdById: invoice.createdBy,
              updatedById: invoice.updatedBy,
            })),
          },
        },
        createdBy: {
          connect: {
            id: invoice.createdBy,
          },
        },
        updatedBy: {
          connect: {
            id: invoice.updatedBy,
          },
        },
      },
      include: {
        releases: {
          include: {
            inventory: true,
          },
        },
      },
    });

    await Promise.all(
      createdPurchaseInvoice.releases.map(async (item) => {
        const foundInventory = await prisma.inventory.findUniqueOrThrow({
          where: {
            id: item.inventoryId,
          },
          include: { product: true },
        });

        const updatedInventory = await prisma.inventory.update({
          where: {
            id: item.inventoryId,
          },
          data: {
            available: item.inventory.available - item.quantity,
            updatedBy: {
              connect: {
                id: invoice.updatedBy,
              },
            },
          },
          include: {
            product: true,
          },
        });

        const foundUser = await prisma.user.findUniqueOrThrow({
          where: {
            id: invoice.updatedBy,
          },
        });

        await auditInventory(
          {
            inventory: foundInventory,
            createdById: invoice.updatedBy,
            createdByName: foundUser.name,
            difference: diff(foundInventory, updatedInventory)?.filter(
              (change) => change.kind === "E"
            ),
          },
          AUDIT_ACTION.UPDATE
        );
      })
    );

    await Promise.all(
      createdPurchaseInvoice.releases.map(async (item) => {
        await createProductReporting({
          productId: item.inventoryId,
          count: item.quantity,
          whom: invoice.whom,
        });
      })
    );

    return { invoice: createdPurchaseInvoice };
  } catch (error) {
    Sentry.captureException(error);
    return { error };
  }
}
