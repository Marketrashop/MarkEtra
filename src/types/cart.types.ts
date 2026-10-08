export type Cart = {
  id: string;

  userId: string;

  items: CartItem[];

  createdAt: Date;
  updatedAt: Date;
};

export type CartItem = {
  id: string;

  productId: string;

  variantId: string | null;

  quantity: number;

  status: CartItemStatus;

  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    stock: number;
    featured: boolean;
    primaryImage: string | null;
  };

  variant: {
    id: string;
    color: string | null;
    size: string | null;
    price: number | null;
    stock: number | null;
  } | null;

  createdAt: Date;
  updatedAt: Date;
};

export type AddToCartInput = {
  productId: string;

  variantId?: string;

  quantity?: number;
};

export type UpdateCartItemInput = {
  quantity: number;
};

export type CartSummary = {
  itemCount: number;

  subtotal: number;

  savings: number;

  total: number;
};

export type CartResponse = {
  cart: Cart;

  summary: CartSummary;
};

export type CartAction =
  | "increase"
  | "decrease"
  | "remove"
  | "saveForLater"
  | "moveToCart";

export type CartItemStatus = "CART" | "SAVED_FOR_LATER";