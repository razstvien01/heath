import { z } from "zod";

export const ConfirmOwnerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  managementGuid: z
    .string()
    .uuid("Management Guid must be a valid UUID")
    .optional(),

  password: z.string().min(1, "Password is required").optional(),
});

export type ConfirmOwnerReqDto = z.infer<typeof ConfirmOwnerSchema>;
