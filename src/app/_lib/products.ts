import { TABLE_ROW_SIZE } from "./globals";
import prisma from "./prisma";
import * as Sentry from "@sentry/nextjs";

export async function getProducts(
  query: string = "",
  take = TABLE_ROW_SIZE,
  skip = 0
): Promise<{
  products?: any[];
  total?: number;
  error?: unknown;
}> {
  try {
    const products = await prisma.product.findMany({
      skip,
      take,
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const total = await prisma.product.count();

    return { products, total };
  } catch (error) {
    return { error };
  }
}

export async function getAllProducts(): Promise<{
  products?: any[];
  error?: unknown;
}> {
  try {
    const products = await prisma.product.findMany();

    const formatted = await Promise.all(
      products.map((product) => ({
        ...product,
        value: `${product.name} - Rs.${product.price} - ${product.weight}g`,
        label: `${product.name} - Rs.${product.price} - ${product.weight}g`,
      }))
    );

    return { products: formatted };
  } catch (error) {
    return { error };
  }
}

export async function createProduct(product: any) {
  try {
    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        barcode: product.barcode,
        price: product.price,
        weight: product.weight,
        category: {
          connect: {
            id: product.categoryId,
          },
        },
        createdBy: {
          connect: {
            id: product.createdBy,
          },
        },
        updatedBy: {
          connect: {
            id: product.updatedBy,
          },
        },
      },
    });
    return { user: createdProduct };
  } catch (error) {
    Sentry.captureException(error);
    return { error };
  }
}

export async function updateProduct(product: any) {
  try {
    const createdProduct = await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        price: product.price,
        weight: product.weight,
        category: {
          connect: {
            id: product.categoryId,
          },
        },
        updatedBy: {
          connect: {
            id: product.updatedBy,
          },
        },
      },
    });
    return { user: createdProduct };
  } catch (error) {
    Sentry.captureException(error);
    return { error };
  }
}
