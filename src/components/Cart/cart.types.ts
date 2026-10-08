import type {
  ProductCard,
  ProductVariant,
  ProductVariantSize,
} from "@/lib/products/product.types";

export type CartItemStatus =
  | "CART"
  | "SAVED_FOR_LATER";

export type Cart = {
  id: string;

  userId: string;

  items: CartItem[];

  savedItems: CartItem[];

  summary: CartSummary;

  createdAt: Date;

  updatedAt: Date;
};

export type CartVariantSize =
  ProductVariantSize & {

variant: Pick<
  ProductVariant,
  "id" | "type" | "label"
> & {
  imageKey: string | null;

  imageUrl: string | null;
};

  };

export type CartItem = {
  id: string;

  productId: string;

  variantSizeId: string;

  quantity: number;

  status: CartItemStatus;

  product: ProductCard;

  variantSize: CartVariantSize;

  createdAt: Date;

  updatedAt: Date;
};

export type AddToCartInput = {
  productId: string;

  variantSizeId: string;

  quantity?: number;
};

export type UpdateCartItemInput = {
  cartItemId: string;

  quantity: number;
};

export type RemoveCartItemInput = {
  cartItemId: string;
};

export type MoveToSavedForLaterInput = {
  cartItemId: string;
};

export type MoveToCartInput = {
  cartItemId: string;
};

export type CartSummary = {
  itemCount: number;

  savedCount: number;

  subtotal: number;

  savings: number;

  total: number;
};

export type CartResponse = {
  cart: Cart;

  summary: CartSummary;
};

export type CartActionResponse = {
  success: boolean;

  message: string;
};

export type CartCountResponse = {
  success: boolean;

  count: number;
};