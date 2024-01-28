"use server";

import { revalidatePath } from "next/cache";
import { createUser } from "./lib/users";

export async function createUserAction(user: any) {
  await createUser(user);
  revalidatePath("/");
}
