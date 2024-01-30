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
        productBrandInventory: {
          include: {
            product: true,
            inventory: true,
          },
        },
      },
    });

    const formatted: PurchaseType[] = purchaseInvoices.map((invoice) => ({
      id: invoice.id,
      mrp: invoice.productBrandInventory.inventory.mrp,
      name: invoice.productBrandInventory.product.name,
      quantity: invoice.quantity,
      createdBy: invoice.createdBy.name,
      updatedBy: invoice.updatedBy.name,
      updatedAt: invoice.updatedAt,
    }));

    return { purchaseInvoices: formatted };
  } catch (error) {
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

    const foundProductBrandInventory =
      await prisma.productBrandInventory.findFirstOrThrow({
        where: {
          inventoryId: invoice.inventoryId,
        },
      });

    const createdPurchaseInvoice = await prisma.purchase.create({
      data: {
        productBrandInventory: {
          connect: {
            id: foundProductBrandInventory.id,
          },
        },
        quantity: invoice.quantity,
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
