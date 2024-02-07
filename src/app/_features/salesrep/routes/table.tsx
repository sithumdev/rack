import { TABLE_ROW_SIZE } from "@/app/_lib/globals";
import { SalesRepRoutes } from "@/app/_lib/salesrep-routes";
import { CloudDownloadOutlined } from "@ant-design/icons";
import { SalesRep, USER_TYPE, User } from "@prisma/client";
import { Button, Descriptions, Input, Table, TableProps, Tag } from "antd";
import { SearchProps } from "antd/es/input";
import { useEffect, useState } from "react";
import CreateSalesRepRoute from "./create-update";
import { RelativeTime } from "@primer/react";

const { Search } = Input;

type ISalesRepRoutes = {
  salesRep: SalesRep;
  currentUser: User;
};

const COLUMNS: TableProps["columns"] = [
  {
    title: "Name",
    dataIndex: "routeId",
    key: "routeId",
    render: (_productId, record) => <span>{record.route.name}</span>,
  },
  {
    title: "Last Updated By",
    dataIndex: "createdAt",
    key: "lastUpdatedBy",
    render: (_available, record) => <span>{record.route.updatedBy.name}</span>,
  },
  {
    title: "Updated At",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (_updatedAt, record) => (
      <RelativeTime date={new Date(record.route.updatedAt)} />
    ),
  },
];

export default function SalesRepRoutes({
  currentUser,
  salesRep,
}: ISalesRepRoutes) {
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [routes, setRoutes] = useState<SalesRepRoutes[]>([]);

  const [change, setChange] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const formData = new FormData();

      formData.append("query", query);
      formData.append("take", TABLE_ROW_SIZE.toString());
      formData.append("skip", page.toString());

      const response = await fetch(`/api/salesrep/${salesRep.id}/routes`, {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        const data = await response.json();

        if (data && Object.hasOwn(data, "routes")) {
          setRoutes(data.routes);
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
          placeholder="Search routes..."
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
        {currentUser.type === USER_TYPE.OWNER && (
          <Button
            type="primary"
            className="bg-blue-600"
            onClick={() => setOpen(true)}
          >
            Create Route
          </Button>
        )}
      </div>
      <Table
        rowKey="routeId"
        loading={loading}
        dataSource={routes}
        columns={COLUMNS}
        pagination={{
          total,
          pageSize: TABLE_ROW_SIZE,
          onChange: (page) => {
            setPage((page - 1) * TABLE_ROW_SIZE);
          },
        }}
        expandable={{
          expandedRowRender: (record: SalesRepRoutes) => (
            <div className="flex gap-2 flex-wrap">
              {record.route.cities.map((city) => (
                <Tag key={city}>{city}</Tag>
              ))}
            </div>
          ),
        }}
      />
      <CreateSalesRepRoute
        currentUser={currentUser}
        salesRep={salesRep}
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
