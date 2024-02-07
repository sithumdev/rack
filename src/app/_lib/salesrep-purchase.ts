import { Prisma } from "@prisma/client";
import prisma from "./prisma";
import * as Sentry from "@sentry/nextjs";
import { TABLE_ROW_SIZE } from "./globals";

interface SalesRepPurchaseItem
  extends Omit<
    Prisma.SalesRepPurchaseItemCreateInput,
    "inventory" | "purchase"
  > {}

export interface CreateSalesRepPurchase
  extends Omit<
    Prisma.SalesRepPurchaseCreateInput,
    "items" | "createdBy" | "updatedBy" | "salesRep"
  > {
  items: SalesRepPurchaseItem[];
  createdBy: number;
  salesRep: number;
}

export type SalesRepPurchasesWithCreatedByAndInventory =
  Prisma.SalesRepPurchaseGetPayload<{
    include: {
      createdBy: true;
      items: {
        include: {
          inventory: true;
        };
      };
    };
  }>;

export async function createSalesRepPurchaseInvoice(
  invoice: CreateSalesRepPurchase
) {
  try {
    const createdPurchaseInvoice = await prisma.salesRepPurchase.create({
      data: {
        salesRep: {
          connect: {
            id: invoice.salesRep,
          },
        },
        items: {
          createMany: {
            data: invoice.items.map((item: any) => ({
              quantity: item.quantity,
              inventoryId: item.inventoryId,
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
            id: invoice.createdBy,
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
        await prisma.mobileInventory.update({
          where: {
            id: item.inventoryId,
          },
          data: {
            available: item.inventory.available + item.quantity,
            updatedBy: {
              connect: {
                id: invoice.createdBy,
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

export async function getPurchasesBySalesRep(
  take = TABLE_ROW_SIZE,
  skip = 0,
  salesRepId: number
): Promise<{
  salesRepPurchases?: SalesRepPurchasesWithCreatedByAndInventory[];
  total?: number;
  error?: unknown;
}> {
  try {
    const salesRepPurchases = await prisma.salesRepPurchase.findMany({
      skip,
      take,
      where: {
        salesRepId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        createdBy: true,
        items: {
          include: {
            inventory: true,
          },
        },
      },
    });

    const total = await prisma.salesRepPurchase.count({
      where: {
        salesRepId,
      },
    });

    return { salesRepPurchases, total };
  } catch (error) {
    return { error };
  }
}
