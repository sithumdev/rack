import { Spinner } from "@primer/react";
import { PurchasesTable } from "../_features/purchases";
import { getInventory } from "../_lib/inventory";
import { getReleaseInvoices } from "../_lib/release";
import { supabaseClientServer } from "../_lib/supabase-server";
import { InventoryType, ReleaseType } from "../_lib/types";
import { getUserByEmail } from "../_lib/users";
import { ReleasesTable } from "../_features/releases";

async function ReleaseIntermediate({
  email,
  inventories,
  releases,
}: {
  email: string;
  releases: ReleaseType[];
  inventories: InventoryType[];
}) {
  const { user } = await getUserByEmail(email);

  return (
    <>
      {user && (
        <ReleasesTable
          rows={releases}
          inventories={inventories}
          currentUser={user}
        />
      )}
    </>
  );
}

export default async function Releases() {
  const { releaseInvoices } = await getReleaseInvoices();
  const { inventory } = await getInventory();

  const {
    data: { session },
  } = await supabaseClientServer.auth.getSession();

  if (releaseInvoices && inventory && session && session.user.email) {
    return (
      <ReleaseIntermediate
        releases={releaseInvoices}
        inventories={inventory}
        email={session.user.email}
      />
    );
  }

  return <Spinner />;
}
