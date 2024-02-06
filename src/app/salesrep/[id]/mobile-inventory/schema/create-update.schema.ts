import { z } from "zod";

interface ICreateMobileInventory {
  available: string;
  defective: string;
  mrp: number;
  sellingPrice: string;
  sku: string;
  sold: string;
  productId: number;
}

const CreateMobileInventorySchema: z.ZodType<ICreateMobileInventory> = z.object(
  {
    available: z.string(),
    defective: z.string(),
    mrp: z.number(),
    sellingPrice: z.string(),
    sku: z.string().min(1),
    sold: z.string(),
    productId: z.number(),
  }
);

export type CreateMobileInventorySchemaType = z.infer<
  typeof CreateMobileInventorySchema
>;

export default CreateMobileInventorySchema;
