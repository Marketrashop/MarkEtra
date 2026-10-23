
import { z } from "zod";

const optionalPositiveAmount = z
  .union([
    z.number().finite().nonnegative(),
    z.literal(""),
    z.null(),
  ])
  .optional()
  .transform((value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    return value;
  });

const optionalPositiveInteger = z
  .union([
    z.number().int().positive(),
    z.literal(""),
    z.null(),
  ])
  .optional()
  .transform((value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    return value;
  });

// Update-specific validators preserve omitted fields as undefined.
const updateOptionalPositiveAmount = z
  .union([
    z.number().finite().nonnegative(),
    z.literal(""),
    z.null(),
  ])
  .optional()
  .transform((value) => {
    if (value === undefined) return undefined;
    if (value === "" || value === null) return null;
    return value;
  });

const updateOptionalPositiveInteger = z
  .union([
    z.number().int().positive(),
    z.literal(""),
    z.null(),
  ])
  .optional()
  .transform((value) => {
    if (value === undefined) return undefined;
    if (value === "" || value === null) return null;
    return value;
  });

const updateOptionalDate = z
  .string()
  .datetime({ offset: true })
  .optional()
  .nullable()
  .transform((value) => {
    if (value === undefined) return undefined;
    return value ? new Date(value) : null;
  });

export const createPromoCodeSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3, "Promo code must contain at least 3 characters.")
      .max(50, "Promo code cannot exceed 50 characters.")
      .regex(
        /^[A-Za-z0-9_-]+$/,
        "Use only letters, numbers, hyphens, and underscores.",
      )
      .transform((value) => value.toUpperCase()),

    description: z
      .string()
      .trim()
      .max(500)
      .optional()
      .nullable()
      .transform((value) => value || null),

    discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),

    discountValue: z
      .number()
      .finite()
      .positive("Discount must be greater than zero."),

    minimumSubtotal: optionalPositiveAmount,
    maximumDiscount: optionalPositiveAmount,

    startsAt: z
      .string()
      .datetime({ offset: true })
      .optional()
      .nullable()
      .transform((value) => (value ? new Date(value) : null)),

    expiresAt: z
      .string()
      .datetime({ offset: true })
      .optional()
      .nullable()
      .transform((value) => (value ? new Date(value) : null)),

    isActive: z.boolean().default(true),

    usageLimit: optionalPositiveInteger,
    perUserLimit: optionalPositiveInteger,
  })
  .superRefine((value, ctx) => {
    if (
      value.discountType === "PERCENTAGE" &&
      value.discountValue > 100
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "Percentage discount cannot exceed 100%.",
      });
    }

    if (
      value.discountType === "FIXED_AMOUNT" &&
      value.maximumDiscount !== null
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["maximumDiscount"],
        message:
          "Maximum discount is only applicable to percentage discounts.",
      });
    }

    if (
      value.startsAt &&
      value.expiresAt &&
      value.expiresAt <= value.startsAt
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["expiresAt"],
        message: "Expiry must be later than the start date.",
      });
    }
  });

export const updatePromoCodeSchema = z
  .object({
    description: z
      .string()
      .trim()
      .max(500)
      .optional()
      .nullable()
      .transform((value) => {
        if (value === undefined) return undefined;
        return value || null;
      }),

    discountType: z
      .enum(["PERCENTAGE", "FIXED_AMOUNT"])
      .optional(),

    discountValue: z
      .number()
      .finite()
      .positive()
      .optional(),

    minimumSubtotal: updateOptionalPositiveAmount,
    maximumDiscount: updateOptionalPositiveAmount,

    startsAt: updateOptionalDate,
    expiresAt: updateOptionalDate,

    isActive: z.boolean().optional(),

    usageLimit: updateOptionalPositiveInteger,
    perUserLimit: updateOptionalPositiveInteger,
  })
  .superRefine((value, ctx) => {
    if (
      value.discountType === "PERCENTAGE" &&
      value.discountValue !== undefined &&
      value.discountValue > 100
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "Percentage discount cannot exceed 100%.",
      });
    }

    if (
      value.discountType === "FIXED_AMOUNT" &&
      value.maximumDiscount !== undefined &&
      value.maximumDiscount !== null
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["maximumDiscount"],
        message:
          "Maximum discount is only applicable to percentage discounts.",
      });
    }

    if (
      value.startsAt &&
      value.expiresAt &&
      value.expiresAt <= value.startsAt
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["expiresAt"],
        message: "Expiry must be later than the start date.",
      });
    }
  });
