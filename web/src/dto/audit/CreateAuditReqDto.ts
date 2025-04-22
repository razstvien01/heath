import { z } from "zod";

export const CreateAuditSchema = z.object({
  ownerId: z.number(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
});

export type CreateAuditReqDto = z.infer<typeof CreateAuditSchema>;
