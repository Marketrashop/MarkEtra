"use client";

import { ShoppingBag } from "lucide-react";

import { useCartContext } from "@/context/CartContext";

export default function CartHeader() {
  const { itemCount } = useCartContext();

  return (
<header
  className="flex shrink-0 items-center justify-between px-5 py-5"
  style={{
    borderBottom:
      "1px solid var(--cart-divider)",
  }}
>
  <div className="flex items-center gap-3">
    <div
      className="flex h-10 w-10 items-center justify-center rounded-full"
      style={{
        background:
          "var(--cart-summary-bg)",

        border:
          "1px solid var(--cart-border)",
      }}
    >
      <ShoppingBag size={18} />
    </div>

    <div className="space-y-0.5">
      <h2 className="text-sm font-semibold tracking-tight">
        Shopping Cart
      </h2>

      <p
        className="text-xs"
        style={{
          color:
            "var(--text-secondary)",
        }}
      >
        {itemCount}{" "}
        {itemCount === 1
          ? "item"
          : "items"}{" "}
        ready for purchase
      </p>
    </div>
  </div>
</header>
  );
}