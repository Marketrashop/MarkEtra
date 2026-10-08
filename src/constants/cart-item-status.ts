export const CART_ITEM_STATUSES = [
  "CART",
  "SAVED_FOR_LATER",
] as const;

export type CartItemStatus =
  (typeof CART_ITEM_STATUSES)[number];