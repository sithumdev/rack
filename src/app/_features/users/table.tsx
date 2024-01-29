"use client";

import { Button, IssueLabelToken, Label, RelativeTime } from "@primer/react";
import { DataTable, Table } from "@primer/react/drafts";
import { User } from "@prisma/client";
import { useCallback, useState } from "react";
import { CreateUpdateUser } from ".";

type IUsersTable = {
  rows: User[];
};

export default function UsersTable({ rows }: IUsersTable) {
  const [isOpen, setIsOpen] = useState(false);

  const onDialogClose = useCallback(() => setIsOpen(false), []);
  const onDialogOpen = useCallback(() => setIsOpen(true), []);

  return (
    <>
      <Table.Container>
        <Table.Title as="h2" id="repositories">
          Users
        </Table.Title>
        <Table.Actions>
          <Button onClick={onDialogOpen}>Create User</Button>
        </Table.Actions>
        <Table.Divider />
        <Table.Subtitle as="p" id="repositories-subtitle">
          Users managed by the admin
        </Table.Subtitle>
        <DataTable
          aria-labelledby="repositories"
          aria-describedby="repositories-subtitle"
          data={rows}
          columns={[
            {
              header: "ID",
              field: "id",
              rowHeader: true,
            },
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
              header: "Status",
              field: "isActive",
              renderCell: (row) => {
                return (
                  <IssueLabelToken
                    size="small"
                    fillColor={row.isActive ? "green" : "red"}
                    text={row.isActive ? "Active" : "Inactive"}
                  />
                );
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
      <CreateUpdateUser open={isOpen} onClose={onDialogClose} />
    </>
  );
}
