"use client";

import NavigationLink from "@/components/ui/Preloader/NavigationLink";

import {
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

type EmptyCartProps = {
  hasSavedItems?: boolean;

  continueShoppingHref?: string;

  onContinueShopping?: () => void;
};

export default function EmptyCart({
  hasSavedItems = false,
  continueShoppingHref = "/Shop",
  onContinueShopping,
}: EmptyCartProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
        style={{
          background:
            "var(--cart-summary-bg)",

          border:
            "1px solid var(--cart-border)",
        }}
      >
        <ShoppingBag size={32} />
      </div>

      <h2 className="text-lg font-semibold tracking-tight">
        Your cart is empty
      </h2>

      <p
        className="mt-2 max-w-xs text-sm leading-6"
        style={{
          color:
            "var(--text-secondary)",
        }}
      >
        Browse our latest collection and add pieces you love. They'll appear here when you're ready to check out.
      </p>

<NavigationLink
  href={continueShoppingHref}
  onClick={onContinueShopping}
  className="mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all hover:scale-[1.02]"
  style={{
    background:
      "var(--cart-button-primary-bg)",

    color:
      "var(--button-primary-foreground)",
  }}
>
  Continue Shopping

  <ArrowRight size={16} />
</NavigationLink>

      {hasSavedItems && (
        <div
          className="mt-10 w-full rounded-2xl p-4"
          style={{
            background:
              "var(--cart-saved-bg)",

            border:
              "1px solid var(--cart-saved-border)",
          }}
        >
          <p
            className="text-sm"
            style={{
              color:
                "var(--text-secondary)",
            }}
          >
            You still have products saved for later below.
          </p>
        </div>
      )}
    </div>
  );
}