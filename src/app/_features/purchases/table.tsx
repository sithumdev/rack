"use client";

import { PurchaseType } from "@/app/_lib/types";
import { Button, RelativeTime } from "@primer/react";
import { DataTable, Table } from "@primer/react/drafts";
import Link from "next/link";

type IPurchasesTable = {
  rows: PurchaseType[];
};

export default function PurchasesTable({ rows }: IPurchasesTable) {
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
    </>
  );
}
