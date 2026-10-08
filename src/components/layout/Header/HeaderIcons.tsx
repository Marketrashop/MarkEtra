"use client";

import {
  Heart,
  Search,
  ShoppingCart,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import CartDrawer from "@/components/Cart/CartDrawer";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  useCartContext,
} from "@/context/CartContext";

import {
  useSearchContext,
} from "@/context/AppSearchContext";

import {
  cn,
} from "@/lib/utils";

import {
  toast,
} from "sonner";

type HeaderIconsProps = {
  className?: string;
};

const buttonClass =
  "relative flex h-9 w-9 items-center justify-center text-[var(--icon-color)] transition-colors duration-200 hover:text-[var(--primary)]";

export default function HeaderIcons({
  className,
}: HeaderIconsProps) {
  const router =
    useRouter();

  const { user } =
    useAuth();

  const {
    itemCount,
    cartOpen,
    openCart,
    closeCart,
  } =
    useCartContext();

  const {
    openSearch,
  } =
    useSearchContext();

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-2.5",
          className,
        )}
      >
        <button
          type="button"
          aria-label="Search"
          className={buttonClass}
          onClick={openSearch}
        >
          <Search
            size={22}
            strokeWidth={2.75}
          />
        </button>

        <button
          type="button"
          aria-label="Shopping Cart"
          className={buttonClass}
          onClick={openCart}
        >
          <ShoppingCart
            size={19}
            strokeWidth={2.6}
          />

          {itemCount > 0 && (
            <span
              className="
                absolute
                -right-2
                -top-2
                flex
                min-h-[20px]
                min-w-[20px]
                items-center
                justify-center
                rounded-full
                bg-[var(--cart-badge-bg)]
                px-1.5
                text-[10px]
                font-bold
                leading-none
                text-[var(--cart-badge-text)]
                shadow-sm
                transition-colors
                duration-300
              "
              style={{
                border:
                  "1px solid var(--cart-badge-border)",
              }}
            >
              {itemCount > 99
                ? "99+"
                : itemCount}
            </span>
          )}
        </button>

        <button
          type="button"
          aria-label="Wishlist"
          className={buttonClass}
          onClick={() => {
            if (user) {
              router.push(
                "/wishlist",
              );

              return;
            }

            toast.info(
              "Sign in to save products and access your wishlist.",
            );

            router.push(
              "/Auth?redirect=/wishlist",
            );
          }}
        >
          <Heart
            size={19}
            strokeWidth={2.6}
          />
        </button>
      </div>

      <CartDrawer
        open={cartOpen}
        onClose={closeCart}
        environment="public"
      />
    </>
  );
}