"use client";

import Image from "next/image";

import {
  useState,
} from "react";

import {
  Loader2,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import { useCartContext } from "@/context/CartContext";

import type {
  CartItem,
} from "./cart.types";

type SavedForLaterProps = {
  items: CartItem[];
};

export default function SavedForLater({
  items,
}: SavedForLaterProps) {
  const {
    moveToCart,
    removeFromCart,
  } = useCartContext();

  const [
    actionLoading,
    setActionLoading,
  ] = useState<{
    itemId: string;
    action:
      | "move"
      | "remove";
  } | null>(null);

  async function handleMoveToCart(
    item: CartItem,
  ) {
    if (actionLoading) {
      return;
    }

    try {
      setActionLoading({
        itemId: item.id,
        action: "move",
      });

      await moveToCart(
        item.id,
      );

      toast.success(
        "Item moved to cart.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to move item to cart.",
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRemove(
    item: CartItem,
  ) {
    if (actionLoading) {
      return;
    }

    try {
      setActionLoading({
        itemId: item.id,
        action: "remove",
      });

      await removeFromCart(
        item.id,
      );

      toast.success(
        "Item removed from saved items.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to remove item.",
      );
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <section className="space-y-3">
      <div className="px-1">

        <p
          className="
            mt-0.5
            text-[10px]
            sm:text-[11px]
          "
          style={{
            color:
              "var(--text-secondary)",
          }}
        >
          {items.length}{" "}
          {items.length === 1
            ? "item"
            : "items"}{" "}
          waiting for you.
        </p>
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const price =
            item.variantSize.price ??
            item.product.price;

const primaryImage =
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
    : item.product.images.find(
        (image) =>
          image.isPrimary,
      ) ??
      item.product.images[0] ??
      null;

          const moving =
            actionLoading?.itemId ===
              item.id &&
            actionLoading.action ===
              "move";

          const removing =
            actionLoading?.itemId ===
              item.id &&
            actionLoading.action ===
              "remove";

          return (
            <article
              key={item.id}
              className="
                rounded-[14px]
                p-2
                sm:p-2.5
              "
              style={{
                background:
                  "var(--cart-saved-bg)",

                border:
                  "1px solid var(--cart-saved-border)",
              }}
            >
              <div className="flex gap-2.5">
                <div
                  className="
                    relative
                    h-14
                    w-14
                    shrink-0
                    overflow-hidden
                    rounded-[10px]
                    sm:h-16
                    sm:w-16
                  "
                  style={{
                    background:
                      "var(--cart-image-bg)",
                  }}
                >
                  {primaryImage && (
                    <Image
                      src={
                        primaryImage.imageUrl ??
                        `/api/image/${primaryImage.imageKey}`
                      }
                      alt={
                        primaryImage.altText ??
                        item.product.name
                      }
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      className="
                        min-w-0
                        truncate
                        text-[11px]
                        font-medium
                        sm:text-xs
                      "
                    >
                      {item.product.name}
                    </h4>

                    <span className="shrink-0 text-[11px] font-semibold sm:text-xs">
                      $
                      {price.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      disabled={
                        actionLoading !==
                        null
                      }
                      onClick={() =>
                        void handleMoveToCart(
                          item,
                        )
                      }
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-md
                        px-2
                        py-1.5
                        text-[9px]
                        font-medium
                        transition-all
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        sm:text-[10px]
                      "
                      style={{
                        background:
                          "var(--cart-button-primary-bg)",

                        color:
                          "var(--button-primary-foreground)",
                      }}
                    >
                      {moving ? (
                        <Loader2
                          size={11}
                          className="animate-spin"
                        />
                      ) : (
                        <ShoppingCart
                          size={11}
                        />
                      )}

                      {moving
                        ? "Moving..."
                        : "Move to Cart"}
                    </button>

                    <button
                      type="button"
                      disabled={
                        actionLoading !==
                        null
                      }
                      onClick={() =>
                        void handleRemove(
                          item,
                        )
                      }
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-md
                        px-2
                        py-1.5
                        text-[9px]
                        font-medium
                        transition-all
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        sm:text-[10px]
                      "
                      style={{
                        background:
                          "var(--cart-danger-bg)",

                        border:
                          "1px solid var(--cart-border)",
                      }}
                    >
                      {removing ? (
                        <Loader2
                          size={11}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2
                          size={11}
                        />
                      )}

                      {removing
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}