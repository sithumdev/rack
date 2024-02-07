"use client";

import { TABLE_ROW_SIZE } from "@/app/_lib/globals";
import { SalesRepPurchasesWithCreatedByAndInventory } from "@/app/_lib/salesrep-purchase";
import { RelativeTime } from "@primer/react";
import { SalesRep } from "@prisma/client";
import { Button, Table, TableProps } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ISalesRepPurchases = {
  salesRep: SalesRep;
};

const COLUMNS: TableProps["columns"] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    render: (id) => <span>{id}</span>,
  },
  {
    title: "Items",
    dataIndex: "items",
    key: "items",
    render: (_items, record) => <span>{record.items.length}</span>,
  },
  {
    title: "Created By",
    dataIndex: "createdBy",
    key: "createdBy",
    render: (_createdBy, record) => <span>{record.createdBy.name}</span>,
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (createdAt) => <RelativeTime date={new Date(createdAt)} />,
  },
];

export default function SalesRepPurchases({ salesRep }: ISalesRepPurchases) {
  const navigate = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [purchases, setPurchases] = useState<
    SalesRepPurchasesWithCreatedByAndInventory[]
  >([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const formData = new FormData();

      formData.append("take", TABLE_ROW_SIZE.toString());
      formData.append("skip", page.toString());

      const response = await fetch(`/api/salesrep/${salesRep.id}/purchase`, {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        const data = await response.json();

        if (data && Object.hasOwn(data, "salesRepPurchases")) {
          setPurchases(data.salesRepPurchases);
          setTotal(data.total);
        }
      }
      setLoading(false);
    })();
  }, [page, salesRep.id]);

  return (
    <>
      <div className="flex items-center justify-end mb-5 gap-3">
        <Button
          type="primary"
          className="bg-blue-600"
          onClick={() => navigate.push(`${salesRep.id}/purchase/new`)}
        >
          Create Purchase
        </Button>
      </div>
      <Table dataSource={purchases} columns={COLUMNS} />
    </>
  );
}
