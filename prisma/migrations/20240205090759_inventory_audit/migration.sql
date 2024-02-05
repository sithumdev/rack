-- CreateEnum
CREATE TYPE "AUDIT_ACTION" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "InventoryAudit" (
    "id" SERIAL NOT NULL,
    "action" "AUDIT_ACTION" NOT NULL,
    "inventory" JSONB NOT NULL,
    "performedById" INTEGER NOT NULL,
    "performedBy" TEXT NOT NULL,
    "performedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryAudit_pkey" PRIMARY KEY ("id")
);
