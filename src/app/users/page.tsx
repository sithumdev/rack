import { Spinner } from "@primer/react";
import { UsersTable } from "../_features/users";
import { getUsers } from "../_lib/users";

export default async function Users() {
  const { users } = await getUsers();

  if (users) {
    return <UsersTable rows={users} />;
  }

  return <Spinner />;
}
