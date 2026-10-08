import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z
    .string()
    .min(1, "Product is required."),

  customerName: z
    .string()
    .trim()
    .min(2, "Customer name is required.")
    .max(100),

  rating: z
    .number()
    .int()
    .min(1, "Rating must be between 1 and 5.")
    .max(5, "Rating must be between 1 and 5."),

  title: z
    .string()
    .trim()
    .max(150)
    .optional()
    .or(z.literal("")),

  comment: z
    .string()
    .trim()
    .min(10, "Review is too short.")
    .max(2000, "Review is too long."),
});

export const updateReviewSchema = createReviewSchema
  .omit({
    productId: true,
    customerName: true,
  })
  .partial();

export type CreateReviewSchema = z.infer<
  typeof createReviewSchema
>;

export type UpdateReviewSchema = z.infer<
  typeof updateReviewSchema
>;