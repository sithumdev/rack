/*
  Warnings:

  - Added the required column `inventoryId` to the `PurchaseItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inventoryId` to the `ReleaseItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PurchaseItem" ADD COLUMN     "inventoryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ReleaseItem" ADD COLUMN     "inventoryId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseItem" ADD CONSTRAINT "ReleaseItem_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
