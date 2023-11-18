import { z } from "zod";

export const paginatedQuerySchema = z.object({
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
  skip: z.number().optional(),
});
