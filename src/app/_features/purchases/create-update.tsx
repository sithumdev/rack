"use client";

import { InventoryType } from "@/app/_lib/types";
import { createPurchaseInvoiceAction } from "@/app/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, FormControl, Select, TextInput } from "@primer/react";
import { Table } from "@primer/react/drafts";
import { User } from "@prisma/client";
import { useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import CreatePurchaseSchema, {
  CreatePurchaseSchemaType,
} from "./schema/create.schema";

type ICreatePurchase = {
  open: boolean;
  onClose: () => void;
  currentUser: User;
  inventories: InventoryType[];
};

export default function CreateUpdatePurchase({
  open,
  onClose,
  currentUser,
  inventories,
}: ICreatePurchase) {
  const returnFocusRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreatePurchaseSchemaType>({
    defaultValues: {
      inventoryId: inventories.length > 0 ? String(inventories[0].id) : "0",
    },
    resolver: zodResolver(CreatePurchaseSchema),
  });

  const onSubmit: SubmitHandler<CreatePurchaseSchemaType> = async (data) => {
    await createPurchaseInvoiceAction({
      ...data,
      quantity: Number(data.quantity),
      inventoryId: Number(data.inventoryId),
      createdBy: currentUser.id,
      updatedBy: currentUser.id,
    });
    reset();
    onClose();
  };

  return (
    <Dialog
      returnFocusRef={returnFocusRef}
      isOpen={open}
      onDismiss={onClose}
      aria-labelledby="header"
    >
      <div data-testid="inner">
        <Dialog.Header id="header">Create Purchase</Dialog.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3 p-3">
            <FormControl>
              <FormControl.Label>Inventory</FormControl.Label>
              <Select
                onChange={(e) => {
                  setValue("inventoryId", e.target.value);
                }}
              >
                {inventories.map((inventory) => (
                  <Select.Option
                    key={inventory.id}
                    value={inventory.id.toString()}
                  >
                    {inventory.name} - {inventory.mrp}
                  </Select.Option>
                ))}
              </Select>
            </FormControl>

            <FormControl id={"quantity"}>
              <FormControl.Label>Quantity</FormControl.Label>
              <TextInput
                type="number"
                className="w-full"
                placeholder="Quantity"
                {...register("quantity")}
                validationStatus={errors.quantity && "error"}
              />
              {errors.quantity && (
                <FormControl.Validation variant="error">
                  Quantity is required
                </FormControl.Validation>
              )}
            </FormControl>
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
