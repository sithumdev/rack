import { USER_TYPE } from "@prisma/client";
import { z } from "zod";

const CreateUserSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().length(10),
    password: z.string().min(6).max(20),
    confirmPassword: z.string().min(6).max(20),
    isActive: z.boolean().default(false),
    type: z
      .enum([
        USER_TYPE.EMPLOYEE,
        USER_TYPE.MANAGER,
        USER_TYPE.OWNER,
        USER_TYPE.SUPPLIER,
      ])
      .default(USER_TYPE.EMPLOYEE),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;

export default CreateUserSchema;
