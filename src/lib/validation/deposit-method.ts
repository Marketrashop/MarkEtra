import { z } from "zod";

export const depositMethodSchema = z.object({
  name: z.string().trim().min(2).max(100),

  symbol: z.string().trim().min(2).max(20),

  network: z.string().trim().min(2).max(100),

  walletAddress: z.string().trim().min(10),

  displayOrder: z.coerce
    .number()
    .int()
    .min(0),

  isActive: z.boolean().default(true),

  iconKey: z
    .string()
    .nullable()
    .optional(),

  qrCodeKey: z
    .string()
    .nullable()
    .optional(),
});

export type DepositMethodInput = z.infer<
  typeof depositMethodSchema
>;