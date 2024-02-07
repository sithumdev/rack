import { Prisma } from "@prisma/client";
import prisma from "./prisma";
import * as Sentry from "@sentry/nextjs";

export interface CreateSalesRepCustomer
  extends Omit<Prisma.SalesRepCustomerCreateInput, "createdBy" | "updatedBy"> {
  createdBy: number;
}

export async function createSalesRepCustomer(customer: CreateSalesRepCustomer) {
  try {
    const createdSalesRepCustomer = await prisma.salesRepCustomer.create({
      data: {
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
    });

    return { customer: createdSalesRepCustomer };
  } catch (error) {
    Sentry.captureException(error);
    return { error };
  }
}
