import prisma from "./prisma";

export async function getBrands() {
  try {
    const brands = await prisma.brand.findMany();
    return { brands };
  } catch (error) {
    return { error };
  }
}

export async function createBrand(brands: any) {
  try {
    const createdBrand = await prisma.brand.create({
      data: {
        name: brands.name,
        createdBy: {
          connect: {
            id: brands.createdBy,
          },
        },
        updatedBy: {
          connect: {
            id: brands.updatedBy,
          },
        },
        description: brands.description,
        business: {
          connect: {
            id: brands.businessId,
          },
        },
      },
    });
    return { brand: createdBrand };
  } catch (error) {
    console.log(error);

    return { error };
  }
}
