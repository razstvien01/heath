import { z } from "zod";

export const AdminSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters")
    .optional(),
  password: z.string().min(1, "Password is required").optional(),
  ownerManagementGuid: z
    .string()
    .uuid("Management Guid must be a valid UUID")
    .optional(),
});

export type AdminDto = z.infer<typeof AdminSchema>;
