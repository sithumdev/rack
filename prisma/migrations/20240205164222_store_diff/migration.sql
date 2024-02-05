/*
  Warnings:

  - You are about to drop the column `available` on the `InventoryAudit` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `InventoryAudit` table. All the data in the column will be lost.
  - You are about to drop the column `defective` on the `InventoryAudit` table. All the data in the column will be lost.
  - You are about to drop the column `sellingPrice` on the `InventoryAudit` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `InventoryAudit` table. All the data in the column will be lost.
  - You are about to drop the column `sold` on the `InventoryAudit` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `InventoryAudit` table. All the data in the column will be lost.
  - Added the required column `difference` to the `InventoryAudit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InventoryAudit" DROP COLUMN "available",
DROP COLUMN "createdAt",
DROP COLUMN "defective",
DROP COLUMN "sellingPrice",
DROP COLUMN "sku",
DROP COLUMN "sold",
DROP COLUMN "updatedAt",
ADD COLUMN     "difference" JSONB NOT NULL;
