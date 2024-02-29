export type InventoryType = {
  id: number;
  productId: number;
  name: string;
  barcode: string;
  mrp: number;
  sellingPrice: number;
  available: number;
  defective: number;
  sku: string;
  weight: number;
  sold: number;
  updatedAt: Date;
  updatedBy: string;
  value: string; // used to antd autocomplete requires a value field
  label: string; // used to antd autocomplete requires a label field
};

export type PurchaseItemType = {
  id: number;
  mrp: number;
  name: string;
  quantity: number;
  createdBy: string;
  updatedBy: string;
  updatedAt: Date;
};

export type PurchaseType = {
  id: number;
  items: PurchaseItemType[];
  createdBy: string;
  updatedBy: string;
  updatedAt: Date;
};

export type ReleaseType = {
  id: number;
  items: ReleaseItemType[];
  whom: string;
  createdBy: string;
  updatedBy: string;
  updatedAt: Date;
};

export type ReleaseItemType = {
  id: number;
  mrp: number;
  name: string;
  quantity: number;
  createdBy: string;
  updatedBy: string;
  updatedAt: Date;
};

export type SalesRepType = {
  id: number;
  name: string;
  value: string; // used to antd autocomplete requires a value field
  label: string; // used to antd autocomplete requires a label field
};
