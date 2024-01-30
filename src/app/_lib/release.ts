import prisma from "./prisma";
import { ReleaseType } from "./types";

export async function getReleaseInvoices(): Promise<{
  releases?: ReleaseType[];
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

    return { releases: formatted };
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
        await prisma.inventory.update({
          where: {
            id: item.inventoryId,
          },
          data: {
            available: item.inventory.available - item.quantity,
          },
        });
      })
    );

    return { invoice: createdPurchaseInvoice };
  } catch (error) {
    console.log(error);

    return { error };
  }
}
