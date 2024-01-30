import prisma from "./prisma";

export async function getPermissions() {
  try {
    const permissions = await prisma.permission.findMany();
    return { permissions };
  } catch (error) {
    return { error };
  }
}

export async function createPermission(permission: any) {
  try {
    const createdPermission = await prisma.permission.create({
      data: {
        name: permission.name,
        level: permission.level,
        description: permission.description,
      },
    });
    return { permission: createdPermission };
  } catch (error) {
    console.log(error);

    return { error };
  }
}
