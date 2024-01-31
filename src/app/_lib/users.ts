import prisma from "./prisma";

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    return { users };
  } catch (error) {
    return { error };
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return { user };
  } catch (error) {
    return { error };
  }
}

export async function createUser(user: any) {
  try {
    const createdUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        notificationEnabled: false,
        emailVerified: true,
        isActive: true,
        type: user.type,
        // TODO: Not included in MVP
        // userBusiness: {
        //   create: {

        //   }
        // },
      },
    });
    return { user: createdUser };
  } catch (error) {
    console.log(error);

    return { error };
  }
}
