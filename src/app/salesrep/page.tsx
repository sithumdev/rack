import { Breadcrumb, Empty } from "antd";
import { getSalesRepresentatives } from "../_lib/salesrep";
import SalesRepresentativeTable from "./table";
import { createServerSupabaseClient } from "../_lib/supabase-server";
import { getUserByEmail } from "../_lib/users";
import { User } from "@prisma/client";

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: "Sales Representatives",
          },
        ]}
      />
      {children}
    </>
  );
}

export default async function SalesRepresentatives() {
  const {
    data: { session },
  } = await createServerSupabaseClient().auth.getSession();

  const { salesRepresentatives } = await getSalesRepresentatives();

  let user: User | null | undefined = null;

  if (session?.user.email) {
    user = (await getUserByEmail(session.user.email)).user;
  }

  if (salesRepresentatives && user) {
    return (
      <Wrapper>
        <SalesRepresentativeTable
          currentUser={user}
          salesRepresentatives={salesRepresentatives.map((salesRep) => ({
            ...salesRep,
            key: String(salesRep.id),
          }))}
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
