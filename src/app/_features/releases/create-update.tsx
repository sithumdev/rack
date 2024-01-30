"use client";

import { InventoryType } from "@/app/_lib/types";
import { createReleaseInvoiceAction } from "@/app/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, FormControl, Select, TextInput } from "@primer/react";
import { Table } from "@primer/react/drafts";
import { User } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import CreateReleaseSchema, {
  CreateReleaseSchemaType,
} from "./schema/create.schema";

type ICreateRelease = {
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
}: ICreateRelease) {
  const returnFocusRef = useRef(null);

  const [inventory, setInventory] = useState<InventoryType | undefined>(
    inventories.length > 0 ? inventories[0] : undefined
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm<CreateReleaseSchemaType>({
    defaultValues: {
      inventoryId: inventories.length > 0 ? String(inventories[0].id) : "0",
    },
    resolver: zodResolver(CreateReleaseSchema),
  });

  const quantity = watch("quantity");

  useEffect(() => {
    if (inventory && Number(quantity) > inventory?.available) {
      setError("quantity", {
        type: "max",
        message: `Available only ${inventory.available} from product ${inventory.name}`,
      });
    } else {
      clearErrors("quantity");
    }
  }, [inventory, quantity, setError, clearErrors]);

  const onSubmit: SubmitHandler<CreateReleaseSchemaType> = async (data) => {
    await createReleaseInvoiceAction({
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
        <Dialog.Header id="header">Create Release</Dialog.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3 p-3">
            <FormControl>
              <FormControl.Label>Inventory</FormControl.Label>
              <Select
                onChange={(e) => {
                  setValue("inventoryId", e.target.value);
                  setInventory(
                    inventories.find(
                      (inventory) => inventory.id === Number(e.target.value)
                    )
                  );
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
                max={inventory?.available}
                validationStatus={errors.quantity && "error"}
              />
              {errors.quantity && (
                <FormControl.Validation variant="error">
                  {errors.quantity.type === "max"
                    ? errors.quantity.message
                    : "Quantity is required"}
                </FormControl.Validation>
              )}
            </FormControl>

            <FormControl id={"whom"}>
              <FormControl.Label>Sales Rep</FormControl.Label>
              <TextInput
                type="text"
                className="w-full"
                placeholder="Sales Rep"
                {...register("whom")}
                validationStatus={errors.whom && "error"}
              />
              {errors.whom && (
                <FormControl.Validation variant="error">
                  Sales Rep name is required
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
