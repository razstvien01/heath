import { z } from "zod";

export const AuditSchema = z.object({
  id: z.coerce.number().optional(),
  ownerId: z.number().optional(),
  ownerGuid: z.string().uuid("Management Guid must be a valid UUID").optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .optional(),
  publicGuid: z.string().uuid("Public Guid must be a valid UUID").optional(),
  createdAt: z.date().default(new Date()).optional(),
  entries: z
    .number()
    .int()
    .min(0, "Entries must be a non-negative integer")
    .default(0)
    .optional(),
  description: z.string().optional(),
});

export type AuditDto = z.infer<typeof AuditSchema>;
