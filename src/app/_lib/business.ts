import prisma from "./prisma";

export async function getBusinesses() {
  try {
    const businesses = await prisma.business.findMany();
    return { businesses };
  } catch (error) {
    return { error };
  }
}

export async function createBusiness(business: any) {
  try {
    const createdBusiness = await prisma.business.create({
      data: {
        name: business.name,
        createdBy: {
          connect: {
            id: business.createdBy,
          },
        },
        updatedBy: {
          connect: {
            id: business.updatedBy,
          },
        },
        mobile: business.mobile,
        description: business.description,
        website: business.website,
        email: business.email,
        isActive: true,
        emailVerified: true,
      },
    });
    return { business: createdBusiness };
  } catch (error) {
    console.log(error);

    return { error };
  }
}
