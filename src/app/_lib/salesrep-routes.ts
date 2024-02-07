import { Prisma } from "@prisma/client";
import prisma from "./prisma";
import * as Sentry from "@sentry/nextjs";
import { TABLE_ROW_SIZE } from "./globals";

export interface CreateSalesRepRoute
  extends Omit<Prisma.SalesRepRouteCreateInput, "createdBy" | "updatedBy"> {
  createdBy: number;
  salesRepId: number;
}

export type SalesRepRoutes = Prisma.RoutesOnSalesRepsGetPayload<{
  include: {
    route: {
      include: {
        updatedBy: true;
      };
    };
  };
}>;

export type SalesRepRoutesWithSalesReps = Prisma.SalesRepRouteGetPayload<{
  include: {
    updatedBy: true;
    salesReps: {
      include: {
        salesRep: true;
      };
    };
  };
}>;

export async function createSalesRepRoute(route: CreateSalesRepRoute) {
  try {
    const createdSalesRepRoute = await prisma.routesOnSalesReps.create({
      data: {
        salesRep: {
          connect: {
            id: route.salesRepId,
          },
        },
        route: {
          create: {
            name: route.name,
            cities: route.cities,
            notes: route.notes,
            createdBy: {
              connect: {
                id: route.createdBy,
              },
            },
            updatedBy: {
              connect: {
                id: route.createdBy,
              },
            },
          },
        },
      },
    });

    return { route: createdSalesRepRoute };
  } catch (error) {
    Sentry.captureException(error);
    return { error };
  }
}

export async function getRoutesBySalesRep(
  query: string = "",
  take = TABLE_ROW_SIZE,
  skip = 0,
  salesRepId: number
): Promise<{
  routes?: SalesRepRoutes[];
  total?: number;
  error?: unknown;
}> {
  try {
    const routes = await prisma.routesOnSalesReps.findMany({
      skip,
      take,
      where: {
        salesRepId,
        route: {
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
        route: {
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

    return { routes, total };
  } catch (error) {
    Sentry.captureException(error);
    return { error };
  }
}

export async function getRoutes(
  query: string = "",
  take = TABLE_ROW_SIZE,
  skip = 0
): Promise<{
  routes?: SalesRepRoutesWithSalesReps[];
  total?: number;
  error?: unknown;
}> {
  try {
    const routes = await prisma.salesRepRoute.findMany({
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

    const total = await prisma.salesRepRoute.count();

    return { routes, total };
  } catch (error) {
    Sentry.captureException(error);
    return { error };
  }
}
