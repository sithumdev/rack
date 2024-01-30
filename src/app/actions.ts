"use server";

import { revalidatePath } from "next/cache";
import { createBusiness } from "./_lib/business";
import { createCategory } from "./_lib/categories";
import { createProduct } from "./_lib/products";
import { createUser } from "./_lib/users";
import { createPermission } from "./_lib/permissions";

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
