import { z } from "zod";

export const UpdateRecordSchema = z.object({
  id: z.number(),
  receipt: z.instanceof(Buffer).nullable(),
  signature: z.string().max(15000).nullable(),
  amount: z.number(),
  reason: z.string().max(500),
});

export type UpdateRecordReqDto = z.infer<typeof UpdateRecordSchema>;
