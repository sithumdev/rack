import { getAllProducts } from "@/app/_lib/products";
import { getSalesRepresentativeById } from "@/app/_lib/salesrep";
import { createServerSupabaseClient } from "@/app/_lib/supabase-server";
import { getUserByEmail } from "@/app/_lib/users";
import { Product, SalesRep } from "@prisma/client";
import { Empty } from "antd";
import Details from "./details";

async function SalesRepresentativeDetailsIntermediate({
  email,
  products,
  salesRepresentative,
}: {
  email: string;
  products: Product[];
  salesRepresentative: SalesRep;
}) {
  const { user } = await getUserByEmail(email);

  if (user) {
    return (
      <Details
        currentUser={user}
        salesRepresentative={salesRepresentative}
        products={products}
      />
    );
  }

  return <Empty />;
}

export default async function SalesRep({ params }: { params: { id: string } }) {
  const { salesRepresentative } = await getSalesRepresentativeById(
    Number(params.id)
  );

  const {
    data: { session },
  } = await createServerSupabaseClient().auth.getSession();

  const { products } = await getAllProducts();

  if (salesRepresentative && products && session?.user.email) {
    return (
      <SalesRepresentativeDetailsIntermediate
        email={session?.user.email}
        salesRepresentative={salesRepresentative}
        products={products}
      />
    );
  }

  return <Empty />;
}
