import { z } from "zod";

export const UpdateAuditSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
});

export type UpdateAuditReqDto = z.infer<typeof UpdateAuditSchema>;
