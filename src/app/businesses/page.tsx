import { Spinner } from "@primer/react";
import { Business } from "@prisma/client";
import { BusinessTable } from "../_features/businesses";
import { getBusinesses } from "../_lib/business";
import { getUserByEmail } from "../_lib/users";
import { supabaseClientServer } from "../_lib/supabase-server";

async function BusinessIntermediate({
  email,
  businesses,
}: {
  email: string;
  businesses: Business[];
}) {
  const { user } = await getUserByEmail(email);

  return <>{user && <BusinessTable rows={businesses} currentUser={user} />} </>;
}

export default async function Users() {
  const { businesses } = await getBusinesses();

  const {
    data: { session },
  } = await supabaseClientServer.auth.getSession();

  if (businesses && session && session.user.email) {
    return (
      <BusinessIntermediate
        businesses={businesses}
        email={session.user.email}
      />
    );
  }

  return <Spinner />;
}
