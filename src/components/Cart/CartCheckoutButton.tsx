"use client";

import { useRouter } from "next/navigation";

import {
  Lock,
  ArrowRight,
} from "lucide-react";

import { toast } from "sonner";

import { useCartContext } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

import {
  useNavigationLoader,
} from "@/components/ui/Preloader";

type CartCheckoutButtonProps = {
  onCheckout?: () => void;
};

export default function CartCheckoutButton({
  onCheckout,
}: CartCheckoutButtonProps) {
  const router =
    useRouter();

  const {
    startNavigation,
  } =
    useNavigationLoader();

  const { cart } =
    useCartContext();

  const {
    user,
    loading,
  } = useAuth();

  const handleCheckout =
    () => {
      if (loading) {
        return;
      }

      if (
        !cart ||
        cart.items.length === 0
      ) {
        toast.info(
          "Your cart is empty.",
        );

        return;
      }

      if (!user) {
        onCheckout?.();

        toast.info(
          "Please sign in to continue to checkout.",
        );

        startNavigation();

        router.push(
          "/Auth?redirect=/checkout",
        );

        return;
      }

      onCheckout?.();

      startNavigation();

      router.push(
        "/checkout",
      );
    };

  return (
    <button
      type="button"
      onClick={
        handleCheckout
      }
      disabled={
        loading
      }
className="
  flex
  w-full
  items-center
  justify-center
  gap-2
  rounded-xl
  px-4
  pt-3
  pb-[max(12px,calc(env(safe-area-inset-bottom)+8px))]
  sm:py-3
  text-sm
  font-semibold
  transition-all
  hover:scale-[1.01]
  active:scale-[0.99]
  disabled:cursor-not-allowed
  disabled:opacity-60
"
      style={{
        background:
          "var(--cart-button-primary-bg)",
        color:
          "var(--button-primary-foreground)",
        transition:
          "var(--cart-transition)",
      }}
    >
      {user ? (
        <>
          Proceed to Checkout

          <ArrowRight
            size={16}
          />
        </>
      ) : (
        <>
          <Lock
            size={16}
          />

          Sign In to Checkout
        </>
      )}
    </button>
  );
}