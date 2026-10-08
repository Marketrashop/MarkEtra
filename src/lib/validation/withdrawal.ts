import { z } from "zod";

export const createWithdrawalSchema = z.object({
  withdrawalMethodId: z
    .string()
    .uuid("Invalid withdrawal method."),

  amount: z.coerce
    .number()
    .positive("Withdrawal amount must be greater than zero."),

balanceType: z.enum([
  "wallet",
  "profit",
]),

  destinationAddress: z
    .string()
    .trim()
    .optional(),

  accountHolderName: z
    .string()
    .trim()
    .optional(),

  bankName: z
    .string()
    .trim()
    .optional(),

  accountNumber: z
    .string()
    .trim()
    .optional(),

  country: z
    .string()
    .trim()
    .optional(),

  currency: z
    .string()
    .trim()
    .optional(),

  bankAddress: z
    .string()
    .trim()
    .optional(),

  swiftBic: z
    .string()
    .trim()
    .optional(),

  iban: z
    .string()
    .trim()
    .optional(),

  routingNumber: z
    .string()
    .trim()
    .optional(),

  sortCode: z
    .string()
    .trim()
    .optional(),

  ifsc: z
    .string()
    .trim()
    .optional(),
});

export type CreateWithdrawalInput =
  z.infer<
    typeof createWithdrawalSchema
  >;