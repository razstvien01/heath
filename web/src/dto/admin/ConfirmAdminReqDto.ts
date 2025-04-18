import { z } from "zod";

export const ConfirmAdminSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  password: z.string().min(1, "Password is required"),
  ownerManagementGuid: z
    .string()
    .uuid("Management Guid must be a valid UUID")
    .optional(),
});

export type ConfirmAdminReqDto = z.infer<typeof ConfirmAdminSchema>;
