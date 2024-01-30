"use client";

import { useBusinessStore } from "@/app/_store";
import { createProductAction } from "@/app/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, FormControl, Select, TextInput } from "@primer/react";
import { Table } from "@primer/react/drafts";
import { Category, User } from "@prisma/client";
import { useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import CreateProductSchema, {
  CreateProductSchemaType,
} from "./schema/create.schema";

type ICreateProduct = {
  open: boolean;
  onClose: () => void;
  currentUser: User;
  categories: Category[];
};

export default function CreateUpdateProduct({
  open,
  onClose,
  currentUser,
  categories,
}: ICreateProduct) {
  const selectedBusiness = useBusinessStore((state) => state.business);

  const returnFocusRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateProductSchemaType>({
    defaultValues: {
      categoryId: categories.length > 0 ? categories[0].id : 0,
    },
    resolver: zodResolver(CreateProductSchema),
  });

  const onSubmit: SubmitHandler<CreateProductSchemaType> = async (data) => {
    await createProductAction({
      ...data,
      price: Number(data.price),
      weight: Number(data.weight),
      categoryId: Number(data.categoryId),
      createdBy: currentUser.id,
      updatedBy: currentUser.id,
      businessId: selectedBusiness?.id,
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
        <Dialog.Header id="header">Create Product</Dialog.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3 p-3">
            <FormControl id={"name"}>
              <FormControl.Label>Name</FormControl.Label>
              <TextInput
                className="w-full"
                placeholder="Name"
                type="text"
                {...register("name")}
                validationStatus={errors.name && "error"}
              />
              {errors.name && (
                <FormControl.Validation variant="error">
                  Name is required
                </FormControl.Validation>
              )}
            </FormControl>

            <FormControl id={"barcode"}>
              <FormControl.Label>Barcode</FormControl.Label>
              <TextInput
                className="w-full"
                placeholder="Barcode"
                type="number"
                {...register("barcode")}
                validationStatus={errors.barcode && "error"}
              />
              {errors.barcode && (
                <FormControl.Validation variant="error">
                  Barcode is required
                </FormControl.Validation>
              )}
            </FormControl>
            <FormControl id={"price"}>
              <FormControl.Label>Price</FormControl.Label>
              <TextInput
                type="number"
                className="w-full"
                placeholder="Price"
                {...register("price")}
                validationStatus={errors.price && "error"}
              />
              {errors.price && (
                <FormControl.Validation variant="error">
                  Price is required
                </FormControl.Validation>
              )}
            </FormControl>
            <FormControl id={"weight"}>
              <FormControl.Label>Weight</FormControl.Label>
              <TextInput
                type="number"
                className="w-full"
                placeholder="Weight"
                {...register("weight")}
                validationStatus={errors.weight && "error"}
              />
              {errors.weight && (
                <FormControl.Validation variant="error">
                  Weight is required
                </FormControl.Validation>
              )}
            </FormControl>

            <FormControl>
              <FormControl.Label>Category</FormControl.Label>
              <Select
                onChange={(e) => {
                  setValue("categoryId", Number(e.target.value));
                }}
              >
                {categories.map((category) => (
                  <Select.Option
                    key={category.id}
                    value={category.id.toString()}
                  >
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
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
