"use client";

import { createInventoryAction } from "@/app/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, FormControl, Select, TextInput } from "@primer/react";
import { Table } from "@primer/react/drafts";
import { Product, User } from "@prisma/client";
import { useRef } from "react";
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
};

export default function CreateUpdateInventory({
  open,
  onClose,
  onChangeHandler,
  currentUser,
  products,
}: IInventory) {
  const returnFocusRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateInventorySchemaType>({
    defaultValues: {
      productId: products.length > 0 ? String(products[0].id) : "0",
    },
    resolver: zodResolver(CreateInventorySchema),
  });

  const onSubmit: SubmitHandler<CreateInventorySchemaType> = async (data) => {
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
    reset();
    onClose();
    onChangeHandler();
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
            <div className="flex flex-col gap-3 p-3">
              <FormControl>
                <FormControl.Label>Product</FormControl.Label>
                <Select
                  onChange={(e) => {
                    setValue("productId", e.target.value);
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
                </Select>
              </FormControl>

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
              <FormControl id={"sellingPrice"}>
                <FormControl.Label>Selling Price</FormControl.Label>
                <TextInput
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

              <FormControl id={"available"}>
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
            <Button variant="invisible">Cancel</Button>
            <Button type="submit" variant="primary">
              Create
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}