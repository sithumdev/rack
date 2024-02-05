/*
  Warnings:

  - You are about to drop the column `difference` on the `InventoryAudit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InventoryAudit" DROP COLUMN "difference";

-- CreateTable
CREATE TABLE "AuditDifference" (
    "id" SERIAL NOT NULL,
    "lhs" TEXT NOT NULL,
    "rhs" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "auditId" INTEGER NOT NULL,

    CONSTRAINT "AuditDifference_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AuditDifference" ADD CONSTRAINT "AuditDifference_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "InventoryAudit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
