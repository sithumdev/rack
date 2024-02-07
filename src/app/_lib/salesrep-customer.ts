import { Prisma } from "@prisma/client";
import prisma from "./prisma";
import * as Sentry from "@sentry/nextjs";
import { TABLE_ROW_SIZE } from "./globals";

export interface CreateSalesRepCustomer
  extends Omit<Prisma.SalesRepCustomerCreateInput, "createdBy" | "updatedBy"> {
  createdBy: number;
  salesRepId: number;
}

export type SalesRepCustomers = Prisma.CustomersOnSalesRepsGetPayload<{
  include: {
    customer: {
      include: {
        updatedBy: true;
      };
    };
  };
}>;

export type SalesRepCustomer = Prisma.SalesRepCustomerGetPayload<{
  include: {
    updatedBy: true;
    createdBy: true;
  };
}>;

export type SalesRepCustomersWithSalesReps = Prisma.SalesRepCustomerGetPayload<{
  include: {
    updatedBy: true;
    salesReps: {
      include: {
        salesRep: true;
      };
    };
  };
}>;

export async function createSalesRepCustomer(customer: CreateSalesRepCustomer) {
  try {
    const createdSalesRepCustomer = await prisma.customersOnSalesReps.create({
      data: {
        salesRep: {
          connect: {
            id: customer.salesRepId,
          },
        },
        customer: {
          create: {
            name: customer.name,
            address: customer.address,
            city: customer.city,
            phone: customer.phone,
            createdBy: {
              connect: {
                id: customer.createdBy,
              },
            },
            updatedBy: {
              connect: {
                id: customer.createdBy,
              },
            },
          },
        },
      },
    });

    return { customer: createdSalesRepCustomer };
  } catch (error) {
    Sentry.captureException(error);
    return { error };
  }
}

export async function getCustomersBySalesRep(
  query: string = "",
  take = TABLE_ROW_SIZE,
  skip = 0,
  salesRepId: number
): Promise<{
  customers?: SalesRepCustomers[];
  total?: number;
  error?: unknown;
}> {
  try {
    const customers = await prisma.customersOnSalesReps.findMany({
      skip,
      take,
      where: {
        salesRepId,
        customer: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        customer: {
          include: {
            updatedBy: true,
          },
        },
      },
    });

    const total = await prisma.customersOnSalesReps.count({
      where: {
        salesRepId,
      },
    });

    return { customers, total };
  } catch (error) {
    Sentry.captureException(error);
    return { error };
  }
}

export async function getCustomerById(id: number): Promise<{
  customer?: SalesRepCustomer;
  error?: unknown;
}> {
  try {
    const customer = await prisma.salesRepCustomer.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        createdBy: true,
        updatedBy: true,
      },
    });
    return { customer };
  } catch (error) {
    Sentry.captureException(error);
    return { error };
  }
}

export async function getCustomers(
  query: string = "",
  take = TABLE_ROW_SIZE,
  skip = 0
): Promise<{
  customers?: SalesRepCustomersWithSalesReps[];
  total?: number;
  error?: unknown;
}> {
  try {
    const customers = await prisma.salesRepCustomer.findMany({
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
      include: {
        updatedBy: true,
        salesReps: {
          include: {
            salesRep: true,
          },
        },
      },
    });

    const total = await prisma.mobileInventory.count();

    return { customers, total };
  } catch (error) {
    Sentry.captureException(error);
    return { error };
  }
}
