import { z } from "zod";

const CreateInventorySchema = z.object({
  sellingPrice: z.string().min(1),
  sku: z.string().min(1),
  available: z.string().min(1),
  sold: z.string().min(1),
  defective: z.string().min(1),
  productId: z.string().min(1),
});

export type CreateInventorySchemaType = z.infer<typeof CreateInventorySchema>;

export default CreateInventorySchema;
