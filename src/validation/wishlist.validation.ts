import { z } from "zod";

export const addToWishlistSchema = z.object({
  productId: z
    .string()
    .min(1, "Product is required."),

  variantId: z
    .string()
    .optional()
    .nullable(),
});

export const wishlistItemActionSchema = z.object({
  itemId: z
    .string()
    .min(1, "Wishlist item is required."),
});

export const moveWishlistItemSchema = z.object({
  itemId: z
    .string()
    .min(1, "Wishlist item is required."),
});

export type AddToWishlistSchema = z.infer<
  typeof addToWishlistSchema
>;

export type WishlistItemActionSchema = z.infer<
  typeof wishlistItemActionSchema
>;

export type MoveWishlistItemSchema = z.infer<
  typeof moveWishlistItemSchema
>;