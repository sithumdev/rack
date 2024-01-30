import prisma from "./prisma";
import { InventoryType } from "./types";

export async function getInventory(): Promise<{
  inventory?: InventoryType[];
  error?: unknown;
}> {
  try {
    const inventory = await prisma.productBrandInventory.findMany({
      include: {
        inventory: true,
        product: true,
      },
    });

    const formatted: InventoryType[] = inventory.map((inventory) => ({
      name: inventory.product.name,
      available: inventory.inventory.available,
      defective: inventory.inventory.defective,
      sku: inventory.inventory.sku,
      sellingPrice: inventory.inventory.sellingPrice,
      mrp: inventory.inventory.mrp,
      sold: inventory.inventory.sold,
      updatedAt: inventory.inventory.updatedAt,
      id: inventory.id,
    }));

    return { inventory: formatted };
  } catch (error) {
    return { error };
  }
}

export async function createInventory(inventory: any) {
  try {
    const createdInventory = await prisma.inventory.create({
      data: {
        mrp: inventory.mrp,
        sellingPrice: inventory.sellingPrice,
        sku: inventory.sku,
        available: inventory.available,
        sold: inventory.sold,
        defective: inventory.defective,
        business: {
          connect: {
            id: inventory.businessId,
          },
        },
        createdBy: {
          connect: {
            id: inventory.createdBy,
          },
        },
        updatedBy: {
          connect: {
            id: inventory.createdBy,
          },
        },
      },
    });

    await prisma.productBrandInventory.create({
      data: {
        brand: {
          connect: {
            id: inventory.brandId,
          },
        },
        product: {
          connect: {
            id: inventory.productId,
          },
        },
        inventory: {
          connect: {
            id: createdInventory.id,
          },
        },
      },
    });

    return { inventory: createdInventory };
  } catch (error) {
    console.log(error);

    return { error };
  }
}
