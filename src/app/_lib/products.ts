import prisma from "./prisma";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany();
    return { products };
  } catch (error) {
    return { error };
  }
}

export async function createProduct(product: any) {
  console.log(product);

  try {
    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        barcode: product.barcode,
        price: product.price,
        weight: product.weight,
        business: {
          connect: {
            id: product.businessId,
          },
        },
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
    console.log(error);

    return { error };
  }
}
