"use client";

import { InventoryType } from "@/app/_lib/types";
import { createReleaseInvoiceAction } from "@/app/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertIcon } from "@primer/octicons-react";
import {
  Button,
  Dialog,
  FormControl,
  Label,
  Octicon,
  Spinner,
  TextInput,
} from "@primer/react";
import { DataTable, Table } from "@primer/react/drafts";
import { User } from "@prisma/client";
import { Modal } from "antd";
import { useRouter } from "next/navigation";
import numeral from "numeral";
import { useRef, useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import ReleaseItem from "./release-item";
import CreateReleaseSchema, {
  CreateReleaseSchemaType,
} from "./schema/create.schema";

export function getDefaultInventory(inventories: InventoryType[]) {
  return inventories.length > 0 ? inventories[0] : null;
}

function hasDuplicateEntries(values: CreateReleaseSchemaType): boolean {
  const seenIds: Set<string> = new Set();

  for (const entry of values.items) {
    if (seenIds.has(entry.inventoryId)) {
      return true;
    }
    seenIds.add(entry.inventoryId);
  }

  return false;
}

function getDuplicateEntries(values: CreateReleaseSchemaType) {
  const seenIds: Set<string> = new Set();
  const duplicateEnties: Set<string> = new Set();

  for (const entry of values.items) {
    if (seenIds.has(entry.inventoryId)) {
      duplicateEnties.add(entry.inventoryId);
    }
    seenIds.add(entry.inventoryId);
  }

  return duplicateEnties;
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

  const [loading, setLoading] = useState<boolean>(false);

  const methods = useForm<CreateReleaseSchemaType>({
    defaultValues: {
      items: [
        {
          inventoryId: String(getDefaultInventory(inventories)?.id) || "0",
          quantity: "0",
          mrp: String(getDefaultInventory(inventories)?.mrp) || "",
          name: getDefaultInventory(inventories)?.name || "",
          available: getDefaultInventory(inventories)?.available || 0,
        },
      ],
    },
    resolver: zodResolver(CreateReleaseSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = methods;

  const values = watch();

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control,
  });

  const onSubmit: SubmitHandler<CreateReleaseSchemaType> = () => {
    setOpenReview(true);
  };

  const create = async () => {
    setLoading(true);
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
    setLoading(false);
    router.push("/releases");
  };

  return (
    <>
      <FormProvider {...methods}>
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
                <ReleaseItem
                  index={index}
                  key={index}
                  inventories={inventories}
                  removeHandler={(index) => {
                    setOpen(true);
                    setRemovingIndex(index);
                  }}
                />
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
                    available: getDefaultInventory(inventories)?.available || 0,
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
      </FormProvider>

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
        title="Peview Release Order"
        open={openReview}
        onOk={() => {
          setOpenReview(false);
          create();
        }}
        onCancel={() => setOpenReview(false)}
        footer={[
          <div key={1} className="flex items-center gap-3 justify-end">
            <Button variant="invisible" onClick={() => setOpenReview(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={
                values.items.filter(
                  (item) => Number(item.quantity) > item.available
                ).length > 0 ||
                hasDuplicateEntries(values) ||
                loading
              }
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
        <div className="flex px-2 py-4 items-center gap-2 text-xs">
          Issuing to <Label variant="accent">{values.whom}</Label>
        </div>
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
              header: "Available",
              field: "available",
              renderCell: (row) => {
                return (
                  <Label variant="attention">
                    {numeral(row.available).format("0,0")}
                  </Label>
                );
              },
            },
            {
              header: "Quantity",
              field: "quantity",
              renderCell: (row) => {
                return (
                  <div className="flex items-center justify-between w-full">
                    <Label>{numeral(row.quantity).format("0,0")}</Label>
                    {getDuplicateEntries(values).size > 0 &&
                      getDuplicateEntries(values).has(
                        String(row.inventoryId)
                      ) && (
                        <Octicon color="#ffbf00" icon={AlertIcon} size={12} />
                      )}
                  </div>
                );
              },
            },
          ]}
        />
      </Modal>
    </>
  );
}
