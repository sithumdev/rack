import prisma from "./prisma";
import { InventoryType } from "./types";

export async function getInventory(query: string = ""): Promise<{
  inventory?: InventoryType[];
  error?: unknown;
}> {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        product: true,
      },
      where: {
        product: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      },
    });

    const formatted: InventoryType[] = inventory.map((inventory) => ({
      name: inventory.product.name,
      available: inventory.available,
      defective: inventory.defective,
      sku: inventory.sku,
      sellingPrice: inventory.sellingPrice,
      mrp: inventory.mrp,
      sold: inventory.sold,
      updatedAt: inventory.updatedAt,
      id: inventory.id,
    }));

    return { inventory: formatted };
  } catch (error) {
    return { error };
  }
}

export async function createInventory(inventory: any) {
  try {
    const foundProduct = await prisma.product.findUniqueOrThrow({
      where: {
        id: inventory.productId,
      },
    });

    const createdInventory = await prisma.inventory.create({
      data: {
        mrp: foundProduct.price,
        sellingPrice: inventory.sellingPrice,
        sku: inventory.sku,
        available: inventory.available,
        sold: inventory.sold,
        defective: inventory.defective,
        product: {
          connect: {
            id: inventory.productId,
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

    return { inventory: createdInventory };
  } catch (error) {
    console.log(error);

    return { error };
  }
}
