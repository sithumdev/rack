"use server";

import { revalidatePath } from "next/cache";
import { createBusiness } from "./_lib/business";
import { createCategory } from "./_lib/categories";
import { createProduct } from "./_lib/products";
import { createUser } from "./_lib/users";
import { createPermission } from "./_lib/permissions";
import { createInventory } from "./_lib/inventory";
import { createBrand } from "./_lib/brands";
import { createPurchaseInvoice } from "./_lib/purchase";

export async function createUserAction(user: any) {
  await createUser(user);
  revalidatePath("/");
}

export async function createBusinessAction(business: any) {
  await createBusiness(business);
  revalidatePath("/");
}

export async function createProductAction(product: any) {
  await createProduct(product);
  revalidatePath("/");
}

export async function createCategoryAction(category: any) {
  await createCategory(category);
  revalidatePath("/");
}

export async function createPermissionAction(permission: any) {
  await createPermission(permission);
  revalidatePath("/");
}

export async function createInventoryAction(inventory: any) {
  await createInventory(inventory);
  revalidatePath("/");
}

export async function createBrandAction(brand: any) {
  await createBrand(brand);
  revalidatePath("/");
}

export async function createPurchaseInvoiceAction(invoice: any) {
  await createPurchaseInvoice(invoice);
  revalidatePath("/");
}
