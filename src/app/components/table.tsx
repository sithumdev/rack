"use client";

import { Label, RelativeTime } from "@primer/react";
import { DataTable, Table } from "@primer/react/drafts";
import { User } from "@prisma/client";

type IUsersTable = {
  rows: User[];
};

export default function UsersTable({ rows }: IUsersTable) {
  return (
    <Table.Container>
      <Table.Title as="h2" id="repositories">
        Users
      </Table.Title>
      <Table.Subtitle as="p" id="repositories-subtitle">
        Users managed by the admin
      </Table.Subtitle>
      <DataTable
        aria-labelledby="repositories"
        aria-describedby="repositories-subtitle"
        data={rows}
        columns={[
          {
            header: "Name",
            field: "name",
            rowHeader: true,
          },
          {
            header: "Email Address",
            field: "email",
            renderCell: (row) => {
              return <Label>{row.email}</Label>;
            },
          },
          {
            header: "Updated",
            field: "updatedAt",
            renderCell: (row) => {
              return <RelativeTime date={new Date(row.updatedAt)} />;
            },
          },
        ]}
      />
    </Table.Container>
  );
}
