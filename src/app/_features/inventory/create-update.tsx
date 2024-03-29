"use client";

import { InventoryType } from "@/app/_lib/types";
import { createInventoryAction, updateInventoryAction } from "@/app/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  FormControl,
  Label,
  Spinner,
  TextInput,
} from "@primer/react";
import { Table } from "@primer/react/drafts";
import { Product, User } from "@prisma/client";
import { AutoComplete } from "antd";
import numeral from "numeral";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import CreateInventorySchema, {
  CreateInventorySchemaType,
} from "./schema/create.schema";

type IInventory = {
  open: boolean;
  onClose: () => void;
  onChangeHandler: () => void;
  currentUser: User;
  products: Product[];
  isUpdate?: boolean;
  inventory?: InventoryType;
};

function getDefaultProduct(
  inventory: InventoryType | undefined,
  products: Product[]
) {
  if (inventory) {
    return inventory.productId;
  } else if (products.length > 0) {
    return products[0].id;
  }
  return 0;
}

export default function CreateUpdateInventory({
  open,
  onClose,
  onChangeHandler,
  currentUser,
  products,
  isUpdate,
  inventory,
}: IInventory) {
  const returnFocusRef = useRef(null);

  const [selectedProduct, setSelectedProduct] = useState<Product>();

  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateInventorySchemaType>({
    defaultValues: {
      productId: String(getDefaultProduct(inventory, products)),
      sellingPrice:
        inventory?.sellingPrice || products.length > 0
          ? String(products[0].price)
          : "",
      sku: inventory?.sku || "",
      available: String(inventory?.available) || "",
      defective: String(inventory?.defective) || "",
      sold: String(inventory?.sold) || "",
    },
    resolver: zodResolver(CreateInventorySchema),
  });

  const onSubmit: SubmitHandler<CreateInventorySchemaType> = async (data) => {
    setLoading(true);
    if (isUpdate) {
      await updateInventoryAction({
        ...data,
        id: inventory?.id,
        available: Number(data.available),
        sold: Number(data.sold),
        defective: Number(data.defective),
        updatedBy: currentUser.id,
      });
    } else {
      await createInventoryAction({
        ...data,
        productId: Number(data.productId),
        sellingPrice: Number(data.sellingPrice),
        available: Number(data.available),
        sold: Number(data.sold),
        defective: Number(data.defective),
        createdBy: currentUser.id,
        updatedBy: currentUser.id,
      });
    }
    reset();
    onClose();
    onChangeHandler();
    setLoading(false);
  };

  return (
    <Dialog
      returnFocusRef={returnFocusRef}
      isOpen={open}
      onDismiss={onClose}
      aria-labelledby="header"
      size="xlarge"
    >
      <div data-testid="inner">
        <Dialog.Header id="header">Create Inventory</Dialog.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-1 min-w-full">
            <div className="col-span-2 p-3">
              <FormControl disabled={isUpdate}>
                <FormControl.Label>Product</FormControl.Label>
                <AutoComplete
                  style={{ width: "100%" }}
                  options={products}
                  placeholder="Search product"
                  filterOption={(inputValue, option) =>
                    option!.name
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                  onSelect={(_, option) => {
                    setValue("productId", String(option.id));
                    setSelectedProduct(option);
                    setValue("sellingPrice", String(option));
                  }}
                />

                {/* <Select
                  defaultValue={String(getDefaultProduct(inventory, products))}
                  onChange={(e) => {
                    setValue("productId", e.target.value);
                    const product = products.find(
                      (product) => product.id === Number(e.target.value)
                    );
                    setSelectedProduct(product);
                    setValue("sellingPrice", String(product?.price) || "0");
                  }}
                >
                  {products.map((product) => (
                    <Select.Option
                      key={product.id}
                      value={product.id.toString()}
                    >
                      {product.name}
                    </Select.Option>
                  ))}
                </Select> */}
              </FormControl>
            </div>

            <div className="flex flex-col gap-3 p-3">
              <FormControl id={"sku"}>
                <FormControl.Label>SKU</FormControl.Label>
                <TextInput
                  type="text"
                  className="w-full"
                  placeholder="SKU"
                  {...register("sku")}
                  validationStatus={errors.sku && "error"}
                />
                {errors.sku && (
                  <FormControl.Validation variant="error">
                    SKU is required
                  </FormControl.Validation>
                )}
              </FormControl>
            </div>
            <div className="flex flex-col gap-3 p-3">
              {selectedProduct && (
                <div className="my-2">
                  <span className="text-xs">Product Price: </span>
                  <Label variant="attention">
                    Rs.{numeral(selectedProduct.price).format("0,0")}
                  </Label>
                </div>
              )}
              <FormControl id={"sellingPrice"} disabled={isUpdate}>
                <FormControl.Label>Selling Price</FormControl.Label>
                <TextInput
                  leadingVisual="Rs"
                  type="number"
                  className="w-full"
                  placeholder="Selling Price"
                  {...register("sellingPrice")}
                  validationStatus={errors.sellingPrice && "error"}
                />
                {errors.sellingPrice && (
                  <FormControl.Validation variant="error">
                    Selling price is required
                  </FormControl.Validation>
                )}
              </FormControl>

              <FormControl id={"available"} disabled={isUpdate}>
                <FormControl.Label>Available</FormControl.Label>
                <TextInput
                  type="number"
                  className="w-full"
                  placeholder="Available"
                  {...register("available")}
                  validationStatus={errors.available && "error"}
                />
                {errors.available && (
                  <FormControl.Validation variant="error">
                    Available is required
                  </FormControl.Validation>
                )}
              </FormControl>

              <FormControl id={"sold"}>
                <FormControl.Label>Sold</FormControl.Label>
                <TextInput
                  type="number"
                  className="w-full"
                  placeholder="Sold"
                  {...register("sold")}
                  validationStatus={errors.sold && "error"}
                />
                {errors.sold && (
                  <FormControl.Validation variant="error">
                    Sold is required
                  </FormControl.Validation>
                )}
              </FormControl>

              <FormControl id={"defective"}>
                <FormControl.Label>Defective</FormControl.Label>
                <TextInput
                  type="number"
                  className="w-full"
                  placeholder="Defective"
                  {...register("defective")}
                  validationStatus={errors.defective && "error"}
                />
                {errors.defective && (
                  <FormControl.Validation variant="error">
                    Defective is required
                  </FormControl.Validation>
                )}
              </FormControl>
            </div>
          </div>

          <Table.Divider />
          <div className="flex items-center gap-2 justify-end p-2">
            <Button variant="invisible" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <Spinner size="small" />
              ) : isUpdate ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
