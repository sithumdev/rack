import Details from "@/app/_features/salesrep/details";
import { getAllProducts } from "@/app/_lib/products";
import { getSalesRepresentativeById } from "@/app/_lib/salesrep";
import { createServerSupabaseClient } from "@/app/_lib/supabase-server";
import { getUserByEmail } from "@/app/_lib/users";
import { Product, SalesRep } from "@prisma/client";
import { Breadcrumb, Empty } from "antd";
import Link from "next/link";

function Wrapper({
  children,
  salesRepresentative,
}: {
  children: React.ReactNode;
  salesRepresentative?: SalesRep;
}) {
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link href="/salesrep">Sales Representatives</Link>,
          },
          {
            title: `${salesRepresentative?.name}`,
          },
        ]}
      />
      {children}
    </>
  );
}

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
      <Wrapper salesRepresentative={salesRepresentative}>
        <Details
          currentUser={user}
          salesRepresentative={salesRepresentative}
          products={products}
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Empty />
    </Wrapper>
  );
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
