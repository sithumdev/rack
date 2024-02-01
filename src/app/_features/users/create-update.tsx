"use client";

import { supabaseClient } from "@/app/_lib/supabase";
import { getPermissionByName } from "@/app/_lib/utilities";
import { createUserAction } from "@/app/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, FormControl, Select, TextInput } from "@primer/react";
import { Table } from "@primer/react/drafts";
import { USER_TYPE } from "@prisma/client";
import { useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import CreateUserSchema, { CreateUserSchemaType } from "./schema/create.schema";

type ICreateUpdateUser = {
  open: boolean;
  onClose: () => void;
};

export default function CreateUpdateUser({ open, onClose }: ICreateUpdateUser) {
  const returnFocusRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateUserSchemaType>({
    resolver: zodResolver(CreateUserSchema),
  });

  const onSubmit: SubmitHandler<CreateUserSchemaType> = async (data) => {
    const { email, password, phone, name, type } = data;

    try {
      const { data: createdUser, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        phone: phone,
      });

      if (createdUser.user) {
        await createUserAction({
          email,
          name,
          type,
        });
        reset();
        onClose();
      }

      if (error) {
        console.log(error);

        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      returnFocusRef={returnFocusRef}
      isOpen={open}
      onDismiss={onClose}
      aria-labelledby="header"
    >
      <div data-testid="inner">
        <Dialog.Header id="header">Create User</Dialog.Header>
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
                {...register("phone")}
                validationStatus={errors.phone && "error"}
              />
              {errors.phone && (
                <FormControl.Validation variant="error">
                  Phone number is required
                </FormControl.Validation>
              )}
            </FormControl>
            <FormControl id={"password"}>
              <FormControl.Label>Password</FormControl.Label>
              <TextInput
                type="password"
                className="w-full"
                placeholder="Password"
                autoComplete="new-password"
                {...register("password")}
                validationStatus={errors.password && "error"}
              />
              {errors.password && (
                <FormControl.Validation variant="error">
                  Password is required
                </FormControl.Validation>
              )}
            </FormControl>
            <FormControl id={"confirm-password"}>
              <FormControl.Label>Re-enter Password</FormControl.Label>
              <TextInput
                type="password"
                className="w-full"
                placeholder="Re-enter password"
                autoComplete="new-password"
                {...register("confirmPassword")}
                validationStatus={errors.confirmPassword && "error"}
              />
              {errors.confirmPassword && (
                <FormControl.Validation variant="error">
                  {errors.confirmPassword.message}
                </FormControl.Validation>
              )}
            </FormControl>

            <FormControl>
              <FormControl.Label>Role</FormControl.Label>
              <Select
                defaultValue={USER_TYPE.EMPLOYEE.toString()}
                onChange={(e) => {
                  setValue("type", getPermissionByName(e.target.value));
                }}
              >
                {Object.keys(USER_TYPE).map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </FormControl>
          </div>
          <Table.Divider />
          <div className="flex items-center gap-2 justify-end p-2">
            <Button variant="invisible" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
