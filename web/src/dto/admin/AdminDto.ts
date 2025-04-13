import { z } from "zod";

export const AdminSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters").optional(),
  password: z.string().min(1, "Password is required").optional(),
  ownerManagementGuid: z
    .string()
    .min(1, "Management Guid is required")
    .max(36, "Management Guid must be at most 36 characters").optional(),
});

export type AdminDto = z.infer<typeof AdminSchema>;
