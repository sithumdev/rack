import prisma from "./prisma";
import * as Sentry from "@sentry/nextjs";

export async function getSalesRepresentativeById(id: number) {
  try {
    const salesRepresentative = await prisma.salesRep.findUnique({
      where: {
        id,
      },
    });
    return { salesRepresentative };
  } catch (error) {
    Sentry.captureException(error);
    return { error };
  }
}

export async function getSalesRepresentatives() {
  try {
    const salesRepresentatives = await prisma.salesRep.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    return { salesRepresentatives };
  } catch (error) {
    Sentry.captureException(error);
    return { error };
  }
}

export async function createSalesrep(salesrep: any) {
  try {
    const createdSalesrep = await prisma.salesRep.create({
      data: {
        name: salesrep.name,
      },
    });
    return { createdSalesrep };
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
    return { error };
  }
}
