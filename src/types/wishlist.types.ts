import type {
  ProductVariant,
  ProductVariantSize,
} from "@/lib/products/product.types";

export type Wishlist = {
  id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: Date;
  updatedAt: Date;
};

export type WishlistVariantSize =
  ProductVariantSize & {
    variant: Pick<
      ProductVariant,
      "id" | "type" | "label"
    > & {
      images: ProductVariant["images"];
    };
  };

export type WishlistProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  averageRating: number;
  totalRatings: number;
  featured: boolean;
  status: string;
  createdAt: Date;
  publishedAt: Date | null;
category:
  | {
      id: string;

      name: string;

      slug: string;
    }
  | null;
  images: {
    id: string;
    imageKey: string;
    imageUrl: string | null;
    altText: string | null;
    isPrimary: boolean;
    sortOrder: number;
  }[];
};

export type WishlistItem = {
  id: string;
  productId: string;
  variantSizeId: string | null;
  product: WishlistProduct;
  variantSize:
    | WishlistVariantSize
    | null;
  createdAt: Date;
};

export type AddToWishlistInput = {
  productId: string;
  variantSizeId?: string;
};

export type RemoveFromWishlistInput = {
  productId: string;
  variantSizeId?: string;
};

export type WishlistSummary = {
  itemCount: number;
};

export type WishlistResponse = {
  wishlist: Wishlist;
  summary: WishlistSummary;
};

export type WishlistActionResponse = {
  success: boolean;
  message: string;
};

export type WishlistStatusResponse = {
  success: boolean;
  inWishlist: boolean;
};

export type WishlistCountResponse = {
  success: boolean;
  count: number;
};

export type WishlistContextValue = {
  wishlist: Wishlist | null;
  summary: WishlistSummary;
  loading: boolean;
  error: string | null;

  refresh: () => Promise<void>;

  addItem: (
    input: AddToWishlistInput,
  ) => Promise<void>;

  removeItem: (
    productId: string,
    variantSizeId?: string,
  ) => Promise<void>;

  clear: () => Promise<void>;

  isInWishlist: (
    productId: string,
    variantSizeId?: string,
  ) => boolean;

  itemCount: number;
};