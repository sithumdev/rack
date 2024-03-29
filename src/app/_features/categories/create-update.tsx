"use client";

import { createCategoryAction } from "@/app/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, FormControl, Spinner, TextInput } from "@primer/react";
import { Table } from "@primer/react/drafts";
import { User } from "@prisma/client";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import CreateCategorySchema, {
  CreateCategorySchemaType,
} from "./schema/create.schema";

type ICreateCategory = {
  open: boolean;
  onClose: () => void;
  currentUser: User;
};

export default function CreateUpdateCategory({
  open,
  onClose,
  currentUser,
}: ICreateCategory) {
  const returnFocusRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
  });

  const onSubmit: SubmitHandler<CreateCategorySchemaType> = async (data) => {
    setLoading(true);
    await createCategoryAction({
      ...data,
      createdBy: currentUser.id,
      updatedBy: currentUser.id,
    });
    reset();
    onClose();
    setLoading(false);
  };

  return (
    <Dialog
      returnFocusRef={returnFocusRef}
      isOpen={open}
      onDismiss={onClose}
      aria-labelledby="header"
    >
      <div data-testid="inner">
        <Dialog.Header id="header">Create Category</Dialog.Header>
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

            <FormControl id={"description"}>
              <FormControl.Label>Description</FormControl.Label>
              <TextInput
                type="text"
                className="w-full"
                placeholder="Description"
                {...register("description")}
                validationStatus={errors.description && "error"}
              />
            </FormControl>
          </div>
          <Table.Divider />
          <div className="flex items-center gap-2 justify-end p-2">
            <Button variant="invisible" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner size="small" /> : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
