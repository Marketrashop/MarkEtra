"use client";

import Image from "next/image";

import NavigationLink from "@/components/ui/Preloader/NavigationLink";

import { useState } from "react";

import {
  Heart,
  Loader2,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import type {
  WishlistItem as WishlistItemType,
} from "@/types/wishlist.types";

type WishlistItemProps = {
  item: WishlistItemType;

  onRemove: (
    productId: string,
    variantSizeId?: string,
  ) => void | Promise<void>;

  onAddToCart?: (
    productId: string,
    variantSizeId?: string,
  ) => void | Promise<void>;

  loading?: boolean;
};

export default function WishlistItem({
  item,
  onRemove,
  onAddToCart,
  loading = false,
}: WishlistItemProps) {
  const {
    product,
    variantSize,
  } = item;

  const [
    actionLoading,
    setActionLoading,
  ] = useState<
    "cart" | "remove" | null
  >(null);

  const primaryImage =
    variantSize?.variant.images.find(
      (image) => image.isPrimary,
    ) ??
    variantSize?.variant.images[0] ??
    product.images.find(
      (image) => image.isPrimary,
    ) ??
    product.images[0] ??
    null;

  const availableStock =
    variantSize
      ? Math.max(
          0,
          variantSize.stock -
            variantSize.reservedStock,
        )
      : 0;

  const inStock =
    variantSize
      ? availableStock > 0 ||
        variantSize.allowPreorder
      : true;

  async function handleAddToCart() {
    if (
      !onAddToCart ||
      actionLoading
    ) {
      return;
    }

    try {
      setActionLoading("cart");

      await onAddToCart(
        product.id,
        variantSize?.id ??
          undefined,
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRemove() {
    if (actionLoading) {
      return;
    }

    try {
      setActionLoading("remove");

      await onRemove(
        product.id,
        variantSize?.id ??
          undefined,
      );
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <article
      className="
        overflow-hidden
        rounded-lg
        border
        border-[var(--user-card-border)]
        bg-[var(--user-card-bg)]
        shadow-[var(--user-card-shadow)]
        transition-all
        duration-[var(--user-transition)]
        sm:rounded-[var(--user-radius-md)]
      "
    >
      <div
        className="
          relative
          aspect-square
          overflow-hidden
          bg-[var(--user-surface-secondary)]
        "
      >
        <NavigationLink
          href={`/Market-Place/${product.slug}`}
          className="
            absolute
            inset-0
          "
        >
          {primaryImage ? (
            <Image
              src={
                primaryImage.imageUrl ??
                `/api/image/${primaryImage.imageKey}`
              }
              alt={
                primaryImage.altText ??
                product.name
              }
              fill
              sizes="
                (max-width:768px) 50vw,
                240px
              "
              className="
                object-cover
                transition-transform
                duration-[var(--user-transition)]
                hover:scale-105
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                items-center
                justify-center
                px-3
                text-center
                text-[10px]
                text-[var(--user-text-muted)]
                sm:px-4
                sm:text-xs
              "
            >
              No image available
            </div>
          )}
        </NavigationLink>

        <button
          type="button"
          aria-label="Add to cart"
          disabled={
            loading ||
            !inStock ||
            actionLoading !== null
          }
          onClick={
            handleAddToCart
          }
          className="
            absolute
            right-2
            top-2
            z-10
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            border
            border-[var(--user-card-border)]
            bg-[var(--user-card-bg)]
            text-[var(--user-title)]
            shadow-sm
            backdrop-blur-md
            transition-all
            duration-[var(--user-transition)]
            hover:scale-105
            hover:bg-[var(--user-hover)]
            disabled:cursor-not-allowed
            disabled:opacity-50
            sm:right-2.5
            sm:top-2.5
            sm:h-8
            sm:w-8
          "
        >
          {actionLoading === "cart" ? (
            <Loader2
              size={11}
              className="
                animate-spin
                sm:hidden
              "
            />
          ) : (
            <ShoppingCart
              size={11}
              className="sm:hidden"
            />
          )}

          {actionLoading === "cart" ? (
            <Loader2
              size={12}
              className="
                hidden
                animate-spin
                sm:block
              "
            />
          ) : (
            <ShoppingCart
              size={12}
              className="hidden sm:block"
            />
          )}
        </button>

        <button
          type="button"
          aria-label="Remove from wishlist"
          disabled={
            loading ||
            actionLoading !== null
          }
          onClick={
            handleRemove
          }
          className="
            absolute
            bottom-2
            right-2
            z-10
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            border
            border-red-500
            bg-red-500
            text-white
            shadow-md
            transition-all
            duration-[var(--user-transition)]
            hover:scale-105
            hover:border-red-600
            hover:bg-red-600
            disabled:cursor-not-allowed
            disabled:opacity-50
            sm:bottom-2.5
            sm:right-2.5
            sm:h-8
            sm:w-8
          "
        >
          {actionLoading === "remove" ? (
            <Loader2
              size={11}
              className="
                animate-spin
                sm:hidden
              "
            />
          ) : (
            <Trash2
              size={11}
              className="sm:hidden"
            />
          )}

          {actionLoading === "remove" ? (
            <Loader2
              size={12}
              className="
                hidden
                animate-spin
                sm:block
              "
            />
          ) : (
            <Trash2
              size={12}
              className="hidden sm:block"
            />
          )}
        </button>
      </div>

      <div
        className="
          flex
          flex-col
          gap-1
          p-2
          sm:gap-1.5
          sm:p-2.5
        "
      >
        <NavigationLink
          href={`/Market-Place/${product.slug}`}
        >
          <h3
            className="
              line-clamp-2
              text-[11px]
              font-semibold
              leading-4
              text-[var(--user-title)]
              transition-colors
              duration-[var(--user-transition)]
              hover:text-[var(--user-link-hover)]
              sm:text-[12px]
            "
          >
            {product.name}
          </h3>
        </NavigationLink>

        <div
          className="
            flex
            items-center
            justify-between
            gap-1.5
            sm:gap-2
          "
        >
          <div className="min-w-0">
            {product.compareAtPrice && (
              <p
                className="
                  text-[9px]
                  leading-3
                  text-[var(--user-text-muted)]
                  line-through
                  sm:text-[10px]
                  sm:leading-3.5
                "
              >
                $
                {product.compareAtPrice.toFixed(
                  2,
                )}
              </p>
            )}

            <p
              className="
                text-[12px]
                font-bold
                leading-4
                text-[var(--user-title)]
                sm:text-[13px]
              "
            >
              $
              {(
                variantSize?.price ??
                product.price
              ).toFixed(2)}
            </p>
          </div>

          <span
            className={`
              shrink-0
              rounded-full
              px-1.5
              py-0.5
              text-[8px]
              font-semibold
              leading-3
              sm:px-2
              sm:text-[9px]
              sm:leading-3.5
              ${
                inStock
                  ? `
                    bg-[var(--user-badge-success-bg)]
                    text-[var(--user-badge-success-text)]
                  `
                  : `
                    bg-[var(--user-badge-danger-bg)]
                    text-[var(--user-badge-danger-text)]
                  `
              }
            `}
          >
            {inStock
              ? "In Stock"
              : "Out of Stock"}
          </span>
        </div>

        <div
          className="
            flex
            items-center
            gap-1
            text-[8px]
            leading-3
            text-[var(--user-text-muted)]
            sm:gap-1.5
            sm:text-[9px]
          "
        >
          <Heart
            size={9}
            fill="currentColor"
            className="sm:h-[10px] sm:w-[10px]"
          />

          Saved to wishlist
        </div>
      </div>
    </article>
  );
}