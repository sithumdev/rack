import { AUDIT_ACTION } from "@prisma/client";
import prisma from "../prisma";
import * as Sentry from "@sentry/nextjs";

export async function getAllInventoryAudits() {
  try {
    const audits = await prisma.inventoryAudit.findMany({
      orderBy: {
        performedAt: "desc",
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
  console.log("AUDITING ", audit);
  console.log("AUDITING ", action);

  try {
    const createdAuditInventory = await prisma.inventoryAudit.create({
      data: {
        action,
        performedById: audit.createdById,
        performedBy: audit.createdByName,
        available: audit.inventory.available,
        defective: audit.inventory.defective,
        mrp: audit.inventory.mrp,
        sellingPrice: audit.inventory.sellingPrice,
        sku: audit.inventory.sku,
        sold: audit.inventory.sold,
        updatedAt: audit.inventory.updatedAt,
        createdAt: audit.inventory.createdAt,
        inventoryId: audit.inventory.id,
        productName: audit.inventory.product.name,
      },
    });

    return { audit: createdAuditInventory };
  } catch (error) {
    console.log(error);

    Sentry.captureException(error);
    return { error };
  }
}
