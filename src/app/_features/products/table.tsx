"use client";

import { TABLE_ROW_SIZE } from "@/app/_lib/globals";
import {
  Button,
  FormControl,
  Label,
  RelativeTime,
  TextInput,
} from "@primer/react";
import { DataTable, Table } from "@primer/react/drafts";
import { Category, Product, User } from "@prisma/client";
import numeral from "numeral";
import { useCallback, useEffect, useState } from "react";
import CreateUpdateProduct from "./create-update";

type IProductsTable = {
  categories: Category[];
  currentUser: User;
};

export default function ProductsTable({
  currentUser,
  categories,
}: IProductsTable) {
  const [change, setChange] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [updatingProduct, setUpdatingProduct] = useState<Product>();

  const [products, setProducts] = useState<Product[]>([]);

  const onDialogClose = useCallback(() => {
    setIsOpen(false);
    setIsUpdate(false);
    setUpdatingProduct(undefined);
  }, []);
  const onDialogOpen = useCallback(() => setIsOpen(true), []);

  useEffect(() => {
    (async () => {
      const formData = new FormData();

      formData.append("query", query);
      formData.append("take", TABLE_ROW_SIZE.toString());
      formData.append("skip", page.toString());

      const response = await fetch("/api/product", {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        const data = await response.json();

        if (data && Object.hasOwn(data, "products")) {
          setProducts(data.products);
          setTotal(data.total);
        }
      }
    })();
  }, [query, change, page]);

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
          data={products}
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
              header: "Weight (g)",
              field: "weight",
              renderCell: (row) => {
                return (
                  <p className="text-center">
                    {numeral(row.weight).format("0,0")}
                  </p>
                );
              },
            },
            {
              header: "Price (Rs)",
              field: "price",
              renderCell: (row) => {
                return <span>{numeral(row.price).format("0,0")}</span>;
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
              field: "updatedById",
              renderCell: (row) => {
                return (
                  <Button
                    variant="invisible"
                    disabled={currentUser.type === "EMPLOYEE"}
                    onClick={() => {
                      setIsUpdate(true);
                      setUpdatingProduct(row);
                    }}
                  >
                    Update
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
      <CreateUpdateProduct
        key={`${isUpdate}`}
        open={isOpen || isUpdate}
        onClose={onDialogClose}
        currentUser={currentUser}
        categories={categories}
        onChangeHandler={() => setChange((prev) => !prev)}
        isUpdate={isUpdate}
        product={updatingProduct}
      />
    </>
  );
}
