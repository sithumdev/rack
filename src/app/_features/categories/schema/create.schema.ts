import { z } from "zod";

const CreateCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string(),
});

export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;

export default CreateCategorySchema;
