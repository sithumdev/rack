/*
  Warnings:

  - Added the required column `available` to the `InventoryAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `InventoryAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defective` to the `InventoryAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inventoryId` to the `InventoryAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mrp` to the `InventoryAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `InventoryAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellingPrice` to the `InventoryAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `InventoryAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sold` to the `InventoryAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `InventoryAudit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InventoryAudit" ADD COLUMN     "available" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "defective" INTEGER NOT NULL,
ADD COLUMN     "inventoryId" INTEGER NOT NULL,
ADD COLUMN     "mrp" INTEGER NOT NULL,
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "sellingPrice" INTEGER NOT NULL,
ADD COLUMN     "sku" TEXT NOT NULL,
ADD COLUMN     "sold" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
