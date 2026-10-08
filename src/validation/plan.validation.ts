import { z } from "zod";

export const createPlanSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100),

    slug: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .regex(
        /^[a-z0-9-]+$/,
        "Slug may only contain lowercase letters, numbers, and hyphens.",
      ),

    description: z
      .string()
      .trim()
      .max(1000)
      .optional(),

    price: z
      .number()
      .positive(),

    commissionRate: z
      .number()
      .min(0)
      .max(100),

    maxPublishedProducts: z
      .number()
      .int()
      .positive(),

    priorityLevel: z
      .number()
      .int()
      .min(1),

    badgeName: z
      .string()
      .trim()
      .min(2)
      .max(50),

    badgeColor: z
      .string()
      .trim()
      .min(2)
      .max(50),

    durationInDays: z
      .number()
      .int()
      .positive(),

    isActive:
      z.boolean(),

    sortOrder: z
      .number()
      .int()
      .min(0),
  });

export const updatePlanSchema =
  createPlanSchema.partial();

export type CreatePlanValues =
  z.infer<
    typeof createPlanSchema
  >;

export type UpdatePlanValues =
  z.infer<
    typeof updatePlanSchema
  >;