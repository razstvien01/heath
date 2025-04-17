import { z } from "zod";

export const OwnerFilterSchema = z.object({
  name: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  createdFrom: z.string().date().optional(),
  createdTo: z.string().date().optional(),
  updatedFrom: z.string().date().optional(),
  updatedTo: z.string().date().optional(),
  orderBy: z.enum(["name", "createdAt", "updatedAt"]).optional(),
  orderDirection: z.enum(["asc", "desc"]).optional(),
});

export type OwnerFilterDto = z.infer<typeof OwnerFilterSchema>;
