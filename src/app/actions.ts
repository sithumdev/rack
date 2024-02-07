"use server";

import { revalidatePath } from "next/cache";
import { createCategory } from "./_lib/categories";
import { createInventory, updateInventory } from "./_lib/inventory";
import { createMobileInventory } from "./_lib/mobile-inventory";
import { createProduct, updateProduct } from "./_lib/products";
import { createPurchaseInvoice } from "./_lib/purchase";
import { createReleaseInvoice } from "./_lib/release";
import { createSalesrep } from "./_lib/salesrep";
import {
  CreateSalesRepPurchase,
  createSalesRepPurchaseInvoice,
} from "./_lib/salesrep-purchase";
import { createUser } from "./_lib/users";

export async function createUserAction(user: any) {
  await createUser(user);
  revalidatePath("/");
}

export async function createProductAction(product: any) {
  await createProduct(product);
  revalidatePath("/");
}

export async function updateProductAction(product: any) {
  await updateProduct(product);
  revalidatePath("/");
}

export async function createCategoryAction(category: any) {
  await createCategory(category);
  revalidatePath("/");
}

export async function createInventoryAction(inventory: any) {
  await createInventory(inventory);
  revalidatePath("/");
}

export async function updateInventoryAction(inventory: any) {
  await updateInventory(inventory);
  revalidatePath("/");
}

export async function createPurchaseInvoiceAction(invoice: any) {
  await createPurchaseInvoice(invoice);
  revalidatePath("/");
}

export async function createReleaseInvoiceAction(invoice: any) {
  await createReleaseInvoice(invoice);
  revalidatePath("/");
}

export async function createSalesRepAction(salesRep: any) {
  await createSalesrep(salesRep);
  revalidatePath("/");
}

export async function createMobileInventoryAction(inventory: any) {
  await createMobileInventory(inventory);
  revalidatePath("/");
}

export async function createSalesRepPurchaseInvoiceAction(
  invoice: CreateSalesRepPurchase
) {
  await createSalesRepPurchaseInvoice(invoice);
  revalidatePath("/");
}
