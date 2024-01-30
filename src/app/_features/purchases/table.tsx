"use client";

import { InventoryType, PurchaseType } from "@/app/_lib/types";
import { Button, Label, RelativeTime } from "@primer/react";
import { DataTable, Table } from "@primer/react/drafts";
import { User } from "@prisma/client";
import { useCallback, useState } from "react";
import CreateUpdatePurchase from "./create-update";

type IPurchasesTable = {
  rows: PurchaseType[];
  currentUser: User;
  inventories: InventoryType[];
};

export default function PurchasesTable({
  rows,
  currentUser,
  inventories,
}: IPurchasesTable) {
  const [isOpen, setIsOpen] = useState(false);

  const onDialogClose = useCallback(() => setIsOpen(false), []);
  const onDialogOpen = useCallback(() => setIsOpen(true), []);

  return (
    <>
      <Table.Container>
        <Table.Title as="h2" id="repositories">
          Purchase Invoices
        </Table.Title>
        <Table.Actions>
          <Button onClick={onDialogOpen}>Create Purchase</Button>
        </Table.Actions>
        <Table.Divider />
        <Table.Subtitle as="p" id="repositories-subtitle">
          Purchase invoices managed by the admin
        </Table.Subtitle>
        <DataTable
          aria-labelledby="repositories"
          aria-describedby="repositories-subtitle"
          data={rows}
          columns={[
            {
              header: "Inventory",
              field: "name",
              renderCell: (row) => {
                return (
                  <Label>
                    {row.name} - {row.mrp}
                  </Label>
                );
              },
            },
            {
              header: "Quantity",
              field: "quantity",
              rowHeader: true,
            },
            {
              header: "Created By",
              field: "createdBy",
              rowHeader: true,
            },
            {
              header: "Updated By",
              field: "updatedBy",
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
      <CreateUpdatePurchase
        open={isOpen}
        onClose={onDialogClose}
        currentUser={currentUser}
        inventories={inventories}
      />
    </>
  );
}
