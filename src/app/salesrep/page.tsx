import { Spinner } from "@primer/react";
import { getSalesRepresentatives } from "../_lib/salesrep";
import SalesRepresentativeTable from "./table";

export default async function SalesRepresentatives() {
  const { salesRepresentatives } = await getSalesRepresentatives();

  if (salesRepresentatives) {
    return (
      <SalesRepresentativeTable
        salesRepresentatives={salesRepresentatives.map((salesRep) => ({
          ...salesRep,
          key: String(salesRep.id),
        }))}
      />
    );
  }

  return <Spinner />;
}
