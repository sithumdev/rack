import { User } from "@prisma/client";

type IUser = {
  user: User;
};

export default function UserCard({ user }: IUser) {
  return (
    <div className="px-4 py-3 rounded-xl my-2 shadow-lg bg-blue-950">
      <h4 className="text-2xl">{user.name}</h4>
      <p className="mt-2 text-sm">{user.email}</p>
    </div>
  );
}
