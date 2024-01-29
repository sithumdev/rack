"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, FormControl, TextInput } from "@primer/react";
import { Table } from "@primer/react/drafts";
import { useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import CreateBusinessSchema, {
  CreateBusinessSchemaType,
} from "./schema/create.schema";
import { createBusinessAction } from "@/app/actions";
import { supabaseClient } from "@/app/_lib/supabase";
import { User } from "@prisma/client";

type ICreateUpdateBusiness = {
  open: boolean;
  onClose: () => void;
  currentUser: User;
};

export default function CreateUpdateBusiness({
  open,
  onClose,
  currentUser,
}: ICreateUpdateBusiness) {
  const returnFocusRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateBusinessSchemaType>({
    resolver: zodResolver(CreateBusinessSchema),
  });

  const onSubmit: SubmitHandler<CreateBusinessSchemaType> = async (data) => {
    await createBusinessAction({
      ...data,
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
        <Dialog.Header id="header">Create Business</Dialog.Header>
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
            <FormControl id={"email"}>
              <FormControl.Label>Email Address</FormControl.Label>
              <TextInput
                type="text"
                className="w-full"
                placeholder="Email Address"
                autoComplete="username"
                {...register("email")}
                validationStatus={errors.email && "error"}
              />
              {errors.email && (
                <FormControl.Validation variant="error">
                  Email address is required
                </FormControl.Validation>
              )}
            </FormControl>
            <FormControl id={"phone"}>
              <FormControl.Label>Phone</FormControl.Label>
              <TextInput
                type="tel"
                className="w-full"
                placeholder="Phone"
                {...register("mobile")}
                validationStatus={errors.mobile && "error"}
              />
              {errors.mobile && (
                <FormControl.Validation variant="error">
                  Phone number is required
                </FormControl.Validation>
              )}
            </FormControl>

            <FormControl id={"address"}>
              <FormControl.Label>Address</FormControl.Label>
              <TextInput
                type="text"
                className="w-full"
                placeholder="Address"
                {...register("address")}
                validationStatus={errors.address && "error"}
              />
            </FormControl>

            <FormControl id={"website"}>
              <FormControl.Label>Website</FormControl.Label>
              <TextInput
                type="text"
                className="w-full"
                placeholder="Website"
                {...register("website")}
                validationStatus={errors.website && "error"}
              />
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
