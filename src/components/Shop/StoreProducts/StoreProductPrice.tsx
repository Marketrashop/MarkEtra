import {
  STORE_PRODUCT_VARIANTS,
} from "./storeProducts.variants";

import type {
  StoreProductPriceProps,
} from "./storeProducts.types";

export default function StoreProductPrice({
  product,

  variant = "default",
}: StoreProductPriceProps) {
  const styles =
    STORE_PRODUCT_VARIANTS[
      variant
    ];

  const formatPrice = (
    price: number,
  ) => `$${price.toFixed(2)}`;

  return (
    <div
      className="
        mt-2

        inline-flex

        items-center

        gap-1.5
      "
    >
      {product.compareAtPrice !==
        null && (
        <span
          className={`
            ${styles.oldPrice}

            font-semibold

            leading-none

            line-through

            text-[#5658EC]
          `}
        >
          {formatPrice(
            product.compareAtPrice,
          )}
        </span>
      )}

      <span
        className={`
          ${styles.price}

          font-extrabold

          leading-none

          text-[#5658EC]
        `}
      >
        {formatPrice(
          product.price,
        )}
      </span>
    </div>
  );
}