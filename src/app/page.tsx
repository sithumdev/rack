import { UsersTable } from "@/app/_features/users";
import WrapperContainer from "./_components/wrapper-container";
import { getUsers } from "./lib/users";

export default async function Home() {
  const { users } = await getUsers();

  return (
    <WrapperContainer>{users && <UsersTable rows={users} />}</WrapperContainer>
  );
}
