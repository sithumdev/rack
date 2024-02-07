import { z } from "zod";

const CreateSalesRepRouteSchema = z.object({
  name: z.string().min(1),
  cities: z.array(
    z.object({
      name: z.string(),
    })
  ),
  notes: z.string(),
});

export type CreateSalesRepRouteSchemaType = z.infer<
  typeof CreateSalesRepRouteSchema
>;

export default CreateSalesRepRouteSchema;
