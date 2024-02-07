"use client";

import { MobileInventoriesWithProducts } from "@/app/_lib/mobile-inventory";
import { createSalesRepPurchaseInvoiceAction } from "@/app/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionList, FormControl } from "@primer/react";
import { SalesRep, User } from "@prisma/client";
import {
  AutoComplete,
  Button,
  Divider,
  Input,
  Modal,
  Table,
  TableProps,
} from "antd";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import CreateSalesRepPurchaseSchema, {
  CreateSalesRepPurchaseSchemaType,
} from "./schema/create.schema";

function getDefaultInventory(inventories: MobileInventoriesWithProducts[]) {
  return inventories.length > 0 ? inventories[0] : null;
}

const COLUMNS: TableProps["columns"] = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (name) => <span>{name}</span>,
  },
  {
    title: "Max Retail Price",
    dataIndex: "mrp",
    key: "mrp",
    render: (mrp) => <span>{mrp}</span>,
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
    render: (quantity) => <span>{quantity}</span>,
  },
];

type ICreateUpdateSalesRepPurchase = {
  currentUser: User;
  inventories: MobileInventoriesWithProducts[];
  salesRep: SalesRep;
};

export default function CreateUpdateSalesRepPurchase({
  currentUser,
  inventories,
  salesRep,
}: ICreateUpdateSalesRepPurchase) {
  const router = useRouter();

  const ref = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
    watch,
  } = useForm<CreateSalesRepPurchaseSchemaType>({
    defaultValues: {
      items: [
        {
          inventoryId: String(getDefaultInventory(inventories)?.id) || "0",
          quantity: "",
          mrp: String(getDefaultInventory(inventories)?.mrp) || "",
          name: getDefaultInventory(inventories)?.product.name || "",
        },
      ],
    },
    resolver: zodResolver(CreateSalesRepPurchaseSchema),
  });

  console.log(errors);

  const values = watch("items");

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control,
  });

  const create = async () => {
    setLoading(true);
    await createSalesRepPurchaseInvoiceAction({
      salesRep: salesRep.id,
      createdBy: currentUser.id,
      items: values.map((item) => ({
        inventoryId: Number(item.inventoryId),
        quantity: Number(item.quantity),
      })),
    });
    reset();
    setLoading(false);
    router.back();
  };

  const removeItem = (index: number) => {
    Modal.confirm({
      title: "Removing item?",
      content: (
        <p className="px-3">Are you sure want to remove item from the list</p>
      ),
      onOk: () => {
        remove(index);
      },
    });
  };

  const review = () => {
    Modal.confirm({
      title: "Review Purchase Invoice",
      content: (
        <>
          <Table dataSource={values} columns={COLUMNS} pagination={false} />
        </>
      ),
      onOk: () => {
        create();
      },
    });
  };

  const onSubmit: SubmitHandler<CreateSalesRepPurchaseSchemaType> = () => {
    review();
  };

  return (
    <>
      <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3 p-3">
          {fields.map((field, index) => (
            <ActionList showDividers key={index}>
              <ActionList.Item>
                <div className="flex items-end gap-4">
                  <FormControl>
                    <FormControl.Label>Inventory</FormControl.Label>
                    <AutoComplete
                      style={{ width: 450 }}
                      options={inventories.map((inventory) => ({
                        ...inventory,
                        value: `${inventory.product.name} - Rs.${inventory.mrp} - ${inventory.product.weight}g`,
                        label: `${inventory.product.name} - Rs.${inventory.mrp} - ${inventory.product.weight}g`,
                      }))}
                      placeholder="Search product"
                      filterOption={(inputValue, option) =>
                        option!.product.name
                          .toUpperCase()
                          .indexOf(inputValue.toUpperCase()) !== -1
                      }
                      onSelect={(_, option) => {
                        setValue(
                          `items.${index}.inventoryId`,
                          String(option.id)
                        );

                        setValue(`items.${index}.name`, option.product.name);

                        setValue(`items.${index}.mrp`, String(option.mrp));
                      }}
                    />
                  </FormControl>

                  <FormControl id={"quantity"}>
                    <FormControl.Label>Quantity</FormControl.Label>
                    <Controller
                      control={control}
                      name={`items.${index}.quantity`}
                      render={({ field, fieldState }) => (
                        <Input
                          type="number"
                          required
                          {...field}
                          placeholder="Quantity"
                          status={fieldState.error ? "error" : undefined}
                        />
                      )}
                    />
                    {/* <TextInput
                      type="number"
                      className="w-full"
                      placeholder="Quantity"
                      {...register(`items.${index}.quantity`)}
                      validationStatus={
                        errors.items &&
                        errors?.items[index]?.quantity &&
                        "error"
                      }
                    /> */}
                    {errors.items && errors?.items[index]?.quantity && (
                      <FormControl.Validation variant="error">
                        Quantity is required
                      </FormControl.Validation>
                    )}
                  </FormControl>

                  <Button onClick={() => removeItem(index)}>X</Button>
                </div>
              </ActionList.Item>
            </ActionList>
          ))}
          <div className="flex justify-end">
            <Button
              type="default"
              onClick={() => {
                append({
                  inventoryId:
                    String(getDefaultInventory(inventories)?.id) || "0",
                  quantity: "0",
                  name: getDefaultInventory(inventories)?.product.name || "",
                  mrp: String(getDefaultInventory(inventories)?.mrp) || "",
                });
              }}
            >
              Add
            </Button>
          </div>
        </div>
        <Divider />
        <div className="flex items-center gap-2 justify-end p-2">
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
            Review & Create
          </Button>
        </div>
      </form>
    </>
  );
}
