"use client";

import CartSummary from "./CartSummary";
import CartCheckoutButton from "./CartCheckoutButton";

import { useCartContext } from "@/context/CartContext";

type CartFooterProps = {
  onClose: () => void;
};

export default function CartFooter({
  onClose,
}: CartFooterProps) {
  const { cart } = useCartContext();

  if (
    !cart ||
    cart.items.length === 0
  ) {
    return null;
  }

  return (
    <footer
className="
  shrink-0
  border-t
  px-4
  pt-4
  pb-[max(48px,calc(env(safe-area-inset-bottom)+40px))]
  sm:pb-4
  backdrop-blur-xl
"
      style={{
        background:
          "color-mix(in srgb, var(--cart-bg) 94%, transparent)",
        borderColor:
          "var(--cart-divider)",
        boxShadow:
          "0 -12px 32px rgba(0,0,0,0.12)",
      }}
    >
      <div className="space-y-4">
        <CartSummary />

        <CartCheckoutButton
          onCheckout={onClose}
        />
      </div>
    </footer>
  );
}