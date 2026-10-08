import { z } from "zod";

export const submitAffiliateSchema =
  z.object({
    productId: z
      .string()
      .trim()
      .cuid(),
  });

export type SubmitAffiliateValues =
  z.infer<
    typeof submitAffiliateSchema
  >;