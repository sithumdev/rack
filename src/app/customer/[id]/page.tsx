import { getCustomerById } from "@/app/_lib/salesrep-customer";
import { createServerSupabaseClient } from "@/app/_lib/supabase-server";
import { Empty } from "antd";

export default async function Customer({ params }: { params: { id: string } }) {
  const { customer } = await getCustomerById(Number(params.id));

  const {
    data: { session },
  } = await createServerSupabaseClient().auth.getSession();

  if (customer && session?.user.email) {
    return <Empty />;
  }

  return <Empty />;
}
