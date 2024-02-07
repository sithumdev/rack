import { z } from "zod";

const CreateSalesRepCustomerSchema = z.object({
  name: z.string().min(1),
  city: z.string().min(1),
  address: z.string(),
  phone: z.string().min(1),
});

export type CreateSalesRepCustomerSchemaType = z.infer<
  typeof CreateSalesRepCustomerSchema
>;

export default CreateSalesRepCustomerSchema;
