"use client";

import { PurchaseType } from "@/app/_lib/types";
import { ActionList, Button, Dialog, Label, RelativeTime } from "@primer/react";
import { DataTable, Table } from "@primer/react/drafts";
import Link from "next/link";
import { useRef, useState } from "react";

type IPurchasesTable = {
  rows: PurchaseType[];
};

export default function PurchasesTable({ rows }: IPurchasesTable) {
  const returnFocusRef = useRef(null);

  const [open, setOpen] = useState<boolean>(false);
  const [purchase, setPurchase] = useState<PurchaseType | undefined>(undefined);

  return (
    <>
      <Table.Container>
        <Table.Title as="h2" id="repositories">
          Purchase Invoices
        </Table.Title>
        <Table.Actions>
          <Button>
            <Link href="purchases/new">Create Purchase</Link>
          </Button>
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
              header: "ID",
              field: "id",
              rowHeader: true,
            },
            {
              header: "Items",
              field: "items",
              renderCell: (row) => {
                return <Label>{row.items.length}</Label>;
              },
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
            {
              header: "ID",
              field: "id",
              renderCell: (row) => {
                return (
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => {
                      setPurchase(row);
                      setOpen(true);
                    }}
                  >
                    View
                  </Button>
                );
              },
            },
          ]}
        />
        <Table.Pagination
          pageSize={15}
          totalCount={rows.length}
          aria-label="pagination"
        />
      </Table.Container>

      <Dialog
        returnFocusRef={returnFocusRef}
        isOpen={open}
        onDismiss={() => setOpen(false)}
        aria-labelledby="header"
      >
        <div data-testid="inner">
          <Dialog.Header id="header">Purchase Invoice Details</Dialog.Header>
          {purchase && (
            <div className="px-2 py-4 text-xs">
              Created by <Label variant="accent">{purchase?.createdBy}</Label>{" "}
              <RelativeTime date={new Date(purchase?.updatedAt)} />
            </div>
          )}
          <DataTable
            aria-labelledby="repositories"
            aria-describedby="repositories-subtitle"
            data={purchase?.items || []}
            columns={[
              {
                header: "Name",
                field: "name",
                rowHeader: true,
              },
              {
                header: "Max Retail Price",
                field: "mrp",
                rowHeader: true,
              },
              {
                header: "Quantity",
                field: "quantity",
                renderCell: (row) => {
                  return <Label>{row.quantity}</Label>;
                },
              },
            ]}
          />
          <Table.Divider />
          <div className="flex items-center gap-2 justify-end p-2">
            <Button variant="invisible" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
