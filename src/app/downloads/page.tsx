import { Spinner } from "@primer/react";
import { getAllInventories } from "../_lib/inventory";
import ExportInventory from "./export-inventory";
import { getAllProducts } from "../_lib/products";

export default async function Downloads() {
  const { inventory } = await getAllInventories();
  const { products } = await getAllProducts();

  if (inventory && products && inventory.length > 0 && products.length > 0) {
    return <ExportInventory inventories={inventory} products={products} />;
  }

  return <Spinner />;
}
