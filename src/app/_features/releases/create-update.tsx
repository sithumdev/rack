"use client";

import { InventoryType } from "@/app/_lib/types";
import { createReleaseInvoiceAction } from "@/app/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionList,
  Button,
  Dialog,
  FormControl,
  Label,
  Select,
  TextInput,
} from "@primer/react";
import { DataTable, Table } from "@primer/react/drafts";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import CreateReleaseSchema, {
  CreateReleaseSchemaType,
} from "./schema/create.schema";

function getDefaultInventory(inventories: InventoryType[]) {
  return inventories.length > 0 ? inventories[0] : null;
}

type ICreatePurchase = {
  currentUser: User;
  inventories: InventoryType[];
};

export default function CreateUpdateRelease({
  currentUser,
  inventories,
}: ICreatePurchase) {
  const router = useRouter();
  const returnFocusRef = useRef(null);

  const [open, setOpen] = useState<boolean>(false);
  const [openReview, setOpenReview] = useState<boolean>(false);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
    watch,
    setError,
    clearErrors,
  } = useForm<CreateReleaseSchemaType>({
    defaultValues: {
      items: [
        {
          inventoryId: String(getDefaultInventory(inventories)?.id) || "0",
          quantity: "0",
          mrp: String(getDefaultInventory(inventories)?.mrp) || "",
          name: getDefaultInventory(inventories)?.name || "",
        },
      ],
    },
    resolver: zodResolver(CreateReleaseSchema),
  });

  const values = watch();

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control,
  });

  const onSubmit: SubmitHandler<CreateReleaseSchemaType> = () => {
    setOpenReview(true);
  };

  const create = async () => {
    await createReleaseInvoiceAction({
      whom: values.whom,
      createdBy: currentUser.id,
      updatedBy: currentUser.id,
      items: values.items.map((item) => ({
        inventoryId: Number(item.inventoryId),
        quantity: Number(item.quantity),
      })),
    });
    reset();
    router.push("/releases");
  };

  useEffect(() => {
    values.items.map((item, index) => {
      const foundInventory = inventories.find(
        (inventory) => inventory.id === Number(item.inventoryId)
      );

      if (foundInventory && Number(item.quantity) > foundInventory?.available) {
        setError(`items.${index}.quantity`, {
          type: "max",
          message: `Only ${foundInventory.available} available`,
        });
      } else {
        clearErrors(`items.${index}.quantity`);
      }
    });
  }, [values.items, setError, inventories, clearErrors]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3 p-3">
          <FormControl id={"whom"}>
            <FormControl.Label>Sales Rep</FormControl.Label>
            <TextInput
              type="text"
              className="w-full"
              placeholder="Sales Rep"
              {...register(`whom`)}
              validationStatus={errors.whom && "error"}
            />
            {errors.whom && (
              <FormControl.Validation variant="error">
                Sales Rep name is required
              </FormControl.Validation>
            )}
          </FormControl>
          {fields.map((field, index) => (
            <>
              <ActionList showDividers key={index}>
                <ActionList.Item>
                  <div className="flex items-end gap-4">
                    <FormControl>
                      <FormControl.Label>Inventory</FormControl.Label>
                      <Select
                        onChange={(e) => {
                          setValue(
                            `items.${index}.inventoryId`,
                            e.target.value
                          );

                          setValue(
                            `items.${index}.name`,
                            inventories.find(
                              (inventory) =>
                                inventory.id === Number(e.target.value)
                            )?.name || ""
                          );

                          setValue(
                            `items.${index}.mrp`,
                            String(
                              inventories.find(
                                (inventory) =>
                                  inventory.id === Number(e.target.value)
                              )?.mrp
                            ) || ""
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
                        {...register(`items.${index}.quantity`)}
                        validationStatus={
                          errors.items &&
                          errors?.items[index]?.quantity &&
                          "error"
                        }
                      />
                      {errors.items && errors?.items[index]?.quantity && (
                        <FormControl.Validation variant="error">
                          {errors?.items[index]?.quantity?.type === "max"
                            ? errors?.items[index]?.quantity?.message
                            : "Quantity is required"}
                        </FormControl.Validation>
                      )}
                    </FormControl>

                    <Button
                      onClick={() => {
                        setOpen(true);
                        setRemovingIndex(index);
                      }}
                    >
                      X
                    </Button>
                  </div>
                </ActionList.Item>
              </ActionList>
            </>
          ))}
          <div className="flex justify-end">
            <Button
              variant="default"
              onClick={() => {
                append({
                  inventoryId:
                    String(getDefaultInventory(inventories)?.id) || "0",
                  quantity: "0",
                  name: getDefaultInventory(inventories)?.name || "",
                  mrp: String(getDefaultInventory(inventories)?.mrp) || "",
                });
              }}
            >
              Add
            </Button>
          </div>
        </div>
        <Table.Divider />
        <div className="flex items-center gap-2 justify-end p-2">
          <Button type="submit" variant="primary">
            Review & Create
          </Button>
        </div>
      </form>
      <Dialog
        returnFocusRef={returnFocusRef}
        isOpen={open}
        onDismiss={() => setOpen(false)}
        aria-labelledby="header"
      >
        <div data-testid="inner">
          <Dialog.Header id="header">Remove?</Dialog.Header>
          <p className="px-3">Are you sure want to remove item from the list</p>
          <Table.Divider />
          <div className="flex items-center gap-2 justify-end p-2">
            <Button variant="invisible" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                remove(removingIndex || -1);
                setOpen(false);
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        returnFocusRef={returnFocusRef}
        isOpen={openReview}
        onDismiss={() => setOpenReview(false)}
        aria-labelledby="header"
      >
        <div data-testid="inner">
          <Dialog.Header id="header">Peview Release Order</Dialog.Header>
          <div className="flex px-2 py-4 items-center gap-2 text-xs">
            Issuing to <Label variant="accent">{values.whom}</Label>
          </div>
          <Table.Divider />
          <DataTable
            aria-labelledby="repositories"
            aria-describedby="repositories-subtitle"
            data={values.items.map((value, index) => ({
              ...value,
              id: index,
            }))}
            columns={[
              {
                header: "Name",
                field: "name",
                rowHeader: true,
              },
              {
                header: "Max Retail Price",
                field: "mrp",
                rowHeader: true,
              },
              {
                header: "Quantity",
                field: "quantity",
                renderCell: (row) => {
                  return <Label>{row.quantity}</Label>;
                },
              },
            ]}
          />
          <Table.Divider />
          <div className="flex items-center gap-2 justify-end p-2">
            <Button variant="invisible" onClick={() => setOpenReview(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setOpenReview(false);
                create();
              }}
            >
              Create
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
