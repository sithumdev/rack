import { createSalesRepRouteAction } from "@/app/actions";
import { DeleteOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl } from "@primer/react";
import { SalesRep, User } from "@prisma/client";
import { Button, Input, Modal, message } from "antd";
import { useRef, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import CreateSalesRepRouteSchema, {
  CreateSalesRepRouteSchemaType,
} from "./schema/create.schema";

const { TextArea } = Input;

type ICreateSalesRepRoute = {
  salesRep: SalesRep;
  currentUser: User;
  isOpen: boolean;
  closeHandler: () => void;
  createHandler: () => void;
};

export default function CreateSalesRepRoute({
  salesRep,
  currentUser,
  isOpen,
  closeHandler,
  createHandler,
}: ICreateSalesRepRoute) {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);

  const ref = useRef<HTMLFormElement>(null);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateSalesRepRouteSchemaType>({
    resolver: zodResolver(CreateSalesRepRouteSchema),
    defaultValues: {
      cities: [
        {
          name: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "cities",
    control,
  });

  const onSubmit: SubmitHandler<CreateSalesRepRouteSchemaType> = async (
    data
  ) => {
    setLoading(true);

    await createSalesRepRouteAction({
      ...data,
      createdBy: currentUser.id,
      salesRepId: salesRep.id,
      cities: data.cities.map((city) => city.name),
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
        title="New Route"
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

          {/* Route Cities */}
          <div className="mt-2.5">
            {fields.map((_, index) => (
              <>
                <div className="flex items-end gap-2 justify-between">
                  <div className="w-full flex-1">
                    <FormControl key={index}>
                      <FormControl.Label>City Name</FormControl.Label>
                      <Controller
                        name={`cities.${index}.name`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <Input
                            {...field}
                            placeholder="City Name"
                            status={fieldState.error ? "error" : undefined}
                          />
                        )}
                      />
                      {errors.cities && errors.cities[index]?.message && (
                        <FormControl.Validation variant="error">
                          City Name is required
                        </FormControl.Validation>
                      )}
                    </FormControl>
                  </div>
                  <Button
                    type="primary"
                    onClick={() => {
                      remove(index);
                    }}
                    icon={<DeleteOutlined />}
                    danger
                  />
                </div>
              </>
            ))}
          </div>
          <div className="flex justify-end mt-2">
            <Button
              type="default"
              onClick={() => {
                append({
                  name: "",
                });
              }}
            >
              Add
            </Button>
          </div>

          {/* Customer Address */}
          <div className="mt-2.5">
            <FormControl>
              <FormControl.Label>Notes</FormControl.Label>
              <Controller
                name="notes"
                control={control}
                render={({ field, fieldState }) => (
                  <TextArea
                    {...field}
                    rows={4}
                    placeholder="Notes"
                    status={fieldState.error ? "error" : undefined}
                  />
                )}
              />
              {errors.notes && (
                <FormControl.Validation variant="error">
                  Notes are required
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
