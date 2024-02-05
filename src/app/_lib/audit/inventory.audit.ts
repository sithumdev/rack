import { AUDIT_ACTION } from "@prisma/client";
import prisma from "../prisma";
import * as Sentry from "@sentry/nextjs";

export async function getAllInventoryAudits() {
  try {
    const audits = await prisma.inventoryAudit.findMany({
      orderBy: {
        performedAt: "desc",
      },
      include: {
        differences: true,
      },
    });

    return { audits };
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
    return { error };
  }
}

export async function auditInventory(audit: any, action: AUDIT_ACTION) {
  try {
    const createdAuditInventory = await prisma.inventoryAudit.create({
      data: {
        action,
        performedById: audit.createdById,
        performedBy: audit.createdByName,
        mrp: audit.inventory.mrp,
        inventoryId: audit.inventory.id,
        productName: audit.inventory.product.name,
        differences: {
          createMany: {
            data: audit.difference.map((difference: any) => ({
              lhs: String(difference.lhs),
              rhs: String(difference.rhs),
              path: difference.path[0],
            })),
          },
        },
      },
    });

    return { audit: createdAuditInventory };
  } catch (error) {
    console.log(error);

    Sentry.captureException(error);
    return { error };
  }
}
