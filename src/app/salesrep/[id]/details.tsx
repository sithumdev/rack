"use client";

import { Product, SalesRep, User } from "@prisma/client";
import { Tabs } from "antd";
import SalesRepInventory from "./sales-rep-inventory";
import SalesRepPurchases from "./purchase/table";

type IDetails = {
  currentUser: User;
  salesRepresentative: SalesRep;
  products: Product[];
};

export default function Details({
  salesRepresentative,
  products,
  currentUser,
}: IDetails) {
  return (
    <>
      <h4 className="text-3xl mb-5">{salesRepresentative.name}</h4>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Inventory",
            children: (
              <SalesRepInventory
                currentUser={currentUser}
                products={products}
                salesRep={salesRepresentative}
              />
            ),
          },
          {
            key: "2",
            label: "Purchases",
            children: <SalesRepPurchases salesRep={salesRepresentative} />,
          },
          {
            key: "3",
            label: "Releases",
            children: "Content of Tab Pane 2",
          },
          {
            key: "4",
            label: "Credit Bills",
            children: "Content of Tab Pane 2",
          },
          {
            key: "5",
            label: "Customers",
            children: "Content of Tab Pane 3",
          },
          {
            key: "6",
            label: "Routes",
            children: "Content of Tab Pane 3",
          },
        ]}
        onChange={() => {}}
      />
    </>
  );
}