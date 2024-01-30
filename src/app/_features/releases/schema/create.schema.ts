import { z } from "zod";

const CreateReleaseSchema = z.object({
  inventoryId: z.string().min(1),
  quantity: z.string(),
  whom: z.string().min(1),
});

export type CreateReleaseSchemaType = z.infer<typeof CreateReleaseSchema>;

export default CreateReleaseSchema;
