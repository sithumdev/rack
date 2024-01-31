import { Spinner } from "@primer/react";
import { Category } from "@prisma/client";
import { ProductsTable } from "../_features/products";
import { getCategories } from "../_lib/categories";
import { supabaseClientServer } from "../_lib/supabase-server";
import { getUserByEmail } from "../_lib/users";

async function ProductsIntermediate({
  email,
  categories,
}: {
  email: string;
  categories: Category[];
}) {
  const { user } = await getUserByEmail(email);

  return (
    <>{user && <ProductsTable categories={categories} currentUser={user} />} </>
  );
}

export default async function Products() {
  const { categories } = await getCategories();

  const {
    data: { session },
  } = await supabaseClientServer.auth.getSession();

  if (categories && session && session.user.email) {
    return (
      <ProductsIntermediate
        categories={categories}
        email={session.user.email}
      />
    );
  }

  return <Spinner />;
}
