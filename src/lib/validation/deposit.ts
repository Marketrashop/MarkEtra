import { z } from "zod";

export const approveDepositSchema = z.object({
  adminNote: z
    .string()
    .trim()
    .max(1000)
    .optional(),
});

export const rejectDepositSchema = z.object({
  adminNote: z
    .string()
    .trim()
    .min(
      5,
      "A rejection reason is required.",
    )
    .max(1000),
});

export type ApproveDepositInput =
  z.infer<
    typeof approveDepositSchema
  >;

export type RejectDepositInput =
  z.infer<
    typeof rejectDepositSchema
  >;