-- CreateEnum
CREATE TYPE "USER_TYPE" AS ENUM ('OWNER', 'MANAGER', 'EMPLOYEE', 'SUPPLIER');

-- CreateEnum
CREATE TYPE "PERMISSION_LEVEL" AS ENUM ('BUSINESS', 'EMPLOYEE', 'INVENTORY');

-- CreateEnum
CREATE TYPE "COLOR_THEME" AS ENUM ('LIGHT', 'DARK');

-- CreateEnum
CREATE TYPE "AUDIT_CHANGE_TYPE" AS ENUM ('CREATION', 'UPDATION', 'DELETION');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "avatar" VARCHAR(255),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "notificationEnabled" BOOLEAN NOT NULL DEFAULT false,
    "notificationToken" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "level" "PERMISSION_LEVEL" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255),
    "email" VARCHAR(255),
    "avatar" VARCHAR(255),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "address" VARCHAR(255),
    "mobile" VARCHAR(11),
    "fax" VARCHAR(11),
    "website" VARCHAR(50),
    "longitude" VARCHAR(255),
    "latitude" VARCHAR(255),
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedById" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBusiness" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "businessId" INTEGER NOT NULL,
    "type" "USER_TYPE" NOT NULL DEFAULT 'EMPLOYEE',
    "assignedById" INTEGER NOT NULL,

    CONSTRAINT "UserBusiness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBusinessPermissions" (
    "id" SERIAL NOT NULL,
    "userBusinessId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "UserBusinessPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER NOT NULL,
    "businessId" INTEGER NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER NOT NULL,
    "businessId" INTEGER NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER NOT NULL,
    "businessId" INTEGER NOT NULL,
    "barcode" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" SERIAL NOT NULL,
    "mrp" INTEGER NOT NULL,
    "sellingPrice" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "available" INTEGER NOT NULL,
    "sold" INTEGER NOT NULL,
    "defective" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER NOT NULL,
    "businessId" INTEGER NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductBrandInventory" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "brandId" INTEGER NOT NULL,

    CONSTRAINT "ProductBrandInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobileInventory" (
    "id" SERIAL NOT NULL,
    "mrp" INTEGER NOT NULL,
    "sellingPrice" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "available" INTEGER NOT NULL,
    "sold" INTEGER NOT NULL,
    "defective" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER NOT NULL,
    "userBusinessId" INTEGER NOT NULL,

    CONSTRAINT "MobileInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductBrandMobileInventory" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "mobileInventoryId" INTEGER NOT NULL,
    "brandId" INTEGER NOT NULL,

    CONSTRAINT "ProductBrandMobileInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" SERIAL NOT NULL,
    "theme" "COLOR_THEME" NOT NULL DEFAULT 'LIGHT',
    "selectedBusinessId" INTEGER,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" SERIAL NOT NULL,
    "productBrandInventoryId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessAudit" (
    "id" SERIAL NOT NULL,
    "businessId" INTEGER NOT NULL,

    CONSTRAINT "BusinessAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessAuditHistory" (
    "id" SERIAL NOT NULL,
    "businessAuditId" INTEGER NOT NULL,
    "type" "AUDIT_CHANGE_TYPE" NOT NULL,
    "change" JSONB,
    "changedById" INTEGER NOT NULL,
    "changedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusinessAuditHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeAudit" (
    "id" SERIAL NOT NULL,
    "businessId" INTEGER NOT NULL,
    "employmentId" INTEGER NOT NULL,

    CONSTRAINT "EmployeeAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeAuditHistory" (
    "id" SERIAL NOT NULL,
    "employeeAuditId" INTEGER NOT NULL,
    "type" "AUDIT_CHANGE_TYPE" NOT NULL,
    "change" JSONB,
    "changedById" INTEGER NOT NULL,
    "changedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeAuditHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandAudit" (
    "id" SERIAL NOT NULL,
    "businessId" INTEGER NOT NULL,
    "brandId" INTEGER NOT NULL,

    CONSTRAINT "BrandAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandAuditHistory" (
    "id" SERIAL NOT NULL,
    "brandAuditId" INTEGER NOT NULL,
    "type" "AUDIT_CHANGE_TYPE" NOT NULL,
    "change" JSONB,
    "changedById" INTEGER NOT NULL,
    "changedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrandAuditHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryAudit" (
    "id" SERIAL NOT NULL,
    "businessId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "CategoryAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryAuditHistory" (
    "id" SERIAL NOT NULL,
    "categoryAuditId" INTEGER NOT NULL,
    "type" "AUDIT_CHANGE_TYPE" NOT NULL,
    "change" JSONB,
    "changedById" INTEGER NOT NULL,
    "changedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoryAuditHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductAudit" (
    "id" SERIAL NOT NULL,
    "businessId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductAuditHistory" (
    "id" SERIAL NOT NULL,
    "productAuditId" INTEGER NOT NULL,
    "type" "AUDIT_CHANGE_TYPE" NOT NULL,
    "change" JSONB,
    "changedById" INTEGER NOT NULL,
    "changedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductAuditHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryAudit" (
    "id" SERIAL NOT NULL,
    "businessId" INTEGER NOT NULL,
    "inventoryId" INTEGER NOT NULL,

    CONSTRAINT "InventoryAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryAuditHistory" (
    "id" SERIAL NOT NULL,
    "inventoryAuditId" INTEGER NOT NULL,
    "type" "AUDIT_CHANGE_TYPE" NOT NULL,
    "change" JSONB,
    "changedById" INTEGER NOT NULL,
    "changedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryAuditHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierAudit" (
    "id" SERIAL NOT NULL,
    "businessId" INTEGER NOT NULL,
    "employmentId" INTEGER NOT NULL,

    CONSTRAINT "SupplierAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierAuditHistory" (
    "id" SERIAL NOT NULL,
    "supplierAuditId" INTEGER NOT NULL,
    "type" "AUDIT_CHANGE_TYPE" NOT NULL,
    "change" JSONB,
    "changedById" INTEGER NOT NULL,
    "changedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupplierAuditHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobileInventoryAudit" (
    "id" SERIAL NOT NULL,
    "businessId" INTEGER NOT NULL,
    "mobileInventoryId" INTEGER NOT NULL,

    CONSTRAINT "MobileInventoryAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobileInventoryAuditHistory" (
    "id" SERIAL NOT NULL,
    "mobileInventoryAuditId" INTEGER NOT NULL,
    "type" "AUDIT_CHANGE_TYPE" NOT NULL,
    "change" JSONB,
    "changedById" INTEGER NOT NULL,
    "changedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MobileInventoryAuditHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Business_createdById_name_key" ON "Business"("createdById", "name");

-- CreateIndex
CREATE UNIQUE INDEX "UserBusiness_userId_businessId_key" ON "UserBusiness"("userId", "businessId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBusinessPermissions_userBusinessId_permissionId_key" ON "UserBusinessPermissions"("userBusinessId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_businessId_name_key" ON "Brand"("businessId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_businessId_name_key" ON "Category"("businessId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_businessId_barcode_key" ON "Product"("businessId", "barcode");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_businessId_key" ON "Inventory"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "MobileInventory_userBusinessId_key" ON "MobileInventory"("userBusinessId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessAudit_businessId_key" ON "BusinessAudit"("businessId");

-- CreateIndex
CREATE INDEX "BusinessAudit_businessId_idx" ON "BusinessAudit"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeAudit_employmentId_key" ON "EmployeeAudit"("employmentId");

-- CreateIndex
CREATE INDEX "EmployeeAudit_businessId_employmentId_idx" ON "EmployeeAudit"("businessId", "employmentId");

-- CreateIndex
CREATE UNIQUE INDEX "BrandAudit_brandId_key" ON "BrandAudit"("brandId");

-- CreateIndex
CREATE INDEX "BrandAudit_businessId_brandId_idx" ON "BrandAudit"("businessId", "brandId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryAudit_categoryId_key" ON "CategoryAudit"("categoryId");

-- CreateIndex
CREATE INDEX "CategoryAudit_businessId_categoryId_idx" ON "CategoryAudit"("businessId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAudit_productId_key" ON "ProductAudit"("productId");

-- CreateIndex
CREATE INDEX "ProductAudit_businessId_productId_idx" ON "ProductAudit"("businessId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryAudit_inventoryId_key" ON "InventoryAudit"("inventoryId");

-- CreateIndex
CREATE INDEX "InventoryAudit_businessId_inventoryId_idx" ON "InventoryAudit"("businessId", "inventoryId");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierAudit_employmentId_key" ON "SupplierAudit"("employmentId");

-- CreateIndex
CREATE INDEX "SupplierAudit_businessId_employmentId_idx" ON "SupplierAudit"("businessId", "employmentId");

-- CreateIndex
CREATE UNIQUE INDEX "MobileInventoryAudit_mobileInventoryId_key" ON "MobileInventoryAudit"("mobileInventoryId");

-- CreateIndex
CREATE INDEX "MobileInventoryAudit_businessId_mobileInventoryId_idx" ON "MobileInventoryAudit"("businessId", "mobileInventoryId");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBusiness" ADD CONSTRAINT "UserBusiness_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBusiness" ADD CONSTRAINT "UserBusiness_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBusiness" ADD CONSTRAINT "UserBusiness_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBusinessPermissions" ADD CONSTRAINT "UserBusinessPermissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBusinessPermissions" ADD CONSTRAINT "UserBusinessPermissions_userBusinessId_fkey" FOREIGN KEY ("userBusinessId") REFERENCES "UserBusiness"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBrandInventory" ADD CONSTRAINT "ProductBrandInventory_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBrandInventory" ADD CONSTRAINT "ProductBrandInventory_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBrandInventory" ADD CONSTRAINT "ProductBrandInventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobileInventory" ADD CONSTRAINT "MobileInventory_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobileInventory" ADD CONSTRAINT "MobileInventory_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobileInventory" ADD CONSTRAINT "MobileInventory_userBusinessId_fkey" FOREIGN KEY ("userBusinessId") REFERENCES "UserBusiness"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBrandMobileInventory" ADD CONSTRAINT "ProductBrandMobileInventory_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBrandMobileInventory" ADD CONSTRAINT "ProductBrandMobileInventory_mobileInventoryId_fkey" FOREIGN KEY ("mobileInventoryId") REFERENCES "MobileInventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBrandMobileInventory" ADD CONSTRAINT "ProductBrandMobileInventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_selectedBusinessId_fkey" FOREIGN KEY ("selectedBusinessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_productBrandInventoryId_fkey" FOREIGN KEY ("productBrandInventoryId") REFERENCES "ProductBrandInventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessAuditHistory" ADD CONSTRAINT "BusinessAuditHistory_businessAuditId_fkey" FOREIGN KEY ("businessAuditId") REFERENCES "BusinessAudit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessAuditHistory" ADD CONSTRAINT "BusinessAuditHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeAuditHistory" ADD CONSTRAINT "EmployeeAuditHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeAuditHistory" ADD CONSTRAINT "EmployeeAuditHistory_employeeAuditId_fkey" FOREIGN KEY ("employeeAuditId") REFERENCES "EmployeeAudit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandAuditHistory" ADD CONSTRAINT "BrandAuditHistory_brandAuditId_fkey" FOREIGN KEY ("brandAuditId") REFERENCES "BrandAudit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandAuditHistory" ADD CONSTRAINT "BrandAuditHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryAuditHistory" ADD CONSTRAINT "CategoryAuditHistory_categoryAuditId_fkey" FOREIGN KEY ("categoryAuditId") REFERENCES "CategoryAudit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryAuditHistory" ADD CONSTRAINT "CategoryAuditHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAuditHistory" ADD CONSTRAINT "ProductAuditHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAuditHistory" ADD CONSTRAINT "ProductAuditHistory_productAuditId_fkey" FOREIGN KEY ("productAuditId") REFERENCES "ProductAudit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAuditHistory" ADD CONSTRAINT "InventoryAuditHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAuditHistory" ADD CONSTRAINT "InventoryAuditHistory_inventoryAuditId_fkey" FOREIGN KEY ("inventoryAuditId") REFERENCES "InventoryAudit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierAuditHistory" ADD CONSTRAINT "SupplierAuditHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierAuditHistory" ADD CONSTRAINT "SupplierAuditHistory_supplierAuditId_fkey" FOREIGN KEY ("supplierAuditId") REFERENCES "SupplierAudit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobileInventoryAuditHistory" ADD CONSTRAINT "MobileInventoryAuditHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobileInventoryAuditHistory" ADD CONSTRAINT "MobileInventoryAuditHistory_mobileInventoryAuditId_fkey" FOREIGN KEY ("mobileInventoryAuditId") REFERENCES "MobileInventoryAudit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
