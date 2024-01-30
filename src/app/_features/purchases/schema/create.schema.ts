import { z } from "zod";

const CreatePurchaseSchema = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      mrp: z.string(),
      inventoryId: z.string().min(1),
      quantity: z.string(),
    })
  ),
});

export type CreatePurchaseSchemaType = z.infer<typeof CreatePurchaseSchema>;

export default CreatePurchaseSchema;
