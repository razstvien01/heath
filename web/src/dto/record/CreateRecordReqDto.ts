import { z } from "zod";

export const CreateRecordSchema = z.object({
  auditId: z.number(),
  amount: z.number(),
  reason: z.string().max(500),
  receipt: z.instanceof(Buffer),
  signature: z.string().max(100),
  approved: z.number(),
});

export type CreateRecordReqDto = z.infer<typeof CreateRecordSchema>;
