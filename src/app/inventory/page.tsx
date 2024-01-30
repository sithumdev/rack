import { Spinner } from "@primer/react";
import { Brand, Product } from "@prisma/client";
import { InventoryTable } from "../_features/inventory";
import { getBrands } from "../_lib/brands";
import { getInventory } from "../_lib/inventory";
import { getProducts } from "../_lib/products";
import { supabaseClientServer } from "../_lib/supabase-server";
import { InventoryType } from "../_lib/types";
import { getUserByEmail } from "../_lib/users";

async function InventoryIntermediate({
  email,
  inventory,
  products,
  brands,
}: {
  email: string;
  inventory: InventoryType[];
  products: Product[];
  brands: Brand[];
}) {
  const { user } = await getUserByEmail(email);

  return (
    <>
      {user && (
        <InventoryTable
          rows={inventory}
          brands={brands}
          products={products}
          currentUser={user}
        />
      )}
    </>
  );
}

export default async function Inventories() {
  const { products } = await getProducts();
  const { brands } = await getBrands();
  const { inventory } = await getInventory();

  const {
    data: { session },
  } = await supabaseClientServer.auth.getSession();

  if (inventory && products && brands && session && session.user.email) {
    return (
      <InventoryIntermediate
        inventory={inventory}
        brands={brands}
        products={products}
        email={session.user.email}
      />
    );
  }

  return <Spinner />;
}
