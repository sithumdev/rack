import { ReportMode } from "./globals";
import { getInventoryById } from "./inventory";
import prisma from "./prisma";
import moment from "moment";

export async function getProductAnalytics(mode: ReportMode) {
  let startDate;
  let endDate;

  switch (mode) {
    case ReportMode.DAILY:
      startDate = moment().subtract(1, "days").format();
      endDate = moment().format();
      break;
    case ReportMode.WEEKLY:
      startDate = moment().subtract(7, "days").format();
      endDate = moment().format();
      break;
    case ReportMode.MONTHLY:
      startDate = moment().subtract(1, "months").format();
      endDate = moment().format();
      break;
    case ReportMode.YEARLY:
      startDate = moment().subtract(1, "years").format();
      endDate = moment().format();
      break;
    default:
      throw new Error(`Invalid mode: ${mode}`);
  }

  try {
    const reporting = await prisma.productReporting.groupBy({
      by: ["productId"],
      _sum: {
        count: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        _sum: {
          count: "desc",
        },
      },
      take: 5,
    });

    const demandingProducts = await Promise.all(
      reporting.map(async (report) => {
        const inventory = await getInventoryById(report.productId);
        return {
          product: inventory.inventory?.name,
          mrp: inventory.inventory?.mrp,
          count: report._sum.count,
        };
      })
    );

    return { demandingProducts };
  } catch (error) {
    return { error };
  }
}

export async function getProductAnalyticsByWhom(mode: ReportMode) {
  let startDate;
  let endDate;

  switch (mode) {
    case ReportMode.DAILY:
      startDate = moment().subtract(1, "days").format();
      endDate = moment().format();
      break;
    case ReportMode.WEEKLY:
      startDate = moment().subtract(7, "days").format();
      endDate = moment().format();
      break;
    case ReportMode.MONTHLY:
      startDate = moment().subtract(1, "months").format();
      endDate = moment().format();
      break;
    case ReportMode.YEARLY:
      startDate = moment().subtract(1, "years").format();
      endDate = moment().format();
      break;
    default:
      throw new Error(`Invalid mode: ${mode}`);
  }

  try {
    const reporting = await prisma.productReporting.groupBy({
      by: ["whom"],
      _sum: {
        count: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        _sum: {
          count: "desc",
        },
      },
      take: 5,
    });

    return { reporting };
  } catch (error) {
    return { error };
  }
}

export async function createProductReporting(product: any) {
  try {
    const createdReport = await prisma.productReporting.create({
      data: {
        productId: product.productId,
        count: product.count,
        whom: product.whom,
      },
    });
    return { createdReport };
  } catch (error) {
    console.log(error);

    return { error };
  }
}
