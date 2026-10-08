"use client";

import { useMemo } from "react";

import { useCartContext } from "@/context/CartContext";

export default function CartSummary() {
  const { cart } = useCartContext();

  const summary = useMemo(
    () => cart?.summary,
    [cart],
  );

  if (!summary) {
    return null;
  }

  return (
    <section
      className="space-y-1.5 rounded-xl p-2.5 sm:space-y-4 sm:rounded-2xl sm:p-4"
      style={{
        background:
          "var(--cart-summary-bg)",

        border:
          "1px solid var(--cart-summary-border)",
      }}
    >
      <div className="flex items-center justify-between text-[10px] sm:text-sm">
        <span
          style={{
            color:
              "var(--text-secondary)",
          }}
        >
          Items
        </span>

        <span className="font-medium">
          {summary.itemCount}
        </span>
      </div>

      <div className="flex items-center justify-between text-[10px] sm:text-sm">
        <span
          style={{
            color:
              "var(--text-secondary)",
          }}
        >
          Subtotal
        </span>

        <span className="font-medium">
          $
          {summary.subtotal.toLocaleString()}
        </span>
      </div>

      {summary.savings > 0 && (
        <div className="flex items-center justify-between text-[10px] sm:text-sm">
          <span
            style={{
              color:
                "var(--success)",
            }}
          >
            You Save
          </span>

          <span
            className="font-semibold"
            style={{
              color:
                "var(--success)",
            }}
          >
            − $
            {summary.savings.toLocaleString()}
          </span>
        </div>
      )}

      <div
        className="my-0.5"
        style={{
          borderTop:
            "1px solid var(--cart-divider)",
        }}
      />

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold sm:text-base">
          Total
        </span>

        <span className="text-[15px] font-bold tracking-tight sm:text-lg">
          $
          {summary.total.toLocaleString()}
        </span>
      </div>
    </section>
  );
}