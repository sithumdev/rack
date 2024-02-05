"use client";

import { InventoryType } from "@/app/_lib/types";
import { createPurchaseInvoiceAction } from "@/app/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionList,
  Button,
  Dialog,
  FormControl,
  Label,
  Spinner,
  TextInput,
} from "@primer/react";
import { DataTable, Table } from "@primer/react/drafts";
import { User } from "@prisma/client";
import { AutoComplete, Modal } from "antd";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import CreatePurchaseSchema, {
  CreatePurchaseSchemaType,
} from "./schema/create.schema";

function getDefaultInventory(inventories: InventoryType[]) {
  return inventories.length > 0 ? inventories[0] : null;
}

type ICreatePurchase = {
  currentUser: User;
  inventories: InventoryType[];
};

export default function CreateUpdatePurchase({
  currentUser,
  inventories,
}: ICreatePurchase) {
  const router = useRouter();
  const returnFocusRef = useRef(null);

  const [open, setOpen] = useState<boolean>(false);
  const [openReview, setOpenReview] = useState<boolean>(false);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
    watch,
  } = useForm<CreatePurchaseSchemaType>({
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
    resolver: zodResolver(CreatePurchaseSchema),
  });

  const values = watch("items");

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control,
  });

  const onSubmit: SubmitHandler<CreatePurchaseSchemaType> = () => {
    setOpenReview(true);
  };

  const create = async () => {
    setLoading(true);
    await createPurchaseInvoiceAction({
      createdBy: currentUser.id,
      updatedBy: currentUser.id,
      items: values.map((item) => ({
        inventoryId: Number(item.inventoryId),
        quantity: Number(item.quantity),
      })),
    });
    reset();
    setLoading(false);
    router.push("/purchases");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3 p-3">
          {fields.map((field, index) => (
            <ActionList showDividers key={index}>
              <ActionList.Item>
                <div className="flex items-end gap-4">
                  <FormControl>
                    <FormControl.Label>Inventory</FormControl.Label>
                    <AutoComplete
                      style={{ width: 450 }}
                      options={inventories}
                      placeholder="Search product"
                      filterOption={(inputValue, option) =>
                        option!.name
                          .toUpperCase()
                          .indexOf(inputValue.toUpperCase()) !== -1
                      }
                      onSelect={(_, option) => {
                        setValue(
                          `items.${index}.inventoryId`,
                          String(option.id)
                        );

                        setValue(`items.${index}.name`, option.name);

                        setValue(`items.${index}.mrp`, String(option.mrp));
                      }}
                    />
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
                        Quantity is required
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

      <Modal
        title="Peview Purchase Order"
        open={openReview}
        onOk={() => {
          setOpenReview(false);
          create();
        }}
        onCancel={() => setOpenReview(false)}
        footer={[
          <div key={1} className="flex items-center justify-end gap-3">
            <Button
              key={1}
              variant="invisible"
              onClick={() => setOpenReview(false)}
            >
              Cancel
            </Button>
            <Button
              key={2}
              variant="primary"
              disabled={loading}
              onClick={() => {
                setOpenReview(false);
                create();
              }}
            >
              {loading ? <Spinner size="small" /> : "Create"}
            </Button>
          </div>,
        ]}
      >
        <DataTable
          aria-labelledby="repositories"
          aria-describedby="repositories-subtitle"
          data={values.map((value, index) => ({
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
      </Modal>
    </>
  );
}
