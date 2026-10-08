import { z } from "zod";

export const walletSearchSchema =
  z.object({
    query: z
      .string()
      .trim()
      .max(
        100,
        "Search query is too long.",
      )
      .optional(),
  });

export const walletAdjustmentSchema =
  z.object({
    userId: z
      .string()
      .uuid(
        "Invalid user ID.",
      ),

    balanceType: z.enum([
      "wallet",
      "profit",
      "totalDeposit",
      "affiliateCommission",
    ]),

    action: z.enum([
      "CREDIT",
      "DEBIT",
    ]),

    amount: z.coerce
      .number({
        message:
          "Amount must be a number.",
      })
      .positive(
        "Amount must be greater than zero.",
      )
      .finite()
      .max(
        1_000_000_000,
        "Amount is too large.",
      ),
  });

export type WalletSearchInput =
  z.infer<
    typeof walletSearchSchema
  >;

export type WalletAdjustmentInput =
  z.infer<
    typeof walletAdjustmentSchema
  >;