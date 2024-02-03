"use client";

import { INVENTORY_LEVEL, TABLE_ROW_SIZE } from "@/app/_lib/globals";
import { InventoryType } from "@/app/_lib/types";
import {
  Button,
  FormControl,
  Label,
  RelativeTime,
  Spinner,
  TextInput,
} from "@primer/react";
import { DataTable, Table } from "@primer/react/drafts";
import { Product, User } from "@prisma/client";
import numeral from "numeral";
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
  const [change, setChange] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const [inventories, setInventories] = useState<InventoryType[]>([]);

  const onDialogOpen = useCallback(() => setIsOpen(true), []);

  const [loading, setLoading] = useState<boolean>(false);

  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [updatingInventory, setUpdatingInventory] = useState<InventoryType>();

  const onDialogClose = useCallback(() => {
    setIsOpen(false);
    setIsUpdate(false);
    setUpdatingInventory(undefined);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const formData = new FormData();

      formData.append("query", query);
      formData.append("take", TABLE_ROW_SIZE.toString());
      formData.append("skip", page.toString());

      const response = await fetch("/api/inventory", {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        const data = await response.json();

        if (data && Object.hasOwn(data, "inventory")) {
          setInventories(data.inventory);
          setTotal(data.total);
        }
      }
      setLoading(false);
    })();
  }, [query, change, page]);

  return (
    <>
      <Table.Container>
        <Table.Title as="h2" id="repositories">
          Inventory
        </Table.Title>
        {currentUser.type === "MANAGER" ||
          (currentUser.type === "OWNER" && (
            <Table.Actions>
              <Button disabled={loading} onClick={onDialogOpen}>
                Create Inventory
              </Button>
            </Table.Actions>
          ))}
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
        {loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <Spinner />
          </div>
        ) : (
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
                header: "MRP (Rs)",
                field: "mrp",
                renderCell: (row) => {
                  return <span>{numeral(row.mrp).format("0,0")}</span>;
                },
              },
              {
                header: "SKU",
                field: "sku",
                rowHeader: true,
              },
              {
                header: "Barcode",
                field: "defective",
                renderCell: (row) => {
                  return <Label>{row.barcode}</Label>;
                },
              },
              // {
              //   header: "Sold",
              //   field: "sold",
              //   rowHeader: true,
              // },
              // {
              //   header: "Defective",
              //   field: "defective",
              //   rowHeader: true,
              // },
              {
                header: "Available",
                field: "available",
                renderCell: (row) => {
                  if (row.available > INVENTORY_LEVEL.LOW) {
                    return <Label variant="success">{row.available}</Label>;
                  } else if (row.available > INVENTORY_LEVEL.DANGER) {
                    return <Label variant="attention">{row.available}</Label>;
                  }

                  return <Label variant="danger">{row.available}</Label>;
                },
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
                field: "updatedAt",
                renderCell: (row) => {
                  return (
                    <Button
                      variant="invisible"
                      disabled={currentUser.type === "EMPLOYEE"}
                      onClick={() => {
                        setIsUpdate(true);
                        setUpdatingInventory(row);
                      }}
                    >
                      Update
                    </Button>
                  );
                },
              },
            ]}
          />
        )}
        <Table.Pagination
          pageSize={TABLE_ROW_SIZE}
          totalCount={total}
          aria-label="pagination"
          onChange={(pageIndex) => {
            setPage(pageIndex.pageIndex * TABLE_ROW_SIZE);
          }}
        />
      </Table.Container>
      <CreateUpdateInventory
        key={`${isUpdate}`}
        open={isOpen || isUpdate}
        onClose={onDialogClose}
        currentUser={currentUser}
        products={products}
        onChangeHandler={() => setChange((prev) => !prev)}
        isUpdate={isUpdate}
        inventory={updatingInventory}
      />
    </>
  );
}
