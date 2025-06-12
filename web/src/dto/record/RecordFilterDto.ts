import { z } from "zod";

export const RecordFilterSchema = z.object({
  reason: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
  createdFrom: z.string().date().optional(),
  createdTo: z.string().date().optional(),
  updatedFrom: z.string().date().optional(),
  updatedTo: z.string().date().optional(),
  orderBy: z.enum(["reason", "createdAt", "updatedAt"]).optional(),
  orderDirection: z.enum(["asc", "desc"]).optional(),
});

export type RecordFilterDto = z.infer<typeof RecordFilterSchema>;
