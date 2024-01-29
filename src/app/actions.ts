"use server";

import { revalidatePath } from "next/cache";
import { createUser } from "./_lib/users";
import { createBusiness } from "./_lib/business";
import { supabaseClientServer } from "./_lib/supabase-server";
import { User } from "@supabase/supabase-js";

export async function createUserAction(user: any) {
  await createUser(user);
  revalidatePath("/");
}

export async function createBusinessAction(business: any) {
  await createBusiness(business);
  revalidatePath("/");
}
