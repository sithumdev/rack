/*
  Warnings:

  - You are about to drop the column `businessId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `businessId` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `businessId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productBrandInventoryId` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the `Brand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BrandAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BrandAuditHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Business` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BusinessAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BusinessAuditHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategoryAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategoryAuditHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmployeeAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmployeeAuditHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InventoryAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InventoryAuditHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MobileInventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MobileInventoryAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MobileInventoryAuditHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductAuditHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductBrandInventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductBrandMobileInventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SupplierAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SupplierAuditHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserBusiness` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserBusinessPermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPreferences` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[barcode]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,price]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "BrandAuditHistory" DROP CONSTRAINT "BrandAuditHistory_brandAuditId_fkey";

-- DropForeignKey
ALTER TABLE "BrandAuditHistory" DROP CONSTRAINT "BrandAuditHistory_changedById_fkey";

-- DropForeignKey
ALTER TABLE "Business" DROP CONSTRAINT "Business_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Business" DROP CONSTRAINT "Business_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "BusinessAuditHistory" DROP CONSTRAINT "BusinessAuditHistory_businessAuditId_fkey";

-- DropForeignKey
ALTER TABLE "BusinessAuditHistory" DROP CONSTRAINT "BusinessAuditHistory_changedById_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_businessId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryAuditHistory" DROP CONSTRAINT "CategoryAuditHistory_categoryAuditId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryAuditHistory" DROP CONSTRAINT "CategoryAuditHistory_changedById_fkey";

-- DropForeignKey
ALTER TABLE "EmployeeAuditHistory" DROP CONSTRAINT "EmployeeAuditHistory_changedById_fkey";

-- DropForeignKey
ALTER TABLE "EmployeeAuditHistory" DROP CONSTRAINT "EmployeeAuditHistory_employeeAuditId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_businessId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryAuditHistory" DROP CONSTRAINT "InventoryAuditHistory_changedById_fkey";

-- DropForeignKey
ALTER TABLE "InventoryAuditHistory" DROP CONSTRAINT "InventoryAuditHistory_inventoryAuditId_fkey";

-- DropForeignKey
ALTER TABLE "MobileInventory" DROP CONSTRAINT "MobileInventory_createdById_fkey";

-- DropForeignKey
ALTER TABLE "MobileInventory" DROP CONSTRAINT "MobileInventory_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "MobileInventory" DROP CONSTRAINT "MobileInventory_userBusinessId_fkey";

-- DropForeignKey
ALTER TABLE "MobileInventoryAuditHistory" DROP CONSTRAINT "MobileInventoryAuditHistory_changedById_fkey";

-- DropForeignKey
ALTER TABLE "MobileInventoryAuditHistory" DROP CONSTRAINT "MobileInventoryAuditHistory_mobileInventoryAuditId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_businessId_fkey";

-- DropForeignKey
ALTER TABLE "ProductAuditHistory" DROP CONSTRAINT "ProductAuditHistory_changedById_fkey";

-- DropForeignKey
ALTER TABLE "ProductAuditHistory" DROP CONSTRAINT "ProductAuditHistory_productAuditId_fkey";

-- DropForeignKey
ALTER TABLE "ProductBrandInventory" DROP CONSTRAINT "ProductBrandInventory_brandId_fkey";

-- DropForeignKey
ALTER TABLE "ProductBrandInventory" DROP CONSTRAINT "ProductBrandInventory_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductBrandInventory" DROP CONSTRAINT "ProductBrandInventory_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductBrandMobileInventory" DROP CONSTRAINT "ProductBrandMobileInventory_brandId_fkey";

-- DropForeignKey
ALTER TABLE "ProductBrandMobileInventory" DROP CONSTRAINT "ProductBrandMobileInventory_mobileInventoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductBrandMobileInventory" DROP CONSTRAINT "ProductBrandMobileInventory_productId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_productBrandInventoryId_fkey";

-- DropForeignKey
ALTER TABLE "Release" DROP CONSTRAINT "Release_productBrandInventoryId_fkey";

-- DropForeignKey
ALTER TABLE "SupplierAuditHistory" DROP CONSTRAINT "SupplierAuditHistory_changedById_fkey";

-- DropForeignKey
ALTER TABLE "SupplierAuditHistory" DROP CONSTRAINT "SupplierAuditHistory_supplierAuditId_fkey";

-- DropForeignKey
ALTER TABLE "UserBusiness" DROP CONSTRAINT "UserBusiness_assignedById_fkey";

-- DropForeignKey
ALTER TABLE "UserBusiness" DROP CONSTRAINT "UserBusiness_businessId_fkey";

-- DropForeignKey
ALTER TABLE "UserBusiness" DROP CONSTRAINT "UserBusiness_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserBusinessPermissions" DROP CONSTRAINT "UserBusinessPermissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "UserBusinessPermissions" DROP CONSTRAINT "UserBusinessPermissions_userBusinessId_fkey";

-- DropForeignKey
ALTER TABLE "UserPreferences" DROP CONSTRAINT "UserPreferences_selectedBusinessId_fkey";

-- DropForeignKey
ALTER TABLE "UserPreferences" DROP CONSTRAINT "UserPreferences_userId_fkey";

-- DropIndex
DROP INDEX "Category_businessId_name_key";

-- DropIndex
DROP INDEX "Inventory_businessId_key";

-- DropIndex
DROP INDEX "Product_businessId_barcode_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "businessId";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "businessId",
ADD COLUMN     "productId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "businessId";

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "productBrandInventoryId",
DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "type" "USER_TYPE" NOT NULL;

-- DropTable
DROP TABLE "Brand";

-- DropTable
DROP TABLE "BrandAudit";

-- DropTable
DROP TABLE "BrandAuditHistory";

-- DropTable
DROP TABLE "Business";

-- DropTable
DROP TABLE "BusinessAudit";

-- DropTable
DROP TABLE "BusinessAuditHistory";

-- DropTable
DROP TABLE "CategoryAudit";

-- DropTable
DROP TABLE "CategoryAuditHistory";

-- DropTable
DROP TABLE "EmployeeAudit";

-- DropTable
DROP TABLE "EmployeeAuditHistory";

-- DropTable
DROP TABLE "InventoryAudit";

-- DropTable
DROP TABLE "InventoryAuditHistory";

-- DropTable
DROP TABLE "MobileInventory";

-- DropTable
DROP TABLE "MobileInventoryAudit";

-- DropTable
DROP TABLE "MobileInventoryAuditHistory";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "ProductAudit";

-- DropTable
DROP TABLE "ProductAuditHistory";

-- DropTable
DROP TABLE "ProductBrandInventory";

-- DropTable
DROP TABLE "ProductBrandMobileInventory";

-- DropTable
DROP TABLE "SupplierAudit";

-- DropTable
DROP TABLE "SupplierAuditHistory";

-- DropTable
DROP TABLE "UserBusiness";

-- DropTable
DROP TABLE "UserBusinessPermissions";

-- DropTable
DROP TABLE "UserPreferences";

-- DropEnum
DROP TYPE "AUDIT_CHANGE_TYPE";

-- DropEnum
DROP TYPE "COLOR_THEME";

-- DropEnum
DROP TYPE "PERMISSION_LEVEL";

-- CreateTable
CREATE TABLE "PurchaseItem" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER NOT NULL,
    "purchaseId" INTEGER NOT NULL,

    CONSTRAINT "PurchaseItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReleaseItem" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER NOT NULL,
    "releaseId" INTEGER NOT NULL,

    CONSTRAINT "ReleaseItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_barcode_key" ON "Product"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_price_key" ON "Product"("name", "price");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseItem" ADD CONSTRAINT "ReleaseItem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseItem" ADD CONSTRAINT "ReleaseItem_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseItem" ADD CONSTRAINT "ReleaseItem_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
