import { z } from "zod";

const CreateSalesRepPurchaseSchema = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      mrp: z.string(),
      inventoryId: z.string().min(1),
      quantity: z.string(),
    })
  ),
});

export type CreateSalesRepPurchaseSchemaType = z.infer<
  typeof CreateSalesRepPurchaseSchema
>;

export default CreateSalesRepPurchaseSchema;
