import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z
    .string()
    .min(1, "Product is required."),

  variantSizeId: z
    .string()
    .min(
      1,
      "Product inventory is required.",
    ),

  quantity: z
    .number()
    .int()
    .min(
      1,
      "Quantity must be at least 1.",
    )
    .max(
      99,
      "Quantity cannot exceed 99.",
    )
    .default(1),
});

export const updateCartItemSchema =
  z.object({
    quantity: z
      .number()
      .int()
      .min(
        1,
        "Quantity must be at least 1.",
      )
      .max(
        99,
        "Quantity cannot exceed 99.",
      ),
  });

export const cartItemActionSchema =
  z.object({
    itemId: z
      .string()
      .min(
        1,
        "Cart item is required.",
      ),
  });

export const moveCartItemSchema =
  z.object({
    itemId: z
      .string()
      .min(
        1,
        "Cart item is required.",
      ),
  });

export type AddToCartSchema =
  z.infer<
    typeof addToCartSchema
  >;

export type UpdateCartItemSchema =
  z.infer<
    typeof updateCartItemSchema
  >;

export type CartItemActionSchema =
  z.infer<
    typeof cartItemActionSchema
  >;

export type MoveCartItemSchema =
  z.infer<
    typeof moveCartItemSchema
  >;