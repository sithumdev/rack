"use client";

import { Button, Label, RelativeTime } from "@primer/react";
import { DataTable, Table } from "@primer/react/drafts";
import { Category, Product, User } from "@prisma/client";
import { useCallback, useState } from "react";
import CreateUpdateProduct from "./create-update";

type IProductsTable = {
  rows: Product[];
  categories: Category[];
  currentUser: User;
};

export default function ProductsTable({
  rows,
  currentUser,
  categories,
}: IProductsTable) {
  const [isOpen, setIsOpen] = useState(false);

  const onDialogClose = useCallback(() => setIsOpen(false), []);
  const onDialogOpen = useCallback(() => setIsOpen(true), []);

  return (
    <>
      <Table.Container>
        <Table.Title as="h2" id="repositories">
          Products
        </Table.Title>
        <Table.Actions>
          <Button onClick={onDialogOpen}>Create Product</Button>
        </Table.Actions>
        <Table.Divider />
        <Table.Subtitle as="p" id="repositories-subtitle">
          Products managed by the admin
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
              header: "Barcode",
              field: "barcode",
              renderCell: (row) => {
                return <Label>{row.barcode}</Label>;
              },
            },
            {
              header: "Weight",
              field: "weight",
              rowHeader: true,
            },
            {
              header: "Price",
              field: "price",
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
      <CreateUpdateProduct
        open={isOpen}
        onClose={onDialogClose}
        currentUser={currentUser}
        categories={categories}
      />
    </>
  );
}
