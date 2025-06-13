import { z } from "zod";

export const AuditRecordSchema = z.object({
  id: z.number(),
  reason: z.string().max(500),
  amount: z.number(),
  createdAt: z.date(),
  runningBalance: z.number(),
  receipt: z.instanceof(Buffer).optional(),
  signature: z.string().nullable(),
  hasReceipt: z.boolean(),
  hasSignature: z.boolean(),
});

export type AuditRecordDto = z.infer<typeof AuditRecordSchema>;
