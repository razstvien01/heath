import { z } from "zod";

export const OwnerSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .optional(),
  ownerManagementGuid: z
    .string()
    .uuid("Management Guid must be a valid UUID")
    .optional(),
  createdAt: z.date().default(new Date()).optional(),
  password: z.string().min(1, "Password is required").optional(),
});

export type OwnerDto = z.infer<typeof OwnerSchema>;
