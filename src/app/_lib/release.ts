import prisma from "./prisma";
import { ReleaseType } from "./types";

export async function getReleaseInvoices(): Promise<{
  releaseInvoices?: ReleaseType[];
  error?: unknown;
}> {
  try {
    const releaseInvoices = await prisma.release.findMany({
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

    const formatted: ReleaseType[] = releaseInvoices.map((invoice) => ({
      id: invoice.id,
      mrp: invoice.productBrandInventory.inventory.mrp,
      name: invoice.productBrandInventory.product.name,
      quantity: invoice.quantity,
      createdBy: invoice.createdBy.name,
      updatedBy: invoice.updatedBy.name,
      updatedAt: invoice.updatedAt,
      whom: invoice.whom,
    }));

    return { releaseInvoices: formatted };
  } catch (error) {
    return { error };
  }
}

export async function createReleaseInvoice(invoice: any) {
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
        available: foundInventory.available - invoice.quantity,
      },
    });

    const foundProductBrandInventory =
      await prisma.productBrandInventory.findFirstOrThrow({
        where: {
          inventoryId: invoice.inventoryId,
        },
      });

    const createdReleaseInvoice = await prisma.release.create({
      data: {
        productBrandInventory: {
          connect: {
            id: foundProductBrandInventory.id,
          },
        },
        quantity: invoice.quantity,
        whom: invoice.whom,
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
    return { invoice: createdReleaseInvoice };
  } catch (error) {
    console.log(error);

    return { error };
  }
}
