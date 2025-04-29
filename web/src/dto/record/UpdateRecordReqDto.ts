import { z } from "zod";

export const UpdateRecordSchema = z.object({
  id: z.coerce.number(),
  receipt: z.instanceof(Buffer),
  signature: z.string().max(100),
});

export type UpdateRecordReqDto = z.infer<typeof UpdateRecordSchema>;
