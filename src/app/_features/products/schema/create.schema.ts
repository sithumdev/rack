import { z } from "zod";

const CreateProductSchema = z.object({
  name: z.string().min(1),
  barcode: z.string().length(13),
  price: z.string().min(1),
  weight: z.string().min(1),
  categoryId: z.number().min(1),
});

export type CreateProductSchemaType = z.infer<typeof CreateProductSchema>;

export default CreateProductSchema;
