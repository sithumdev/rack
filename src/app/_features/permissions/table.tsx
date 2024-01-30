"use client";

import { Button, Label, RelativeTime } from "@primer/react";
import { DataTable, Table } from "@primer/react/drafts";
import { Permission } from "@prisma/client";
import { useCallback, useState } from "react";
import CreateUpdatePermission from "./create-update";

type IPermissionsTable = {
  rows: Permission[];
};

export default function CategoriesTable({ rows }: IPermissionsTable) {
  const [isOpen, setIsOpen] = useState(false);

  const onDialogClose = useCallback(() => setIsOpen(false), []);
  const onDialogOpen = useCallback(() => setIsOpen(true), []);

  return (
    <>
      <Table.Container>
        <Table.Title as="h2" id="repositories">
          Permissions
        </Table.Title>
        <Table.Actions>
          <Button onClick={onDialogOpen}>Create Permission</Button>
        </Table.Actions>
        <Table.Divider />
        <Table.Subtitle as="p" id="repositories-subtitle">
          Permissions managed by the admin
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
              header: "Level",
              field: "level",
              renderCell: (row) => {
                return <Label>{row.level}</Label>;
              },
            },
            {
              header: "Description",
              field: "description",
              rowHeader: true,
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
      <CreateUpdatePermission open={isOpen} onClose={onDialogClose} />
    </>
  );
}
