import { PrismaClient } from "@prisma/client";

const singletonPrismaClient = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof singletonPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? singletonPrismaClient();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
