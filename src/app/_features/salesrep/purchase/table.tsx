"use client";

import { TABLE_ROW_SIZE } from "@/app/_lib/globals";
import {
  SalesRepPurchasesWithCreatedByAndInventory,
  SalesRepPurchasesWithCreatedByAndInventoryIncluded,
} from "@/app/_lib/salesrep-purchase";
import { RelativeTime } from "@primer/react";
import { SalesRep } from "@prisma/client";
import { Button, Modal, Table, TableProps } from "antd";
import moment from "moment";
import { useRouter } from "next/navigation";
import numeral from "numeral";
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
    title: "Date",
    dataIndex: "createdAt",
    key: "date",
    render: (date) => <span>{moment(date).format("YYYY-MM-DD")}</span>,
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
  const [loadingInvoice, setLoadingInvoice] = useState<boolean>(false);
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

  const viewInvoice = async (id: number) => {
    setLoadingInvoice(true);

    const response = await fetch(`/api/salesrep/${salesRep.id}/purchase/${id}`);

    if (response.status === 200) {
      const data = await response.json();

      if (data && Object.hasOwn(data, "salesRepPurchase")) {
        const invoice: SalesRepPurchasesWithCreatedByAndInventoryIncluded =
          data.salesRepPurchase;

        Modal.info({
          title: "Purchase Invoice",
          width: "600px",
          content: (
            <Table
              dataSource={invoice.items}
              pagination={false}
              columns={[
                {
                  key: id,
                  title: "ID",
                  dataIndex: "id",
                },
                {
                  key: "updateAt",
                  title: "Name",
                  dataIndex: "updatedAt",
                  render: (_updatedAt, record) => (
                    <span>{record.inventory.product.name}</span>
                  ),
                },
                {
                  key: "salesRepId",
                  title: "Max Retail Price",
                  dataIndex: "salesRepId",
                  render: (_salesRepId, record) => (
                    <span>{numeral(record.inventory.mrp).format("0,0")}</span>
                  ),
                },
                {
                  key: "quantity",
                  title: "Quantity",
                  dataIndex: "quantity",
                  render: (quantity) => (
                    <span>{numeral(quantity).format("0,0")}</span>
                  ),
                },
              ]}
            />
          ),
        });
      }
    }
    setLoadingInvoice(false);
  };

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
      <Table
        rowKey="id"
        loading={loading}
        dataSource={purchases}
        columns={[
          ...(COLUMNS || []),
          {
            title: "Action",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (_updatedAt, record) => (
              <Button
                loading={loadingInvoice}
                type="text"
                className="text-blue-500"
                onClick={() => viewInvoice(record.id)}
              >
                View
              </Button>
            ),
          },
        ]}
        pagination={{
          total,
          pageSize: TABLE_ROW_SIZE,
          onChange: (page) => {
            setPage((page - 1) * TABLE_ROW_SIZE);
          },
        }}
      />
    </>
  );
}
