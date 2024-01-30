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

export type PurchaseType = {
  id: number;
  name: string;
  mrp: number;
  quantity: number;
  createdBy: string;
  updatedBy: string;
  updatedAt: Date;
};
