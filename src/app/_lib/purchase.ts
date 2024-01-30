import prisma from "./prisma";
import { PurchaseType } from "./types";

export async function getPurchaseInvoices(): Promise<{
  purchaseInvoices?: PurchaseType[];
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

    return { purchaseInvoices: formatted };
  } catch (error) {
    console.log(error);

    return { error };
  }
}

export async function createPurchaseInvoice(invoice: any) {
  try {
    const foundInventory = await prisma.inventory.findUniqueOrThrow({
      where: {
        id: invoice.inventoryId,
      },
    });

    await prisma.inventory.update({
      where: {
        id: invoice.inventoryId,
      },
      data: {
        available: foundInventory.available + invoice.quantity,
      },
    });

    const createdPurchaseInvoice = await prisma.purchase.create({
      data: {
        items: {
          createMany: {
            data: invoice.items.map((item: any) => ({
              quantity: item.quantity,
              inventory: {
                connect: {
                  id: invoice.inventoryId,
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
    });
    return { invoice: createdPurchaseInvoice };
  } catch (error) {
    console.log(error);

    return { error };
  }
}
