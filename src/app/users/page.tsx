import { Spinner } from "@primer/react";
import { UsersTable } from "../_features/users";
import { getUserByEmail, getUsers } from "../_lib/users";
import { User } from "@prisma/client";
import { createServerSupabaseClient } from "../_lib/supabase-server";

async function UsersIntermediate({
  email,
  users,
}: {
  email: string;
  users: User[];
}) {
  const { user } = await getUserByEmail(email);

  return <UsersTable rows={users} currentUser={user} />;
}

export default async function Users() {
  const { users } = await getUsers();

  const {
    data: { session },
  } = await createServerSupabaseClient().auth.getSession();

  if (users && session && session.user.email) {
    return <UsersIntermediate users={users} email={session.user.email} />;
  }

  return <Spinner />;
}
