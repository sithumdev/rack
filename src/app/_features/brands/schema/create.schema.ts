import { z } from "zod";

const CreateBrandSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
});

export type CreateBrandSchemaType = z.infer<typeof CreateBrandSchema>;

export default CreateBrandSchema;
