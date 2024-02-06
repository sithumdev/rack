import { SalesRep } from "@prisma/client";

type ISalesRepPurchases = {
  salesRep: SalesRep;
};

export default function SalesRepPurchases({ salesRep }: ISalesRepPurchases) {
  return <p>Purchases</p>;
}
