import { Inventory, Product } from "@prisma/client";

export type InventoryType = {
  id: number;
  name: string;
  mrp: number;
  sellingPrice: number;
  available: number;
  defective: number;
  sku: string;
  sold: number;
  updatedAt: Date;
};
