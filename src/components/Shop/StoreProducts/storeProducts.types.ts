import type {
  ProductCard,
} from "@/lib/products/product.types";

import type {
  AppEnvironment,
} from "@/types/environment";

export type StoreProductVariant =
  | "default"
  | "compact";

export type StoreProduct =
  ProductCard;

export type StoreProductsProps = {
  products: StoreProduct[];

  environment?: AppEnvironment;

  variant?: StoreProductVariant;

  showHeading?: boolean;

  useContainer?: boolean;

  gridClassName?: string;

  eyebrow?: string;

  title?: string;

  subtitle?: string;

  sectionClassName?: string;
};

export type StoreProductCardProps = {
  product: StoreProduct;

  environment?: AppEnvironment;

  variant?: StoreProductVariant;
};

export type StoreProductImageProps = {
  product: ProductCard;
  environment?: AppEnvironment;
  variant?: StoreProductVariant;
};

export type StoreProductActionsProps = {
  product: StoreProduct;

  variant?: StoreProductVariant;
};

export type StoreProductBadgeProps = {
  product: StoreProduct;

  variant?: StoreProductVariant;
};

export type StoreProductRatingProps = {
  product: StoreProduct;

  variant?: StoreProductVariant;
};

export type StoreProductPriceProps = {
  product: StoreProduct;

  variant?: StoreProductVariant;
};