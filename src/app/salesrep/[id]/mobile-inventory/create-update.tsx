"use client";

import { createMobileInventoryAction } from "@/app/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl } from "@primer/react";
import { Product, SalesRep, User } from "@prisma/client";
import { AutoComplete, Button, Input, Modal, message } from "antd";
import { useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import CreateMobileInventorySchema, {
  CreateMobileInventorySchemaType,
} from "./schema/create-update.schema";

type ICreateMobileInventory = {
  currentUser: User;
  salesRep: SalesRep;
  products: Product[];
  isOpen: boolean;
  closeHandler: () => void;
  createHandler: () => void;
};

export default function CreateMobileInventory({
  products,
  salesRep,
  currentUser,
  isOpen,
  closeHandler,
  createHandler,
}: ICreateMobileInventory) {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);

  const ref = useRef<HTMLFormElement>(null);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateMobileInventorySchemaType>({
    resolver: zodResolver(CreateMobileInventorySchema),
  });

  console.log(errors);

  const onSubmit: SubmitHandler<CreateMobileInventorySchemaType> = async (
    data
  ) => {
    setLoading(true);

    await createMobileInventoryAction({
      ...data,
      available: Number(data.available),
      defective: Number(data.defective),
      sold: Number(data.sold),
      sellingPrice: Number(data.sellingPrice),
      salesRepId: salesRep.id,
      createdById: currentUser.id,
    });

    setLoading(false);
    reset();
    createHandler();
    messageApi.open({
      type: "success",
      content: "Inventory added successfully",
    });
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="New Inventory"
        open={isOpen}
        onCancel={closeHandler}
        footer={false}
      >
        <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <FormControl.Label>Product</FormControl.Label>
            <AutoComplete
              style={{ width: "100%" }}
              options={products}
              placeholder="Search product"
              filterOption={(inputValue, option) =>
                option!.name.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                -1
              }
              onSelect={(_, option) => {
                setValue("productId", option.id);
                setValue("sellingPrice", String(option.price));
                setValue("mrp", option.price);
              }}
            />
          </FormControl>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <FormControl>
              <FormControl.Label>SKU</FormControl.Label>
              <Controller
                name="sku"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    placeholder="SKU"
                    status={fieldState.error ? "error" : undefined}
                  />
                )}
              />
            </FormControl>

            <FormControl disabled>
              <FormControl.Label>Max Retail Price</FormControl.Label>
              <Controller
                name="mrp"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    placeholder="Max Retail Price"
                    status={fieldState.error ? "error" : undefined}
                    disabled
                  />
                )}
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>Selling Price</FormControl.Label>
              <Controller
                name="sellingPrice"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    placeholder="Selling Price"
                    status={fieldState.error ? "error" : undefined}
                    type="number"
                  />
                )}
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>Available</FormControl.Label>
              <Controller
                name="available"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    placeholder="Available"
                    status={fieldState.error ? "error" : undefined}
                    type="number"
                  />
                )}
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>Defective</FormControl.Label>
              <Controller
                name="defective"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    placeholder="Defective"
                    status={fieldState.error ? "error" : undefined}
                    type="number"
                  />
                )}
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>Sold</FormControl.Label>
              <Controller
                name="sold"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    placeholder="Sold"
                    status={fieldState.error ? "error" : undefined}
                    type="number"
                  />
                )}
              />
            </FormControl>
          </div>
          <div key={1} className="flex items-center gap-3 mt-5 justify-end">
            <Button
              type="text"
              onClick={() => {
                reset();
                closeHandler();
              }}
            >
              Cancel
            </Button>
            <Button
              loading={loading}
              type="primary"
              className="bg-blue-600"
              onClick={() => {
                ref.current?.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                );
              }}
            >
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
