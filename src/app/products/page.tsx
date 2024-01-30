import { Spinner } from "@primer/react";
import { Category, Product } from "@prisma/client";
import { ProductsTable } from "../_features/products";
import { getProducts } from "../_lib/products";
import { supabaseClientServer } from "../_lib/supabase-server";
import { getUserByEmail } from "../_lib/users";
import { getCategories } from "../_lib/categories";

async function ProductsIntermediate({
  email,
  products,
  categories,
}: {
  email: string;
  products: Product[];
  categories: Category[];
}) {
  const { user } = await getUserByEmail(email);

  return (
    <>
      {user && (
        <ProductsTable
          rows={products}
          categories={categories}
          currentUser={user}
        />
      )}{" "}
    </>
  );
}

export default async function Products() {
  const { products } = await getProducts();
  const { categories } = await getCategories();

  const {
    data: { session },
  } = await supabaseClientServer.auth.getSession();

  if (products && categories && session && session.user.email) {
    return (
      <ProductsIntermediate
        products={products}
        categories={categories}
        email={session.user.email}
      />
    );
  }

  return <Spinner />;
}
