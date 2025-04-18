import { z } from "zod";

export const CreateOwnerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  password: z.string().min(1, "Password is required"),
});

export type CreateOwnerReqDto = z.infer<typeof CreateOwnerSchema>;
