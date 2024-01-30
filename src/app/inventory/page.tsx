import { Spinner } from "@primer/react";
import { Product } from "@prisma/client";
import { InventoryTable } from "../_features/inventory";
import { getProducts } from "../_lib/products";
import { supabaseClientServer } from "../_lib/supabase-server";
import { getUserByEmail } from "../_lib/users";

async function InventoryIntermediate({
  email,
  products,
}: {
  email: string;
  products: Product[];
}) {
  const { user } = await getUserByEmail(email);

  return (
    <>{user && <InventoryTable products={products} currentUser={user} />}</>
  );
}

export default async function Inventories() {
  const { products } = await getProducts();

  const {
    data: { session },
  } = await supabaseClientServer.auth.getSession();

  if (products && session && session.user.email) {
    return (
      <InventoryIntermediate products={products} email={session.user.email} />
    );
  }

  return <Spinner />;
}
