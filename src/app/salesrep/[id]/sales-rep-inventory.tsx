"use client";

import { INVENTORY_LEVEL, TABLE_ROW_SIZE } from "@/app/_lib/globals";
import { RelativeTime } from "@primer/react";
import { MobileInventory, Product, SalesRep, User } from "@prisma/client";
import { Button, Input, Table, TableProps, Tag } from "antd";
import { useEffect, useState } from "react";
import CreateMobileInventory from "./mobile-inventory/create-update";
import { SearchProps } from "antd/es/input";
const { Search } = Input;

function getColor(available: number): string {
  if (available > INVENTORY_LEVEL.LOW) {
    return "green";
  } else if (available > INVENTORY_LEVEL.DANGER) {
    return "gold";
  }
  return "error";
}

type ISalesRepInventory = {
  salesRep: SalesRep;
  currentUser: User;
  products: Product[];
};

const COLUMNS: TableProps["columns"] = [
  {
    title: "Name",
    dataIndex: "productId",
    key: "productId",
    render: (updatedAt, record) => <span>{record.product.name}</span>,
  },
  {
    title: "Barcode",
    dataIndex: "sellingPrice",
    key: "sellingPrice",
    render: (updatedAt, record) => <span>{record.product.barcode}</span>,
  },
  {
    title: "Max Retail Price",
    dataIndex: "mrp",
    key: "mrp",
    render: (mrp) => <span>{mrp}</span>,
  },
  {
    title: "Available",
    dataIndex: "available",
    key: "available",
    render: (available) => <Tag color={getColor(available)}>{available}</Tag>,
  },
  {
    title: "Last Updated By",
    dataIndex: "available",
    key: "lastUpdatedBy",
    render: (available, record) => <span>{record.updatedBy.name}</span>,
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (createdAt) => <RelativeTime date={new Date(createdAt)} />,
  },
  {
    title: "Updated At",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (updatedAt) => <RelativeTime date={new Date(updatedAt)} />,
  },
];

export default function SalesRepInventory({
  currentUser,
  salesRep,
  products,
}: ISalesRepInventory) {
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [inventories, setInventories] = useState<MobileInventory[]>([]);

  const [change, setChange] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const formData = new FormData();

      formData.append("query", query);
      formData.append("take", TABLE_ROW_SIZE.toString());
      formData.append("skip", page.toString());

      const response = await fetch(`/api/salesrep/${salesRep.id}/inventory`, {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        const data = await response.json();

        if (data && Object.hasOwn(data, "mobileInventories")) {
          setInventories(data.mobileInventories);
          setTotal(data.total);
        }
      }
      setLoading(false);
    })();
  }, [query, page, salesRep.id, change]);

  const onSearch: SearchProps["onSearch"] = (value) => setQuery(value);

  return (
    <div>
      <div className="flex items-center justify-end mb-5 gap-3">
        <Search
          placeholder="input search text"
          onSearch={onSearch}
          enterButton
          classNames={{
            affixWrapper: "bg-blue-600",
            suffix: "bg-blue-600",
          }}
          loading={loading}
        />
        <Button type="text">Download</Button>
        <Button
          type="primary"
          className="bg-blue-600"
          onClick={() => setOpen(true)}
        >
          Create Inventory
        </Button>
      </div>
      <Table dataSource={inventories} columns={COLUMNS} />
      <CreateMobileInventory
        currentUser={currentUser}
        salesRep={salesRep}
        products={products}
        isOpen={open}
        createHandler={() => {
          setChange(!change);
          setOpen(false);
        }}
        closeHandler={() => setOpen(false)}
      />
    </div>
  );
}
