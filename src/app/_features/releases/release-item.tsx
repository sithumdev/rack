import { InventoryType } from "@/app/_lib/types";
import {
  ActionList,
  Button,
  FormControl,
  Label,
  Select,
  TextInput,
} from "@primer/react";
import { useFormContext } from "react-hook-form";
import { CreateReleaseSchemaType } from "./schema/create.schema";
import { useEffect, useState } from "react";
import { getDefaultInventory } from "./create-update";
import numeral from "numeral";

type IRelaseItem = {
  index: number;
  inventories: InventoryType[];
  removeHandler: (index: number) => void;
};

export default function ReleaseItem({
  index,
  inventories,
  removeHandler,
}: IRelaseItem) {
  const [selectedInventory, setSelectedInventory] =
    useState<InventoryType | null>(getDefaultInventory(inventories));

  const {
    setValue,
    register,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useFormContext<CreateReleaseSchemaType>();

  const quantity = watch(`items.${index}.quantity`);

  useEffect(() => {
    if (selectedInventory) {
      if (Number(quantity) > selectedInventory.available) {
        setError(`items.${index}.quantity`, {
          type: "max",
          message: `Only ${selectedInventory.available} available`,
        });
      } else {
        clearErrors(`items.${index}.quantity`);
      }
    }
  }, [quantity, setError, index, selectedInventory, clearErrors]);

  return (
    <ActionList showDividers key={index}>
      <ActionList.Item>
        <div className="flex items-end gap-4">
          <FormControl>
            <FormControl.Label>Inventory</FormControl.Label>
            <Select
              onChange={(e) => {
                setValue(`items.${index}.inventoryId`, e.target.value);
                setSelectedInventory(
                  inventories.find(
                    (inventory) => inventory.id === Number(e.target.value)
                  ) || null
                );

                const found = inventories.find(
                  (inventory) => inventory.id === Number(e.target.value)
                );

                setValue(`items.${index}.name`, found?.name || "");

                setValue(`items.${index}.mrp`, String(found?.mrp) || "");

                setValue(`items.${index}.available`, found?.available || 0);
              }}
            >
              {inventories.map((inventory) => (
                <Select.Option
                  key={inventory.id}
                  value={inventory.id.toString()}
                >
                  {inventory.name} - {inventory.mrp}
                </Select.Option>
              ))}
            </Select>
          </FormControl>

          <Label variant="attention">
            Available: {numeral(selectedInventory?.available).format("0,0")}
          </Label>

          <FormControl id={"quantity"}>
            <FormControl.Label>Quantity</FormControl.Label>
            <TextInput
              type="number"
              className="w-full"
              placeholder="Quantity"
              {...register(`items.${index}.quantity`)}
              validationStatus={
                errors.items && errors?.items[index]?.quantity && "error"
              }
            />
            {errors.items && errors?.items[index]?.quantity && (
              <FormControl.Validation variant="error">
                {errors?.items[index]?.quantity?.type === "max"
                  ? errors?.items[index]?.quantity?.message
                  : "Quantity is required"}
              </FormControl.Validation>
            )}
          </FormControl>

          <Button
            onClick={() => {
              removeHandler(index);
            }}
          >
            X
          </Button>
        </div>
      </ActionList.Item>
    </ActionList>
  );
}
