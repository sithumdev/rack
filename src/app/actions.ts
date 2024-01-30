"use server";

import { revalidatePath } from "next/cache";
import { createCategory } from "./_lib/categories";
import { createInventory } from "./_lib/inventory";
import { createProduct } from "./_lib/products";
import { createPurchaseInvoice } from "./_lib/purchase";
import { createReleaseInvoice } from "./_lib/release";
import { createUser } from "./_lib/users";

export async function createUserAction(user: any) {
  await createUser(user);
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

export async function createInventoryAction(inventory: any) {
  await createInventory(inventory);
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
