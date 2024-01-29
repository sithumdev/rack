import { z } from "zod";

const CreateBusinessSchema = z.object({
  name: z.string().min(1),
  address: z.string(),
  website: z.string().url(),
  email: z.string().email(),
  mobile: z.string(),
  description: z.string(),
});

export type CreateBusinessSchemaType = z.infer<typeof CreateBusinessSchema>;

export default CreateBusinessSchema;
