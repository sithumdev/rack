import { CreateUpdateRelease } from "@/app/_features/releases";
import { getAllAvailableInventory } from "@/app/_lib/inventory";
import { getSalesRepresentatives } from "@/app/_lib/salesrep";
import { createServerSupabaseClient } from "@/app/_lib/supabase-server";
import { InventoryType } from "@/app/_lib/types";
import { getUserByEmail } from "@/app/_lib/users";
import { Spinner } from "@primer/react";
import { SalesRep } from "@prisma/client";

async function ReleaseIntermediate({
  email,
  inventories,
  salesReps,
}: {
  email: string;
  inventories: InventoryType[];
  salesReps: SalesRep[];
}) {
  const { user } = await getUserByEmail(email);

  return (
    <>
      {user && (
        <CreateUpdateRelease
          currentUser={user}
          inventories={inventories}
          salesReps={salesReps}
        />
      )}
    </>
  );
}

export default async function NewRelese() {
  const { inventory } = await getAllAvailableInventory();
  const { salesRepresentatives } = await getSalesRepresentatives();

  const {
    data: { session },
  } = await createServerSupabaseClient().auth.getSession();

  if (inventory && salesRepresentatives && session && session.user.email) {
    return (
      <ReleaseIntermediate
        inventories={inventory}
        email={session.user.email}
        salesReps={salesRepresentatives}
      />
    );
  }

  return <Spinner />;
}
