import { TABLE_ROW_SIZE } from "./globals";
import prisma from "./prisma";
import { PurchaseType } from "./types";
import * as Sentry from "@sentry/nextjs";

export async function getPurchaseInvoices(
  query: string = "",
  take = TABLE_ROW_SIZE,
  skip = 0
): Promise<{
  purchaseInvoices?: PurchaseType[];
  total?: number;
  error?: unknown;
}> {
  try {
    const purchaseInvoices = await prisma.purchase.findMany({
      include: {
        createdBy: true,
        updatedBy: true,
        items: {
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
      // where: {
      //   name: {
      //     contains: query,
      //     mode: "insensitive",
      //   },
      // },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const formatted: PurchaseType[] = purchaseInvoices.map((invoice) => ({
      id: invoice.id,
      items: invoice.items.map((item) => ({
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

    const total = await prisma.purchase.count();

    return { purchaseInvoices: formatted, total };
  } catch (error) {
    console.log(error);

    return { error };
  }
}

export async function createPurchaseInvoice(invoice: any) {
  try {
    const createdPurchaseInvoice = await prisma.purchase.create({
      data: {
        items: {
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
        items: {
          include: {
            inventory: true,
          },
        },
      },
    });

    await Promise.all(
      createdPurchaseInvoice.items.map(async (item) => {
        await prisma.inventory.update({
          where: {
            id: item.inventoryId,
          },
          data: {
            available: item.inventory.available + item.quantity,
            updatedBy: {
              connect: {
                id: invoice.updatedBy,
              },
            },
          },
        });
      })
    );

    return { invoice: createdPurchaseInvoice };
  } catch (error) {
    Sentry.captureException(error);
    return { error };
  }
}
