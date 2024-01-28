import UserForm from "./components/form";
import UserCard from "./components/user-card";
import { getUsers } from "./lib/users";

// type ICreateUser = Pick<
//   User,
//   | "name"
//   | "email"
//   | "avatar"
//   | "isActive"
//   | "emailVerified"
//   | "notificationEnabled"
//   | "notificationToken"
// >;

// const createUserSchema = Yup.object().shape({
//   name: Yup.string(),
//   email: Yup.string().email(),
//   avatar: Yup.string(),
//   isActive: Yup.boolean().default(true),
//   emailVerified: Yup.boolean().default(true),
//   notificationEnabled: Yup.boolean().default(true),
//   notificationToken: Yup.string(),
// });

export default async function Home() {
  const { users } = await getUsers();

  return (
    <section className="container mx-auto">
      <h1>Users</h1>
      <div className="container mx-auto">
        <UserForm />
      </div>
      <ul className="mt-12">
        {users?.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </ul>
    </section>
  );
}
