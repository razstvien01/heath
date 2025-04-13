import { z } from "zod";

export const OwnerSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  managementGuid: z
    .string()
    .min(1, "Management Guid is required")
    .max(100, "Management Guid must be less than 100 characters"),
  createdAt: z.date().default(new Date()).optional(),
});

export type OwnerDto = z.infer<typeof OwnerSchema>;
