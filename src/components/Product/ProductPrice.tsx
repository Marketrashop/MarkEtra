"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  ProductVariantSize,
} from "@/lib/products/product.types";

type ProductPriceProps = {
  price: number;

  oldPrice?: number;

  selectedInventory?: ProductVariantSize | null;

  animateOnMount?: boolean;
};

function RollingAmount({
  amount,
  animate,
}: {
  amount: string;
  animate: boolean;
}) {
  const characters = Array.from(amount);

  const digitCount = characters.filter(
    (character) => /\d/.test(character),
  ).length;

  let digitsToRight = 0;

  const digitDelays = characters.map(
    (character) => {
      if (!/\d/.test(character)) {
        return null;
      }

      const delay = digitsToRight * 65;

      digitsToRight += 1;

      return delay;
    },
  );

  return (
    <span
      className="
        inline-flex
        items-baseline
        whitespace-nowrap
        tabular-nums
      "
    >
      <span>$</span>

      {characters.map(
        (character, index) => {
          if (!/\d/.test(character)) {
            return (
              <span key={`${character}-${index}`}>
                {character}
              </span>
            );
          }

          const digit = Number(character);

          const delay =
            digitDelays[index] ?? 0;

          return (
            <span
              key={`digit-${index}`}
              className="
                relative
                inline-block
                h-[1em]
                overflow-hidden
                align-bottom
              "
              aria-hidden="true"
            >
              <span
                className="
                  flex
                  flex-col
                  will-change-transform
                "
                style={{
                  transform: animate
                    ? `translateY(-${digit}em)`
                    : "translateY(0)",
                  transition: animate
                    ? `transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
                    : "none",
                }}
              >
                {Array.from(
                  { length: 10 },
                  (_, number) => (
                    <span
                      key={number}
                      className="
                        block
                        h-[1em]
                        leading-[1em]
                      "
                    >
                      {number}
                    </span>
                  ),
                )}
              </span>
            </span>
          );
        },
      )}
    </span>
  );
}

export default function ProductPrice({
  price,
  oldPrice,
  selectedInventory,
  animateOnMount = false,
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

  const formattedPrice =
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(activePrice);

  const [
    animationStarted,
    setAnimationStarted,
  ] = useState(false);

  useEffect(() => {
    if (!animateOnMount) {
      return;
    }

    setAnimationStarted(true);
  }, [animateOnMount]);

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
          aria-label={`$${formattedPrice}`}
        >
          {animateOnMount ? (
            <RollingAmount
              amount={formattedPrice}
              animate={animationStarted}
            />
          ) : (
            `$${formattedPrice}`
          )}
        </span>

        {hasDiscount && (
          <span
            className="
              rounded-full
              bg-[var(--primary)]/10
              px-2.5
              py-1
              text-[11px]
              font-semibold
              text-[var(--primary)]
              sm:px-3
              sm:text-[13px]
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
              font-semibold
              sm:px-3
              sm:py-1.5
              sm:text-[13px]
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
                  text-[var(--foreground-muted)]
                  sm:text-[14px]
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