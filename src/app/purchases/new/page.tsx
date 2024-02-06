import { CreateUpdatePurchase } from "@/app/_features/purchases";
import { getAllInventories } from "@/app/_lib/inventory";
import { createServerSupabaseClient } from "@/app/_lib/supabase-server";
import { InventoryType } from "@/app/_lib/types";
import { getUserByEmail } from "@/app/_lib/users";
import { Spinner } from "@primer/react";

async function PurchasesIntermediate({
  email,
  inventories,
}: {
  email: string;
  inventories: InventoryType[];
}) {
  const { user } = await getUserByEmail(email);

  return (
    <>
      {user && (
        <CreateUpdatePurchase currentUser={user} inventories={inventories} />
      )}
    </>
  );
}

export default async function NewPurchase() {
  const { inventory } = await getAllInventories();

  const {
    data: { session },
  } = await createServerSupabaseClient().auth.getSession();

  if (inventory && session && session.user.email) {
    return (
      <PurchasesIntermediate
        inventories={inventory}
        email={session.user.email}
      />
    );
  }

  return <Spinner />;
}
