import { z } from "zod";

export const withdrawalMethodTypeSchema = z.enum([
  "crypto",
  "bank",
]);

export const processingFeeTypeSchema = z.enum([
  "fixed",
  "percentage",
]);

const withdrawalMethodBaseSchema = z.object({
  type: withdrawalMethodTypeSchema,

  name: z
    .string()
    .trim()
    .min(2, "Method name is required.")
    .max(100, "Method name is too long."),

  symbol: z
    .string()
    .trim()
    .min(2, "Ticker is required.")
    .max(20, "Ticker is too long."),

  network: z
    .string()
    .trim()
    .optional(),

  placeholder: z
    .string()
    .trim()
    .min(2, "Placeholder is required.")
    .max(255, "Placeholder is too long."),

  fee: z.coerce
    .number()
    .min(0, "Fee cannot be negative."),

  feeType: processingFeeTypeSchema,

  minimumAmount: z.coerce
    .number()
    .min(0, "Minimum amount cannot be negative."),

  maximumAmount: z.preprocess(
    (value) => {
      if (
        value === "" ||
        value === null ||
        value === undefined
      ) {
        return null;
      }

      return Number(value);
    },
    z.number().nullable().optional()
  ),

  icon: z
    .string()
    .trim()
    .nullable()
    .optional(),
});

export const withdrawalMethodSchema =
  withdrawalMethodBaseSchema.superRefine(
    (data, context) => {
      if (
        data.type === "crypto" &&
        !data.network?.trim()
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["network"],
          message:
            "Network is required for crypto methods.",
        });
      }

      if (
        data.maximumAmount !== null &&
        data.maximumAmount !== undefined &&
        data.maximumAmount < data.minimumAmount
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["maximumAmount"],
          message:
            "Maximum amount must be greater than or equal to minimum amount.",
        });
      }

      if (!data.icon) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["icon"],
          message:
            "An icon is required.",
        });
      }
    }
  );

export const updateWithdrawalMethodSchema =
  withdrawalMethodBaseSchema.partial().superRefine(
    (data, context) => {
      if (
        data.type === "crypto" &&
        data.type !== undefined &&
        !data.network?.trim()
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["network"],
          message:
            "Network is required for crypto methods.",
        });
      }

      if (
        data.minimumAmount !== undefined &&
        data.maximumAmount !== undefined &&
        data.maximumAmount !== null &&
        data.maximumAmount < data.minimumAmount
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["maximumAmount"],
          message:
            "Maximum amount must be greater than or equal to minimum amount.",
        });
      }
    }
  );

export const reorderWithdrawalMethodsSchema =
  z.object({
    methods: z
      .array(
        z.object({
          id: z
            .string()
            .uuid(),

          displayOrder:
            z
              .number()
              .int(),
        })
      )
      .min(1),
  });

export const toggleWithdrawalMethodSchema =
  z.object({
    id: z
      .string()
      .uuid(),

    isActive:
      z.boolean(),
  });

export type WithdrawalMethodInput =
  z.infer<
    typeof withdrawalMethodSchema
  >;

export type UpdateWithdrawalMethodInput =
  z.infer<
    typeof updateWithdrawalMethodSchema
  >;

export type ReorderWithdrawalMethodsInput =
  z.infer<
    typeof reorderWithdrawalMethodsSchema
  >;

export type ToggleWithdrawalMethodInput =
  z.infer<
    typeof toggleWithdrawalMethodSchema
  >;