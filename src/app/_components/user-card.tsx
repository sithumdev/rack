import { User } from "@supabase/supabase-js";
import { Avatar, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";

type IUser = {
  user: User;
};

export default function UserCard({ user }: IUser) {
  return <Tag color="geekblue">{user.email}</Tag>;
}
