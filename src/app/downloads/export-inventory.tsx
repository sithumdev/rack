"use client";

import { CSVLink } from "react-csv";
import { InventoryExportType, InventoryType } from "../_lib/types";
import { Button } from "@primer/react";
import { Product } from "@prisma/client";

type IExportInventory = {
  inventories: InventoryExportType[];
  products: Product[];
};

export default function ExportInventory({
  inventories,
  products,
}: IExportInventory) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <div className="border p-10 roundedn-md">
        <h4 className="text-4xl">Inventory Report</h4>
        <p className="text-xs mb-5 mt-2">
          Download the inventory snapshot using below link
        </p>
        <Button>
          <CSVLink
            data={[
              Object.keys(inventories[0]),
              ...inventories.map((inventory: InventoryExportType) => {
                return Object.values(inventory);
              }),
            ]}
          >
            Inventory Snapshot
          </CSVLink>
        </Button>
      </div>
      <div className="border p-10 roundedn-md">
        <h4 className="text-4xl">Product Report</h4>
        <p className="text-xs mb-5 mt-2">
          Download the products snapshot using below link
        </p>
        <Button>
          <CSVLink
            data={[
              Object.keys(products[0]),
              ...products.map((product: Product) => {
                return Object.values(product);
              }),
            ]}
          >
            Products Snapshot
          </CSVLink>
        </Button>
      </div>
    </section>
  );
}
