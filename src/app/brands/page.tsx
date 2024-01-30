import { Spinner } from "@primer/react";
import { Brand } from "@prisma/client";
import { BrandsTable } from "../_features/brands";
import { getBrands } from "../_lib/brands";
import { supabaseClientServer } from "../_lib/supabase-server";
import { getUserByEmail } from "../_lib/users";

async function BrandsIntermediate({
  email,
  brands,
}: {
  email: string;
  brands: Brand[];
}) {
  const { user } = await getUserByEmail(email);

  return <>{user && <BrandsTable rows={brands} currentUser={user} />}</>;
}

export default async function Brands() {
  const { brands } = await getBrands();

  const {
    data: { session },
  } = await supabaseClientServer.auth.getSession();

  if (brands && session && session.user.email) {
    return <BrandsIntermediate brands={brands} email={session.user.email} />;
  }

  return <Spinner />;
}
