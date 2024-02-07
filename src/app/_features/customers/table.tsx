"use client";

import { TABLE_ROW_SIZE } from "@/app/_lib/globals";
import { SalesRepCustomersWithSalesReps } from "@/app/_lib/salesrep-customer";
import { RelativeTime } from "@primer/react";
import { Button, Descriptions, Input, Table, TableProps, Tag } from "antd";
import { SearchProps } from "antd/es/input";
import Link from "next/link";
import numeral from "numeral";
import { useEffect, useState } from "react";
import { CloudDownloadOutlined } from "@ant-design/icons";

const { Search } = Input;

const COLUMNS: TableProps["columns"] = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (name, record) => (
      <Link href={`/customer/${record.id}`} className="text-blue-600">
        {name}
      </Link>
    ),
  },
  {
    title: "City",
    dataIndex: "city",
    key: "city",
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },

  {
    title: "Total Credits",
    dataIndex: "totalCredit",
    key: "totalCredit",
    render: (totalCredit) => <Tag>{numeral(totalCredit).format("0,0")}</Tag>,
  },
  {
    title: "Last Updated By",
    dataIndex: "updatedById",
    key: "updatedById",
    render: (_updatedById, record) => <span>{record.updatedBy.name}</span>,
  },
  {
    title: "Updated At",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (updatedAt) => <RelativeTime date={new Date(updatedAt)} />,
  },
];

export default function Customers() {
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [customers, setCustomers] = useState<SalesRepCustomersWithSalesReps[]>(
    []
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      const formData = new FormData();

      formData.append("query", query);
      formData.append("take", TABLE_ROW_SIZE.toString());
      formData.append("skip", page.toString());

      const response = await fetch(`/api/customer`, {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        const data = await response.json();

        if (data && Object.hasOwn(data, "customers")) {
          setCustomers(data.customers);
          setTotal(data.total);
        }
      }
      setLoading(false);
    })();
  }, [query, page]);

  const onSearch: SearchProps["onSearch"] = (value) => setQuery(value);

  return (
    <div className="mt-5">
      <div className="flex items-center justify-end mb-5 gap-3">
        <Search
          placeholder="Search customers..."
          onSearch={onSearch}
          enterButton
          classNames={{
            affixWrapper: "bg-blue-600",
            suffix: "bg-blue-600",
          }}
          loading={loading}
        />
        <Button type="text" icon={<CloudDownloadOutlined />}>
          Download
        </Button>
      </div>
      <Table
        rowKey="id"
        loading={loading}
        className="mt-5"
        dataSource={customers}
        columns={COLUMNS}
        pagination={{
          total,
          pageSize: TABLE_ROW_SIZE,
          onChange: (page) => {
            setPage((page - 1) * TABLE_ROW_SIZE);
          },
        }}
        expandable={{
          expandedRowRender: (record: SalesRepCustomersWithSalesReps) => (
            <Descriptions title="Sales Representatives">
              {record.salesReps.map((salesRep) => (
                <Descriptions.Item key={salesRep.salesRepId} label="Name">
                  {salesRep.salesRep.name}
                </Descriptions.Item>
              ))}
            </Descriptions>
          ),
        }}
      />
    </div>
  );
}
