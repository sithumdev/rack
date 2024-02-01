/*
  Warnings:

  - Added the required column `whom` to the `ProductReporting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductReporting" ADD COLUMN     "whom" TEXT NOT NULL;
