"use client";

import { InventoryType } from "@/app/_lib/types";
import { Button, FormControl, RelativeTime, TextInput } from "@primer/react";
import { DataTable, Table } from "@primer/react/drafts";
import { Product, User } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import CreateUpdateInventory from "./create-update";

type IInventoryTable = {
  currentUser: User;
  products: Product[];
};

export default function InventoryTable({
  currentUser,
  products,
}: IInventoryTable) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState<string>("");

  const [inventories, setInventories] = useState<InventoryType[]>([]);

  const onDialogClose = useCallback(() => setIsOpen(false), []);
  const onDialogOpen = useCallback(() => setIsOpen(true), []);

  useEffect(() => {
    (async () => {
      const formData = new FormData();

      formData.append("query", query);

      const response = await fetch("/api/inventory", {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        const data = await response.json();

        if (data && Object.hasOwn(data, "inventory")) {
          setInventories(data.inventory);
        }
      }
    })();
  }, [query]);

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
          data={inventories}
          columns={[
            {
              header: "Name",
              field: "name",
              rowHeader: true,
            },
            {
              header: "MRP",
              field: "mrp",
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
        <Table.Pagination
          totalCount={inventories.length}
          aria-label="pagination"
        />
      </Table.Container>
      <CreateUpdateInventory
        open={isOpen}
        onClose={onDialogClose}
        currentUser={currentUser}
        products={products}
      />
    </>
  );
}
