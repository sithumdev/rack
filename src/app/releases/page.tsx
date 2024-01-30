import { Spinner } from "@primer/react";
import { ReleasesTable } from "../_features/releases";
import { getInventory } from "../_lib/inventory";
import { getReleaseInvoices } from "../_lib/release";
import { supabaseClientServer } from "../_lib/supabase-server";

export default async function Releases() {
  const { releases } = await getReleaseInvoices();
  const { inventory } = await getInventory();

  const {
    data: { session },
  } = await supabaseClientServer.auth.getSession();

  if (releases && inventory && session && session.user.email) {
    return <ReleasesTable rows={releases} />;
  }

  return <Spinner />;
}
