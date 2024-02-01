"use client";

import { TABLE_ROW_SIZE } from "@/app/_lib/globals";
import { ReleaseType } from "@/app/_lib/types";
import {
  Button,
  Dialog,
  FormControl,
  Label,
  RelativeTime,
  TextInput,
} from "@primer/react";
import { DataTable, Table } from "@primer/react/drafts";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";

export default function ReleasesTable() {
  const returnFocusRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const [releases, setReleases] = useState<ReleaseType[]>([]);
  const [release, setRelease] = useState<ReleaseType | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const formData = new FormData();

      formData.append("query", query);
      formData.append("take", TABLE_ROW_SIZE.toString());
      formData.append("skip", page.toString());

      const response = await fetch("/api/release", {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        const data = await response.json();

        if (data && Object.hasOwn(data, "releases")) {
          setReleases(data.releases);
          setTotal(data.total);
        }
      }
    })();
  }, [query, page]);

  return (
    <>
      <Table.Container>
        <Table.Title as="h2" id="repositories">
          Release Invoices
        </Table.Title>
        <Table.Actions>
          <Button>
            <Link href="releases/new">Create Release</Link>
          </Button>
        </Table.Actions>
        <Table.Divider />
        <Table.Subtitle as="p" id="repositories-subtitle">
          Release invoices managed by the admin
        </Table.Subtitle>
        <FormControl id={"query"}>
          <FormControl.Label visuallyHidden>Search</FormControl.Label>
          <TextInput
            type="text"
            className="w-full"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </FormControl>
        <DataTable
          aria-labelledby="repositories"
          aria-describedby="repositories-subtitle"
          data={releases}
          columns={[
            {
              header: "ID",
              field: "id",
              rowHeader: true,
            },
            {
              header: "Sales Rep",
              field: "whom",
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
                  <div className="flex items-center gap-1">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => {
                        setRelease(row);
                        setOpen(true);
                      }}
                    >
                      View
                    </Button>

                    <Button>
                      <CSVLink
                        data={[
                          [
                            "id",
                            "whom",
                            "itemId",
                            "mrp",
                            "name",
                            "quantity",
                            "createdBy",
                            "updatedBy",
                            "date",
                          ],
                          ...row.items.map((item) => {
                            return [row.id, row.whom, ...Object.values(item)];
                          }),
                        ]}
                      >
                        Download
                      </CSVLink>
                    </Button>
                  </div>
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

      <Dialog
        returnFocusRef={returnFocusRef}
        isOpen={open}
        onDismiss={() => setOpen(false)}
        aria-labelledby="header"
      >
        <div data-testid="inner">
          <Dialog.Header id="header">Release Invoice Details</Dialog.Header>
          {release && (
            <div className="px-2 py-4 text-xs">
              Created by <Label variant="accent">{release?.createdBy}</Label>{" "}
              <RelativeTime date={new Date(release?.updatedAt)} />
            </div>
          )}
          <DataTable
            aria-labelledby="repositories"
            aria-describedby="repositories-subtitle"
            data={release?.items || []}
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
