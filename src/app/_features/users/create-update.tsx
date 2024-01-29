"use client";

import { supabaseClient } from "@/app/_lib/supabase";
import { useBusinessStore } from "@/app/_store";
import { createUserAction } from "@/app/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, FormControl, TextInput } from "@primer/react";
import { Table } from "@primer/react/drafts";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import CreateUserSchema, { CreateUserSchemaType } from "./schema/create.schema";
import { User } from "@supabase/supabase-js";

type ICreateUpdateUser = {
  open: boolean;
  onClose: () => void;
};

export default function CreateUpdateUser({ open, onClose }: ICreateUpdateUser) {
  const selectedBusiness = useBusinessStore((state) => state.business);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabaseClient.auth.getSession();

      console.log(data.session);

      if (data && data.session && data.session.user) {
        setCurrentUser(data.session.user);
      }
    })();
  }, []);

  const returnFocusRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserSchemaType>({
    resolver: zodResolver(CreateUserSchema),
  });

  const onSubmit: SubmitHandler<CreateUserSchemaType> = async (data) => {
    const { email, password, phone, name } = data;

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
          assignedBy: currentUser?.email,
          businessId: selectedBusiness?.id,
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
