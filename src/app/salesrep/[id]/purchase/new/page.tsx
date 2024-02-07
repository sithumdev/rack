import CreateUpdateSalesRepPurchase from "@/app/_features/salesrep/purchase/create-update";
import {
  MobileInventoriesWithProducts,
  getAllMobileInventoriesBySalesRep,
} from "@/app/_lib/mobile-inventory";
import { getSalesRepresentativeById } from "@/app/_lib/salesrep";
import { createServerSupabaseClient } from "@/app/_lib/supabase-server";
import { getUserByEmail } from "@/app/_lib/users";
import { SalesRep, User } from "@prisma/client";
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
            title: (
              <Link href={`/salesrep/${salesRepresentative?.id}`}>
                {salesRepresentative?.name}
              </Link>
            ),
          },
          {
            title: "Purchase",
          },
          {
            title: "New",
          },
        ]}
      />
      {children}
    </>
  );
}

export default async function SalesRepPurchase({
  params,
}: {
  params: { id: string };
}) {
  const { salesRepresentative } = await getSalesRepresentativeById(
    Number(params.id)
  );

  let inventories: MobileInventoriesWithProducts[] = [];

  if (salesRepresentative) {
    const { mobileInventories } = await getAllMobileInventoriesBySalesRep(
      salesRepresentative.id
    );

    if (mobileInventories) {
      inventories = mobileInventories;
    }
  }

  const { data } = await createServerSupabaseClient().auth.getSession();

  let user: User | undefined = undefined;

  if (data.session?.user.email) {
    const { user: dbUser } = await getUserByEmail(data.session.user.email);

    if (dbUser) {
      user = dbUser;
    }
  }

  if (user && salesRepresentative) {
    return (
      <Wrapper salesRepresentative={salesRepresentative}>
        <CreateUpdateSalesRepPurchase
          salesRep={salesRepresentative}
          currentUser={user}
          inventories={inventories}
        />
      </Wrapper>
    );
  }

  return <Empty />;
}
