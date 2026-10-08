import { z } from "zod";

export const subscribeSchema =
  z.object({
    planId: z
      .string()
      .trim()
      .cuid(),
  });

export type SubscribeValues =
  z.infer<
    typeof subscribeSchema
  >;