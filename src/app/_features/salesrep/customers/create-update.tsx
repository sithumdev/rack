import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Modal, Space, message } from "antd";
import { useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import CreateSalesRepCustomerSchema, {
  CreateSalesRepCustomerSchemaType,
} from "./schema/create.schema";
import { createSalesRepCustomerAction } from "@/app/actions";
import { FormControl } from "@primer/react";
import { SalesRep, User } from "@prisma/client";

const { TextArea } = Input;

type ICreateSalesRepCustomer = {
  salesRep: SalesRep;
  currentUser: User;
  isOpen: boolean;
  closeHandler: () => void;
  createHandler: () => void;
};

export default function CreateSalesRepCustomer({
  salesRep,
  currentUser,
  isOpen,
  closeHandler,
  createHandler,
}: ICreateSalesRepCustomer) {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);

  const ref = useRef<HTMLFormElement>(null);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateSalesRepCustomerSchemaType>({
    resolver: zodResolver(CreateSalesRepCustomerSchema),
  });

  const onSubmit: SubmitHandler<CreateSalesRepCustomerSchemaType> = async (
    data
  ) => {
    setLoading(true);

    await createSalesRepCustomerAction({
      ...data,
      createdBy: currentUser.id,
      salesRepId: salesRep.id,
    });

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
        title="New Customer"
        open={isOpen}
        onCancel={closeHandler}
        footer={false}
      >
        <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
          {/* Customer Name */}
          <FormControl>
            <FormControl.Label>Name</FormControl.Label>
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
            {errors.name && (
              <FormControl.Validation variant="error">
                Name is required
              </FormControl.Validation>
            )}
          </FormControl>

          <div className="grid grid-cols-2 gap-2">
            {/* Customer City */}
            <div className="mt-2.5">
              <FormControl>
                <FormControl.Label>City</FormControl.Label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      placeholder="City"
                      status={fieldState.error ? "error" : undefined}
                    />
                  )}
                />
                {errors.city && (
                  <FormControl.Validation variant="error">
                    City is required
                  </FormControl.Validation>
                )}
              </FormControl>
            </div>

            {/* Customer Phone */}
            <div className="mt-2.5">
              <FormControl>
                <FormControl.Label>Phone</FormControl.Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Space.Compact>
                      <Input style={{ width: "25%" }} defaultValue="+94" />
                      <Input
                        {...field}
                        placeholder="Phone"
                        status={fieldState.error ? "error" : undefined}
                        style={{ width: "75%" }}
                      />
                    </Space.Compact>
                  )}
                />
                {errors.phone && (
                  <FormControl.Validation variant="error">
                    Phone is required
                  </FormControl.Validation>
                )}
              </FormControl>
            </div>
          </div>

          {/* Customer Address */}
          <div className="mt-2.5">
            <FormControl>
              <FormControl.Label>Address</FormControl.Label>
              <Controller
                name="address"
                control={control}
                render={({ field, fieldState }) => (
                  <TextArea
                    {...field}
                    rows={4}
                    placeholder="Address"
                    status={fieldState.error ? "error" : undefined}
                  />
                )}
              />
              {errors.address && (
                <FormControl.Validation variant="error">
                  Address is required
                </FormControl.Validation>
              )}
            </FormControl>
          </div>

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
