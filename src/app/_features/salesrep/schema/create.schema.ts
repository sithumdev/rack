import { z } from "zod";

interface ICreateSalesRep {
  name: string;
}

const CreateSalesRepSchema: z.ZodType<ICreateSalesRep> = z.object({
  name: z.string().min(1, "Name is required"),
});

export type CreateSalesRepSchemaType = z.infer<typeof CreateSalesRepSchema>;

export default CreateSalesRepSchema;
