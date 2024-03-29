import { TABLE_ROW_SIZE } from "./globals";
import prisma from "./prisma";
import { InventoryExportType, InventoryType } from "./types";
import * as Sentry from "@sentry/nextjs";

export async function getInventory(
  query: string = "",
  take = TABLE_ROW_SIZE,
  skip = 0
): Promise<{
  inventory?: InventoryType[];
  total?: number;
  error?: unknown;
}> {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        product: true,
        updatedBy: true,
      },
      where: {
        product: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      },
      skip,
      take,
      orderBy: {
        updatedAt: "desc",
      },
    });

    const formatted: InventoryType[] = inventory.map((inventory) => ({
      id: inventory.id,
      productId: inventory.productId,
      name: inventory.product.name,
      available: inventory.available,
      defective: inventory.defective,
      sku: inventory.sku,
      weight: inventory.product.weight,
      sellingPrice: inventory.sellingPrice,
      mrp: inventory.mrp,
      sold: inventory.sold,
      updatedAt: inventory.updatedAt,
      barcode: inventory.product.barcode,
      updatedBy: inventory.updatedBy.name,
      value: `${inventory.product.name} - Rs.${inventory.mrp} - ${inventory.product.weight}g`,
      label: `${inventory.product.name} - Rs.${inventory.mrp} - ${inventory.product.weight}g`,
    }));

    const total = await prisma.inventory.count();

    return { inventory: formatted, total };
  } catch (error) {
    console.log(error);

    return { error };
  }
}

export async function getAllAvailableInventory(): Promise<{
  inventory?: InventoryType[];
  error?: unknown;
}> {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        product: true,
        updatedBy: true,
      },
      where: {
        available: {
          gt: 0,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const formatted: InventoryType[] = inventory.map((inventory) => ({
      id: inventory.id,
      productId: inventory.productId,
      name: inventory.product.name,
      available: inventory.available,
      defective: inventory.defective,
      sku: inventory.sku,
      weight: inventory.product.weight,
      sellingPrice: inventory.sellingPrice,
      mrp: inventory.mrp,
      sold: inventory.sold,
      updatedAt: inventory.updatedAt,
      barcode: inventory.product.barcode,
      updatedBy: inventory.updatedBy.name,
      value: `${inventory.product.name} - Rs.${inventory.mrp} - ${inventory.product.weight}g`,
      label: `${inventory.product.name} - Rs.${inventory.mrp} - ${inventory.product.weight}g`,
    }));

    return { inventory: formatted };
  } catch (error) {
    console.log(error);

    return { error };
  }
}

export async function getAllInventories(): Promise<{
  inventory?: InventoryType[];
  error?: unknown;
}> {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        product: true,
        updatedBy: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const formatted: InventoryType[] = inventory.map((inventory) => ({
      id: inventory.id,
      productId: inventory.productId,
      name: inventory.product.name,
      available: inventory.available,
      defective: inventory.defective,
      sku: inventory.sku,
      weight: inventory.product.weight,
      sellingPrice: inventory.sellingPrice,
      mrp: inventory.mrp,
      sold: inventory.sold,
      updatedAt: inventory.updatedAt,
      barcode: inventory.product.barcode,
      updatedBy: inventory.updatedBy.name,
      value: `${inventory.product.name} - Rs.${inventory.mrp} - ${inventory.product.weight}g`,
      label: `${inventory.product.name} - Rs.${inventory.mrp} - ${inventory.product.weight}g`,
    }));

    return { inventory: formatted };
  } catch (error) {
    console.log(error);

    return { error };
  }
}

export async function getInventoryById(id: number): Promise<{
  inventory?: InventoryType;
  error?: unknown;
}> {
  try {
    const inventory = await prisma.inventory.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        product: true,
        updatedBy: true,
      },
    });

    const formatted: InventoryType = {
      id: inventory.id,
      productId: inventory.productId,
      name: inventory.product.name,
      available: inventory.available,
      defective: inventory.defective,
      sku: inventory.sku,
      weight: inventory.product.weight,
      sellingPrice: inventory.sellingPrice,
      mrp: inventory.mrp,
      sold: inventory.sold,
      updatedAt: inventory.updatedAt,
      barcode: inventory.product.barcode,
      updatedBy: inventory.updatedBy.name,
      value: `${inventory.product.name} - Rs.${inventory.mrp} - ${inventory.product.weight}g`,
      label: `${inventory.product.name} - Rs.${inventory.mrp} - ${inventory.product.weight}g`,
    };

    return { inventory: formatted };
  } catch (error) {
    console.log(error);

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
    Sentry.captureException(error);
    return { error };
  }
}

export async function updateInventory(inventory: any) {
  try {
    const updatedInventory = await prisma.inventory.update({
      where: {
        id: inventory.id,
      },
      data: {
        sku: inventory.sku,
        sold: inventory.sold,
        defective: inventory.defective,
        updatedBy: {
          connect: {
            id: inventory.updatedBy,
          },
        },
      },
    });

    return { inventory: updatedInventory };
  } catch (error) {
    console.log(error);

    Sentry.captureException(error);
    return { error };
  }
}

export async function getInventoryReport(): Promise<{
  inventory?: InventoryExportType[];
  error?: unknown;
}> {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        product: true,
        updatedBy: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const formatted: InventoryExportType[] = inventory.map((inventory) => ({
      id: inventory.id,
      productId: inventory.productId,
      name: inventory.product.name,
      available: inventory.available,
      defective: inventory.defective,
      sku: inventory.sku,
      weight: inventory.product.weight,
      sellingPrice: inventory.sellingPrice,
      value: Number(inventory.sellingPrice * inventory.available),
      mrp: inventory.mrp,
      sold: inventory.sold,
      updatedAt: inventory.updatedAt,
      barcode: inventory.product.barcode,
      updatedBy: inventory.updatedBy.name,
    }));

    return { inventory: formatted };
  } catch (error) {
    console.log(error);

    return { error };
  }
}
