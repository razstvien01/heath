import { z } from "zod";

export const RecordSchema = z.object({
  id: z.coerce.number().optional(),
  auditId: z.number().optional(),
  amount: z.number().optional(),
  reason: z.string().max(500).optional(),
  receipt: z.instanceof(Buffer).optional(),
  signature: z.string().max(100).optional(),
  approved: z.number().optional(),
  createdAt: z.date().default(new Date()).optional(),
  updatedAt: z.date().default(new Date()).optional(),
  guid: z.string().uuid("Public Guid must be a valid UUID").optional()
});

export type RecordDto = z.infer<typeof RecordSchema>;
