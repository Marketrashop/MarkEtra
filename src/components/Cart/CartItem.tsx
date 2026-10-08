"use client";

import Image from "next/image";
import NavigationLink from "@/components/ui/Preloader/NavigationLink";

import { Heart, Loader2, Minus, Plus, Trash2 } from "lucide-react";

import { useState } from "react";

import { toast } from "sonner";

import { useCartContext } from "@/context/CartContext";

import type { CartItem as CartItemType } from "./cart.types";

import type {
  AppEnvironment,
} from "@/types/environment";

type CartItemProps = {
  item: CartItemType;
  environment?: AppEnvironment;
  onClose: () => void;
  showDivider?: boolean;
};

type CartItemAction =
  | "increase"
  | "decrease"
  | "save"
  | "remove"
  | null;

export default function CartItem({
  item,
  environment = "public",
  onClose,
  showDivider = true,
}: CartItemProps) {
  const {
    updateQuantity,
    removeFromCart,
    saveForLater,
  } = useCartContext();

  const [
    actionLoading,
    setActionLoading,
  ] = useState<CartItemAction>(
    null,
  );

  const price =
    item.variantSize.price ??
    item.product.price;

  const availableStock =
    Math.max(
      0,
      item.variantSize.stock -
        item.variantSize.reservedStock,
    );

  const stockLabel =
    availableStock <= 0
      ? "Out of stock"
      : availableStock <= 5
        ? `Only ${availableStock} left`
        : availableStock <= 10
          ? "Low stock"
          : "In stock";

  const stockClass =
    availableStock <= 0
      ? "text-red-500"
      : availableStock <= 5
        ? "text-orange-500"
        : availableStock <= 10
          ? "text-yellow-500"
          : "text-green-500";

const variantImage =
  item.variantSize.variant.imageKey
    ? {
        imageKey:
          item.variantSize.variant.imageKey,

        imageUrl:
          item.variantSize.variant.imageUrl,

        altText:
          item.variantSize.variant.label ??
          item.product.name,
      }
    : null;

const primaryImage =
  variantImage ??
  item.product.images.find(
    (image) =>
      image.isPrimary,
  ) ??
  item.product.images[0] ??
  null;

  const decrease =
    async () => {
      if (actionLoading) {
        return;
      }

      if (item.quantity === 1) {
        toast.info(
          "Quantity cannot be less than 1. Use Remove if you no longer want this item.",
        );

        return;
      }

      try {
        setActionLoading(
          "decrease",
        );

        await updateQuantity(
          item.id,
          item.quantity - 1,
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to decrease quantity.",
        );
      } finally {
        setActionLoading(
          null,
        );
      }
    };

  const increase =
    async () => {
      if (actionLoading) {
        return;
      }

      if (
        !item.variantSize
          .allowPreorder &&
        item.quantity >=
          availableStock
      ) {
        toast.info(
          `Only ${availableStock} ${
            availableStock === 1
              ? "item is"
              : "items are"
          } currently available in stock.`,
        );

        return;
      }

      try {
        setActionLoading(
          "increase",
        );

        await updateQuantity(
          item.id,
          item.quantity + 1,
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to increase quantity.",
        );
      } finally {
        setActionLoading(
          null,
        );
      }
    };

  const handleSaveForLater =
    async () => {
      if (actionLoading) {
        return;
      }

      try {
        setActionLoading(
          "save",
        );

        await saveForLater(
          item.id,
        );

        toast.success(
          "Item saved for later.",
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to save item for later.",
        );
      } finally {
        setActionLoading(
          null,
        );
      }
    };

  const handleRemove =
    async () => {
      if (actionLoading) {
        return;
      }

      try {
        setActionLoading(
          "remove",
        );

        await removeFromCart(
          item.id,
        );

        toast.success(
          "Item removed from cart.",
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to remove item.",
        );
      } finally {
        setActionLoading(
          null,
        );
      }
    };

  const isBusy =
    actionLoading !== null;

  return (
<article
  className="
    group
    py-2
    transition-colors
  "
  style={{
    transition:
      "var(--cart-transition)",
  }}
>
<div className="flex gap-2.5">
<NavigationLink
  href={
    environment === "user"
      ? `/Market-Place/${encodeURIComponent(
          item.product.slug,
        )}`
      : `/Product/${encodeURIComponent(
          item.product.slug,
        )}`
  }
  onClick={onClose}
  className="
    group
    relative
    block
    h-[56px]
    w-[56px]
    shrink-0
    overflow-hidden
    rounded-[10px]
  "
>
          <div
            className="absolute inset-0"
            style={{
              background:
                "var(--cart-image-bg)",
            }}
          >
            {primaryImage && (
              <Image
src={
  primaryImage.imageUrl ??
  "/assets/images/placeholder-product.jpg"
}
                alt={
                  primaryImage.altText ??
                  item.product.name
                }
                fill
                className="
                  object-cover
                  transition-transform
                  duration-200
                  group-hover:scale-[1.03]
                "
                sizes="74px"
              />
            )}
          </div>
        </NavigationLink>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
<NavigationLink
  href={
    environment === "user"
      ? `/Market-Place/${encodeURIComponent(
          item.product.slug,
        )}`
      : `/Product/${encodeURIComponent(
          item.product.slug,
        )}`
  }
  onClick={
    onClose
  }
  className="
    min-w-0
    truncate
    text-[11px]
    font-semibold
    transition-colors
    hover:text-[var(--primary)]
    leading-tight
  "
>
  {item.product.name}
</NavigationLink>

            <div className="shrink-0 text-right">
              {item.product.compareAtPrice !==
                null && (
                <span
                  className="
                    mr-1
                    text-[9px]
                    line-through
                    sm:text-[10px]
                  "
                  style={{
                    color:
                      "var(--text-secondary)",
                  }}
                >
                  $
                  {item.product.compareAtPrice.toLocaleString()}
                </span>
              )}

              <span className="text-[11px] font-semibold">
                $
                {price.toLocaleString()}
              </span>
            </div>
          </div>

          <div
            className="
              mt-px
              flex
              min-w-0
              flex-wrap
              items-center
              gap-x-2
              gap-y-0.5
              text-[10px]
              sm:text-[11px]
            "
            style={{
              color:
                "var(--text-secondary)",
            }}
          >
            {item.variantSize.variant
              .label && (
              <span className="truncate">
                {
                  item.variantSize
                    .variant.label
                }
              </span>
            )}

            {item.variantSize.size && (
              <span>
                {item.variantSize.size}
              </span>
            )}
          </div>

          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span
              className={`
                truncate
                text-[9px]
                font-medium
                sm:text-[10px]
                ${stockClass}
              `}
            >
              {stockLabel}
            </span>

            <div
              className="
                flex
                shrink-0
                items-center
                rounded-full
                px-0.5
                py-0.5
              "
              style={{
                background:
                  "var(--cart-quantity-bg)",

                border:
                  "1px solid var(--cart-quantity-border)",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  void decrease()
                }
                disabled={
                  item.quantity <= 1 ||
                  isBusy
                }
                className="
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  transition-opacity
                  hover:opacity-70
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                aria-label="Decrease quantity"
              >
                {actionLoading ===
                "decrease" ? (
                  <Loader2
                    size={12}
                    className="animate-spin"
                  />
                ) : (
                  <Minus size={12} />
                )}
              </button>

              <span className="min-w-5 text-center text-[11px] font-medium">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  void increase()
                }
                disabled={
                  isBusy ||
                  (!item.variantSize
                    .allowPreorder &&
                    item.quantity >=
                      availableStock)
                }
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  transition-opacity
                  hover:opacity-70
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                aria-label="Increase quantity"
              >
                {actionLoading ===
                "increase" ? (
                  <Loader2
                    size={12}
                    className="animate-spin"
                  />
                ) : (
                  <Plus size={12} />
                )}
              </button>
            </div>
          </div>

<div className="mt-1.5 flex items-center gap-3">
  <button
    type="button"
    onClick={() =>
      void handleSaveForLater()
    }
    disabled={isBusy}
    className="
      inline-flex
      items-center
      gap-1
      rounded-md
      px-0
      py-0
      text-[10px]
      font-medium
      transition-opacity
      hover:opacity-70
      disabled:cursor-not-allowed
      disabled:opacity-60
    "
    style={{
      background: "transparent",
      border: "none",
    }}
  >
    {actionLoading ===
    "save" ? (
      <Loader2
        size={11}
        className="animate-spin"
      />
    ) : (
      <Heart size={11} />
    )}

    {actionLoading ===
    "save"
      ? "Saving..."
      : "Save"}
  </button>

  <button
    type="button"
    onClick={() =>
      void handleRemove()
    }
    disabled={isBusy}
    className="
      inline-flex
      items-center
      gap-1
      rounded-md
      px-0
      py-0
      text-[10px]
      font-medium
      transition-opacity
      hover:opacity-70
      disabled:cursor-not-allowed
      disabled:opacity-60
    "
    style={{
      background: "transparent",
      border: "none",
    }}
  >
    {actionLoading ===
    "remove" ? (
      <Loader2
        size={11}
        className="animate-spin"
      />
    ) : (
      <Trash2 size={11} />
    )}

    {actionLoading ===
    "remove"
      ? "Removing..."
      : "Remove"}
  </button>
          </div>

          {showDivider && (
            <div
              className="mt-3 h-px"
              style={{
                background:
                  "var(--cart-divider)",
              }}
            />
          )}
        </div>
      </div>
    </article>
  );
}