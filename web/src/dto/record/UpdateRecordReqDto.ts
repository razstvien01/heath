import { z } from "zod";

export const UpdateRecordSchema = z.object({
  id: z.number(),
  receipt: z.instanceof(Buffer).nullable(),
  signature: z.string().max(15000).nullable(),
});

export type UpdateRecordReqDto = z.infer<typeof UpdateRecordSchema>;
