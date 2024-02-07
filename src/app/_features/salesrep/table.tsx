"use client";

import { RelativeTime } from "@primer/react";
import { SalesRep, USER_TYPE, User } from "@prisma/client";
import { Button, Table, TableProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CreateUpdateSalesRep from "./create-update";

interface ISalesRep extends SalesRep {
  key: string;
}

type ISalesRepresentativeTable = {
  currentUser: User;
  salesRepresentatives: ISalesRep[];
};

const COLUMNS: TableProps["columns"] = [
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (createdAt) => <RelativeTime date={new Date(createdAt)} />,
  },
];

export default function SalesRepresentativeTable({
  salesRepresentatives,
  currentUser,
}: ISalesRepresentativeTable) {
  const pathName = usePathname();

  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      {currentUser.type === USER_TYPE.OWNER && (
        <div className="flex items-center justify-end">
          <Button
            type="primary"
            className="bg-blue-600"
            onClick={() => setOpen(true)}
          >
            Create SalesRep
          </Button>
        </div>
      )}
      <Table
        className="mt-5"
        dataSource={salesRepresentatives}
        columns={[
          ...(COLUMNS || []),
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (name: string, record: ISalesRep) => (
              <Link
                className="text-blue-600"
                href={`${pathName}/${record.id}?tab=1`}
              >
                {name}
              </Link>
            ),
          },
        ].reverse()}
      />
      <CreateUpdateSalesRep
        isOpen={open}
        createHandler={() => setOpen(false)}
        closeHandler={() => setOpen(false)}
      />
    </div>
  );
}
