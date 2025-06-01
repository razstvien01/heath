import { z } from "zod";

export const CreateBackdatedSchema = z.object({
  auditId: z.number(),
  amount: z.number(),
  reason: z.string().max(500),
  receipt: z.instanceof(Buffer).nullable(),
  signature: z.string().max(15000).nullable(),
  approved: z.number(),
  createdAt: z.date().default(new Date()).optional(),
  updatedAt: z.date().default(new Date()).optional(),
});

export type CreateBackdatedReqDto = z.infer<typeof CreateBackdatedSchema>;
