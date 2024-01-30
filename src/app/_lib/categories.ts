import prisma from "./prisma";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany();
    return { categories };
  } catch (error) {
    return { error };
  }
}

export async function getCategoriesByUserEmail(email: string) {
  try {
    // const user =
  } catch (error) {}

  try {
    const categories = await prisma.category.findMany();
    return { categories };
  } catch (error) {
    return { error };
  }
}

export async function createCategory(category: any) {
  try {
    const createdCategory = await prisma.category.create({
      data: {
        name: category.name,
        createdBy: {
          connect: {
            id: category.createdBy,
          },
        },
        updatedBy: {
          connect: {
            id: category.updatedBy,
          },
        },
        description: category.description,
        business: {
          connect: {
            id: category.businessId,
          },
        },
      },
    });
    return { category: createdCategory };
  } catch (error) {
    console.log(error);

    return { error };
  }
}
