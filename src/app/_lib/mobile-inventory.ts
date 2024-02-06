import { TABLE_ROW_SIZE } from "./globals";
import prisma from "./prisma";
import * as Sentry from "@sentry/nextjs";

export async function getMobileInventoriesBySalesRep(
  query: string = "",
  take = TABLE_ROW_SIZE,
  skip = 0,
  salesRepId: number
): Promise<{
  mobileInventories?: any[];
  total?: number;
  error?: unknown;
}> {
  try {
    const mobileInventories = await prisma.mobileInventory.findMany({
      skip,
      take,
      where: {
        salesReps: {
          every: {
            salesRepId,
          },
        },
        product: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        product: true,
        updatedBy: true,
      },
    });

    const total = await prisma.mobileInventory.count({
      where: {
        salesReps: {
          every: {
            salesRepId,
          },
        },
      },
    });

    return { mobileInventories, total };
  } catch (error) {
    return { error };
  }
}

export async function createMobileInventory(inventory: any) {
  try {
    const foundProduct = await prisma.product.findUniqueOrThrow({
      where: {
        id: inventory.productId,
      },
    });

    const mobileInventory = await prisma.mobileInventory.create({
      data: {
        available: inventory.available,
        defective: inventory.defective,
        mrp: inventory.mrp,
        sellingPrice: inventory.sellingPrice,
        sku: inventory.sku,
        sold: inventory.sold,
        product: {
          connect: {
            id: foundProduct.id,
          },
        },
        createdBy: {
          connect: {
            id: inventory.createdById,
          },
        },
        updatedBy: {
          connect: {
            id: inventory.createdById,
          },
        },
        salesReps: {
          create: [
            {
              salesRep: {
                connect: {
                  id: inventory.salesRepId,
                },
              },
            },
          ],
        },
      },
    });
    return { mobileInventory };
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
    return { error };
  }
}
