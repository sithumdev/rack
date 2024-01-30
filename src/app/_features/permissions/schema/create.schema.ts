import { PERMISSION_LEVEL } from "@prisma/client";
import { z } from "zod";

const CreatePermissionSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  level: z
    .enum([
      PERMISSION_LEVEL.BUSINESS,
      PERMISSION_LEVEL.EMPLOYEE,
      PERMISSION_LEVEL.INVENTORY,
    ])
    .default(PERMISSION_LEVEL.INVENTORY),
});

export type CreatePermissionSchemaType = z.infer<typeof CreatePermissionSchema>;

export default CreatePermissionSchema;
