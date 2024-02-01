/*
  Warnings:

  - Added the required column `count` to the `ProductReporting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductReporting" ADD COLUMN     "count" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "ReportMode";
