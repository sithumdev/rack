import { Spinner } from "@primer/react";
import { Category } from "@prisma/client";
import { CategoriesTable } from "../_features/categories";
import { getCategories } from "../_lib/categories";
import { supabaseClientServer } from "../_lib/supabase-server";
import { getUserByEmail } from "../_lib/users";

async function CategoriesIntermediate({
  email,
  categories,
}: {
  email: string;
  categories: Category[];
}) {
  const { user } = await getUserByEmail(email);

  return (
    <>{user && <CategoriesTable rows={categories} currentUser={user} />}</>
  );
}

export default async function Categories() {
  const { categories } = await getCategories();

  const {
    data: { session },
  } = await supabaseClientServer.auth.getSession();

  if (categories && session && session.user.email) {
    return (
      <CategoriesIntermediate
        categories={categories}
        email={session.user.email}
      />
    );
  }

  return <Spinner />;
}
