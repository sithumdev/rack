import { Spinner } from "@primer/react";
import { PurchasesTable } from "../_features/purchases";
import { getInventory } from "../_lib/inventory";
import { getPurchaseInvoices } from "../_lib/purchase";
import { supabaseClientServer } from "../_lib/supabase-server";
import { InventoryType, PurchaseType } from "../_lib/types";
import { getUserByEmail } from "../_lib/users";

async function PurchasesIntermediate({
  email,
  inventories,
  purchases,
}: {
  email: string;
  purchases: PurchaseType[];
  inventories: InventoryType[];
}) {
  const { user } = await getUserByEmail(email);

  return (
    <>
      {user && (
        <PurchasesTable
          rows={purchases}
          inventories={inventories}
          currentUser={user}
        />
      )}
    </>
  );
}

export default async function Categories() {
  const { purchaseInvoices } = await getPurchaseInvoices();
  const { inventory } = await getInventory();

  const {
    data: { session },
  } = await supabaseClientServer.auth.getSession();

  if (purchaseInvoices && inventory && session && session.user.email) {
    return (
      <PurchasesIntermediate
        purchases={purchaseInvoices}
        inventories={inventory}
        email={session.user.email}
      />
    );
  }

  return <Spinner />;
}
