"use client";

import type {
  ProductVariantSize,
} from "@/lib/products/product.types";

type ProductPriceProps = {
  price: number;

  oldPrice?: number;

  selectedInventory?: ProductVariantSize | null;
};

export default function ProductPrice({
  price,
  oldPrice,
  selectedInventory,
}: ProductPriceProps) {
  const activePrice =
    selectedInventory?.price ??
    price;

  const activeStock =
    selectedInventory
      ? Math.max(
          0,
          selectedInventory.stock -
            selectedInventory.reservedStock,
        )
      : null;

const hasDiscount =
  oldPrice !== undefined &&
  oldPrice !== null;

  return (
    <div
      className="
        mt-6
      "
    >
      <div
        className="
          flex
          flex-wrap
          items-end
          gap-3
        "
      >
        {hasDiscount && (
<span
className="
text-[17px]
font-semibold
text-[var(--foreground-muted)]
line-through
sm:text-[19px]
lg:text-[22px]
"
>
            ${oldPrice.toFixed(2)}
          </span>
        )}

<span
className="
text-[26px]
font-extrabold
leading-none
tracking-[-0.02em]
text-[var(--foreground)]
sm:text-[30px]
lg:text-[36px]
"
>
          ${activePrice.toFixed(2)}
        </span>

        {hasDiscount && (
          <span
            className="
              rounded-full
              bg-[var(--primary)]/10
px-2.5
py-1
text-[11px]
sm:px-3
sm:text-[13px]
              font-semibold
              text-[var(--primary)]
            "
          >
Save $
{oldPrice.toFixed(2)}
          </span>
        )}
      </div>

      {activeStock !== null && (
        <div
          className="
            mt-5
            flex
            flex-wrap
            items-center
            gap-3
          "
        >
          <span
            className={`
              rounded-lg
px-2.5
py-1
text-[11px]
sm:px-3
sm:py-1.5
sm:text-[13px]
              font-semibold
              ${
                activeStock > 20
                  ? `
                    bg-emerald-500/10
                    text-emerald-500
                  `
                  : activeStock > 0
                    ? `
                      bg-amber-500/10
                      text-amber-500
                    `
                    : `
                      bg-red-500/10
                      text-red-500
                    `
              }
            `}
          >
            {activeStock > 0
              ? `In Stock: ${activeStock}`
              : "Out of Stock"}
          </span>

          {activeStock > 0 &&
            activeStock <= 20 && (
              <span
                className="
text-[12px]
font-medium
sm:text-[14px]
                  text-[var(--foreground-muted)]
                "
              >
                Hurry up! Only{" "}
                <span
                  className="
                    font-bold
                    text-[var(--primary)]
                  "
                >
                  {activeStock}
                </span>{" "}
                items left.
              </span>
            )}
        </div>
      )}
    </div>
  );
}