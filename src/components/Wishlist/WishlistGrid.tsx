"use client";

import WishlistItem from "./WishlistItem";
import EmptyWishlist from "./EmptyWishlist";

import type {
  WishlistItem as WishlistItemType,
} from "@/types/wishlist.types";

type WishlistGridProps = {
  items: WishlistItemType[];

  loading?: boolean;

  onRemove: (
    productId: string,
  ) => void;

  onAddToCart?: (
    productId: string,
  ) => void;
};

export default function WishlistGrid({
  items,
  loading = false,
  onRemove,
  onAddToCart,
}: WishlistGridProps) {
  if (
    !loading &&
    items.length === 0
  ) {
    return <EmptyWishlist />;
  }

  return (
    <section
      aria-label="Wishlist products"
      className="
        grid
        w-full
        max-w-2xl
        grid-cols-2
        gap-2
        sm:gap-3
        xl:grid-cols-3
      "
    >
      {items.map((item) => (
        <WishlistItem
          key={item.id}
          item={item}
          loading={loading}
          onRemove={onRemove}
          onAddToCart={
            onAddToCart
          }
        />
      ))}
    </section>
  );
}