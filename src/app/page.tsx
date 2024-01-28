import UsersTable from "./components/table";
import WrapperContainer from "./components/wrapper-container";
import { getUsers } from "./lib/users";

export default async function Home() {
  const { users } = await getUsers();

  return (
    <WrapperContainer>{users && <UsersTable rows={users} />}</WrapperContainer>
  );
}
