import Header from "./components/header";
import UserCard from "./components/user-card";
import { getUsers } from "./lib/users";

export default async function Home() {
  const { users } = await getUsers();

  return (
    <section>
      <h1>Users</h1>
      <Header />
      <div className="container mx-auto"></div>
      <ul className="mt-12">
        {users?.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </ul>
    </section>
  );
}
