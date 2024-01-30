"use client";

import { InventoryType } from "@/app/_lib/types";
import { Button, RelativeTime } from "@primer/react";
import { DataTable, Table } from "@primer/react/drafts";
import { Brand, Product, User } from "@prisma/client";
import { useCallback, useState } from "react";
import CreateUpdateInventory from "./create-update";

type IInventoryTable = {
  rows: InventoryType[];
  currentUser: User;
  products: Product[];
  brands: Brand[];
};

export default function InventoryTable({
  rows,
  currentUser,
  products,
  brands,
}: IInventoryTable) {
  const [isOpen, setIsOpen] = useState(false);

  const onDialogClose = useCallback(() => setIsOpen(false), []);
  const onDialogOpen = useCallback(() => setIsOpen(true), []);

  return (
    <>
      <Table.Container>
        <Table.Title as="h2" id="repositories">
          Inventory
        </Table.Title>
        <Table.Actions>
          <Button onClick={onDialogOpen}>Create Inventory</Button>
        </Table.Actions>
        <Table.Divider />
        <Table.Subtitle as="p" id="repositories-subtitle">
          Inventory managed by the admin
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
              header: "SKU",
              field: "sku",
              rowHeader: true,
            },
            {
              header: "Sold",
              field: "sold",
              rowHeader: true,
            },
            {
              header: "Defective",
              field: "defective",
              rowHeader: true,
            },
            {
              header: "Available",
              field: "available",
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
      <CreateUpdateInventory
        open={isOpen}
        onClose={onDialogClose}
        currentUser={currentUser}
        products={products}
        brands={brands}
      />
    </>
  );
}
