import { CreateUpdateRelease } from "@/app/_features/releases";
import { getInventory } from "@/app/_lib/inventory";
import { supabaseClientServer } from "@/app/_lib/supabase-server";
import { InventoryType } from "@/app/_lib/types";
import { getUserByEmail } from "@/app/_lib/users";
import { Spinner } from "@primer/react";

async function ReleaseIntermediate({
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
        <CreateUpdateRelease currentUser={user} inventories={inventories} />
      )}
    </>
  );
}

export default async function NewRelese() {
  const { inventory } = await getInventory();

  const {
    data: { session },
  } = await supabaseClientServer.auth.getSession();

  if (inventory && session && session.user.email) {
    return (
      <ReleaseIntermediate inventories={inventory} email={session.user.email} />
    );
  }

  return <Spinner />;
}
