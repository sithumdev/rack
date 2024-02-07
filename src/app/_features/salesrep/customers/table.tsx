import { TABLE_ROW_SIZE } from "@/app/_lib/globals";
import { SalesRepCustomers } from "@/app/_lib/salesrep-customer";
import { RelativeTime } from "@primer/react";
import { SalesRep, User } from "@prisma/client";
import { Button, Input, Table, TableProps, Tag } from "antd";
import { SearchProps } from "antd/es/input";
import Link from "next/link";
import numeral from "numeral";
import { useEffect, useState } from "react";
import CreateSalesRepCustomer from "./create-update";
import { CloudDownloadOutlined } from "@ant-design/icons";

const { Search } = Input;

type ISalesRepCustomers = {
  salesRep: SalesRep;
  currentUser: User;
};

const COLUMNS: TableProps["columns"] = [
  {
    title: "Name",
    dataIndex: "salesRepId",
    key: "name",
    render: (_name, record) => (
      <Link href={`/customer/${record.customer.id}`} className="text-blue-600">
        {record.customer.name}
      </Link>
    ),
  },
  {
    title: "City",
    dataIndex: "salesRepId",
    key: "city",
    render: (_customer, record) => <span>{record.customer.city}</span>,
  },
  {
    title: "Phone",
    dataIndex: "salesRepId",
    key: "phone",
    render: (_customer, record) => <span>{record.customer.phone}</span>,
  },
  {
    title: "Address",
    dataIndex: "salesRepId",
    key: "address",
    render: (_customer, record) => <span>{record.customer.address}</span>,
  },
  {
    title: "Total Credits",
    dataIndex: "customer",
    key: "totalCredit",
    render: (_customer, record) => (
      <Tag>{numeral(record.customer.totalCredit).format("0,0")}</Tag>
    ),
  },
  {
    title: "Last Updated By",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (_createdAt, record) => (
      <span>{record.customer.updatedBy.name}</span>
    ),
  },
  {
    title: "Updated At",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (_updatedAt, record) => (
      <RelativeTime date={new Date(record.customer.updatedAt)} />
    ),
  },
];

export default function SalesRepCustomers({
  currentUser,
  salesRep,
}: ISalesRepCustomers) {
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [customers, setCustomers] = useState<SalesRepCustomers[]>([]);

  const [change, setChange] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const formData = new FormData();

      formData.append("query", query);
      formData.append("take", TABLE_ROW_SIZE.toString());
      formData.append("skip", page.toString());

      const response = await fetch(`/api/salesrep/${salesRep.id}/customers`, {
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
  }, [query, page, salesRep.id, change]);

  const onSearch: SearchProps["onSearch"] = (value) => setQuery(value);

  return (
    <>
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
        <Button type="text" icon={<CloudDownloadOutlined />}>
          Download
        </Button>
        <Button
          type="primary"
          className="bg-blue-600"
          onClick={() => setOpen(true)}
        >
          Create Customer
        </Button>
      </div>
      <Table
        loading={loading}
        dataSource={customers}
        columns={COLUMNS}
        pagination={{
          total,
          pageSize: TABLE_ROW_SIZE,
          onChange: (page) => {
            setPage((page - 1) * TABLE_ROW_SIZE);
          },
        }}
      />
      <CreateSalesRepCustomer
        salesRep={salesRep}
        currentUser={currentUser}
        isOpen={open}
        createHandler={() => {
          setChange(!change);
          setOpen(false);
        }}
        closeHandler={() => setOpen(false)}
      />
    </>
  );
}
