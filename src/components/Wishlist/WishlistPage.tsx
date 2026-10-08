"use client";

import { toast } from "sonner";

import WishlistGrid from "./WishlistGrid";

import { useWishlist } from "@/context/WishlistContext";

import { useCartContext } from "@/context/CartContext";

export default function WishlistPage() {
  const {
    wishlist,
    loading,
    removeFromWishlist,
  } = useWishlist();

  const {
    addToCart,
  } = useCartContext();

  const items =
    wishlist?.items ?? [];

  async function handleRemove(
    productId: string,
    variantSizeId?: string,
  ) {
    try {
      await removeFromWishlist(
        productId,
        variantSizeId,
      );

      toast.success(
        "Removed from wishlist.",
      );
    } catch {
      toast.error(
        "Unable to remove item.",
      );
    }
  }

  async function handleAddToCart(
    productId: string,
    variantSizeId?: string,
  ) {
    if (!variantSizeId) {
      toast.error(
        "This wishlist item has no selected product option.",
      );

      return;
    }

    try {
      await addToCart({
        productId,
        variantSizeId,
        quantity: 1,
      });

      await removeFromWishlist(
        productId,
        variantSizeId,
      );

      toast.success(
        "Added to cart.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add item to cart.",
      );
    }
  }

  return (
    <section
      className="
        space-y-3
        pb-20
        sm:space-y-5
        sm:pb-28
      "
    >
      <header
        className="
          flex
          items-center
          justify-between
          gap-3
          sm:gap-4
        "
      >
        <div className="min-w-0">
          <h1
            className="
              text-[18px]
              font-bold
              text-[var(--user-title)]
              sm:text-xl
            "
          >
            Wishlist
          </h1>

          <p
            className="
              mt-0.5
              text-[10px]
              text-[var(--user-text-muted)]
              sm:mt-1
              sm:text-sm
            "
          >
            {items.length}
            {" "}
            saved
            {items.length === 1
              ? " item"
              : " items"}
          </p>
        </div>
      </header>

      <WishlistGrid
        items={items}
        loading={loading}
        onRemove={
          handleRemove
        }
        onAddToCart={
          handleAddToCart
        }
      />
    </section>
  );
}