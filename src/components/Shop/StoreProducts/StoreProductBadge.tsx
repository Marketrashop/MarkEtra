import type {
  ProductCard,
} from "@/lib/products/product.types";

import {
  STORE_BADGE_RADIUS,
} from "./storeProducts.constants";

import {
  STORE_PRODUCT_VARIANTS,
} from "./storeProducts.variants";

type StoreProductBadgeProps = {
  product: ProductCard;

  variant?: "default" | "compact";
};

export default function StoreProductBadge({
  product,

  variant = "default",
}: StoreProductBadgeProps) {
  const styles =
    STORE_PRODUCT_VARIANTS[
      variant
    ];

console.log({
  price: product.price,
  compareAtPrice: product.compareAtPrice,
});

const hasDiscount =
  product.compareAtPrice !== null &&
  product.compareAtPrice > 0;

  if (!hasDiscount) {
    return null;
  }

const originalPrice =
  product.price +
  product.compareAtPrice!;

const discount =
  (
    (product.compareAtPrice! /
      originalPrice) *
    100
  )
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(/(\.\d)0$/, "$1");

  return (
    <span
      className="
        absolute
        z-30
        inline-flex
        items-center
        justify-center
        px-2.5
        font-bold
        leading-none
        tracking-[-0.01em]
        text-white
        shadow-md
      "
      style={{
        top:
          styles.badge.top,

        right:
          styles.badge.right,

        minWidth:
          styles.badge.minWidth,

        height:
          styles.badge.height,

        fontSize:
          styles.badge.fontSize,

        borderRadius:
          STORE_BADGE_RADIUS,

        background: "#ea1414",
      }}
    >
     🔥 -{discount}%
    </span>
  );
}