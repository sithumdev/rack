"use client";

import { TABLE_ROW_SIZE } from "@/app/_lib/globals";
import { PurchaseType } from "@/app/_lib/types";
import { Button, Dialog, Label, RelativeTime, Spinner } from "@primer/react";
import { DataTable, Table } from "@primer/react/drafts";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function PurchasesTable() {
  const returnFocusRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const [purchases, setPurchases] = useState<PurchaseType[]>([]);

  const [purchase, setPurchase] = useState<PurchaseType | undefined>(undefined);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const formData = new FormData();

      formData.append("query", query);
      formData.append("take", TABLE_ROW_SIZE.toString());
      formData.append("skip", page.toString());

      const response = await fetch("/api/purchase", {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        const data = await response.json();

        if (data && Object.hasOwn(data, "purchaseInvoices")) {
          setPurchases(data.purchaseInvoices);
          setTotal(data.total);
        }
      }
      setLoading(false);
    })();
  }, [query, page]);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Spinner />
        </div>
      ) : (
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
            data={purchases}
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
                header: "Action",
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
            pageSize={TABLE_ROW_SIZE}
            totalCount={total}
            aria-label="pagination"
            onChange={(pageIndex) => {
              setPage(pageIndex.pageIndex * TABLE_ROW_SIZE);
            }}
          />
        </Table.Container>
      )}

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
