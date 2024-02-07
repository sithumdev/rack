import { Breadcrumb, Empty } from "antd";
import { getSalesRepresentatives } from "../_lib/salesrep";
import SalesRepresentativeTable from "./table";

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
  const { salesRepresentatives } = await getSalesRepresentatives();

  if (salesRepresentatives) {
    return (
      <Wrapper>
        <SalesRepresentativeTable
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
