import { Spinner } from "@primer/react";
import { PurchasesTable } from "../_features/purchases";
import { getInventory } from "../_lib/inventory";
import { getPurchaseInvoices } from "../_lib/purchase";
import { supabaseClientServer } from "../_lib/supabase-server";

export default async function Purchases() {
  const { purchaseInvoices } = await getPurchaseInvoices();
  const { inventory } = await getInventory();

  const {
    data: { session },
  } = await supabaseClientServer.auth.getSession();

  if (purchaseInvoices && inventory && session && session.user.email) {
    return <PurchasesTable rows={purchaseInvoices} />;
  }

  return <Spinner />;
}
