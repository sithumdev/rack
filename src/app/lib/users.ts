import prisma from "./prisma";

export async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    return { users };
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
      },
    });
    return { user: createdUser };
  } catch (error) {
    return { error };
  }
}
