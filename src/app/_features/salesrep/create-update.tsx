"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Modal, message } from "antd";
import { useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { createSalesRepAction } from "../../actions";
import CreateSalesRepSchema, {
  CreateSalesRepSchemaType,
} from "./schema/create.schema";

type CreateUpdateSalesRep = {
  isOpen: boolean;
  closeHandler: () => void;
  createHandler: () => void;
};

export default function CreateUpdateSalesRep({
  isOpen,
  closeHandler,
  createHandler,
}: CreateUpdateSalesRep) {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);

  const ref = useRef<HTMLFormElement>(null);

  const { handleSubmit, control, reset } = useForm<CreateSalesRepSchemaType>({
    resolver: zodResolver(CreateSalesRepSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit: SubmitHandler<CreateSalesRepSchemaType> = async (data) => {
    setLoading(true);

    await createSalesRepAction(data);

    setLoading(false);
    reset();
    createHandler();
    messageApi.open({
      type: "success",
      content: `${data.name} added successfully`,
    });
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="New Sales Representative"
        open={isOpen}
        onCancel={closeHandler}
        footer={false}
      >
        <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
          <Form.Item label="Name">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  placeholder="Name"
                  status={fieldState.error ? "error" : undefined}
                />
              )}
            />
          </Form.Item>
          <div key={1} className="flex items-center gap-3 mt-5 justify-end">
            <Button type="text" onClick={closeHandler}>
              Cancel
            </Button>
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
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
