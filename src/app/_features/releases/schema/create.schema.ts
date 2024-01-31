import { z } from "zod";

const CreateReleaseSchema = z.object({
  whom: z.string().min(1),
  items: z.array(
    z.object({
      name: z.string(),
      mrp: z.string(),
      inventoryId: z.string().min(1),
      quantity: z.string(),
      available: z.number(),
    })
  ),
});

export type CreateReleaseSchemaType = z.infer<typeof CreateReleaseSchema>;

export default CreateReleaseSchema;
