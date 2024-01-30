"use client";

import { Button, RelativeTime } from "@primer/react";
import { DataTable, Table } from "@primer/react/drafts";
import { Category, User } from "@prisma/client";
import { useCallback, useState } from "react";
import CreateUpdateCategory from "./create-update";

type ICategoriesTable = {
  rows: Category[];
  currentUser: User;
};

export default function CategoriesTable({
  rows,
  currentUser,
}: ICategoriesTable) {
  const [isOpen, setIsOpen] = useState(false);

  const onDialogClose = useCallback(() => setIsOpen(false), []);
  const onDialogOpen = useCallback(() => setIsOpen(true), []);

  return (
    <>
      <Table.Container>
        <Table.Title as="h2" id="repositories">
          Categories
        </Table.Title>
        <Table.Actions>
          <Button onClick={onDialogOpen}>Create Category</Button>
        </Table.Actions>
        <Table.Divider />
        <Table.Subtitle as="p" id="repositories-subtitle">
          Categories managed by the admin
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
      <CreateUpdateCategory
        open={isOpen}
        onClose={onDialogClose}
        currentUser={currentUser}
      />
    </>
  );
}
