import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name is required.")
    .max(100, "Category name is too long."),

  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(120)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens."
    ),

  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal("")),

  imageKey: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  isActive: z.boolean().default(true),

  sortOrder: z
    .number()
    .int()
    .min(0)
    .default(0),
});

export const updateCategorySchema =
  createCategorySchema.partial();

export type CreateCategorySchema = z.infer<
  typeof createCategorySchema
>;

export type UpdateCategorySchema = z.infer<
  typeof updateCategorySchema
>;