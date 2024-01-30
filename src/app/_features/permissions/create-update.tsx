"use client";

import { createPermissionAction } from "@/app/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, FormControl, Select, TextInput } from "@primer/react";
import { Table } from "@primer/react/drafts";
import { PERMISSION_LEVEL } from "@prisma/client";
import { useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import CreatePermissionSchema, {
  CreatePermissionSchemaType,
} from "./schema/create.schema";
import { getPermissionByName } from "@/app/_lib/utilities";

type ICreatePermission = {
  open: boolean;
  onClose: () => void;
};

export default function CreateUpdatePermission({
  open,
  onClose,
}: ICreatePermission) {
  const returnFocusRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreatePermissionSchemaType>({
    resolver: zodResolver(CreatePermissionSchema),
  });

  const onSubmit: SubmitHandler<CreatePermissionSchemaType> = async (data) => {
    await createPermissionAction(data);
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
        <Dialog.Header id="header">Create Permission</Dialog.Header>
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

            <FormControl>
              <FormControl.Label>Level</FormControl.Label>
              <Select
                onChange={(e) => {
                  try {
                    setValue("level", getPermissionByName(e.target.value));
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                {Object.keys(PERMISSION_LEVEL).map((permission) => (
                  <Select.Option key={permission} value={permission}>
                    {permission}
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
