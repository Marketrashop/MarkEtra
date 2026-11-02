"use client";

import {
  useState,
} from "react";

import {
  Heart,
  LogIn,
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

type HeaderIconsProps = {
  className?: string;
};

const buttonClass =
  "relative flex h-9 w-9 items-center justify-center text-[var(--icon-color)] transition-colors duration-200 hover:text-[var(--primary)]";

export default function HeaderIcons({
  className,
}: HeaderIconsProps) {
  const router = useRouter();

  const { user } = useAuth();

  const {
    itemCount,
    cartOpen,
    openCart,
    closeCart,
  } = useCartContext();

  const { openSearch } = useSearchContext();

  const [
    isWishlistLoginDialogOpen,
    setIsWishlistLoginDialogOpen,
  ] = useState(false);

  const handleWishlistClick = () => {
    if (user) {
      router.push("/wishlist");
      return;
    }

    setIsWishlistLoginDialogOpen(true);
  };

  const handleWishlistLoginConfirm = () => {
    router.push("/Auth?redirect=/wishlist");
  };

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
          onClick={handleWishlistClick}
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

{isWishlistLoginDialogOpen && (
  <div
    role="presentation"
    className="
      fixed
      inset-0
      z-[100]
      flex
      items-center
      justify-center
      bg-black/45
      px-4
      animate-in
      fade-in
      duration-200
    "
    onClick={() =>
      setIsWishlistLoginDialogOpen(false)
    }
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-login-dialog-title"
      onClick={(event) =>
        event.stopPropagation()
      }
      className="
        w-full
        max-w-[320px]
        rounded-xl
        border
        border-[var(--border)]
        bg-[var(--background)]
        p-4
        shadow-2xl
        animate-in
        fade-in
        zoom-in-95
        slide-in-from-bottom-2
        duration-200
        ease-out
      "
    >
      <h2
        id="wishlist-login-dialog-title"
        className="
          flex
          items-center
          justify-center
          gap-1.5
          border-b
          border-[var(--border)]
          pb-2.5
          text-sm
          font-semibold
          text-[var(--foreground)]
        "
      >
        <LogIn
          size={16}
          strokeWidth={2}
          className="text-[var(--primary)]"
          aria-hidden="true"
        />

        Authentication Required
      </h2>

      <p
        className="
          mt-3
          text-xs
          leading-5
          text-[var(--foreground-muted)]
        "
      >
        Please log in or create an account to view and add items to your wishlist.
      </p>

      <p
        className="
          mt-2
          border-t
          border-[var(--border)]
          pt-2
          text-xs
          font-medium
          text-[var(--foreground)]
        "
      >
        Would you like to continue to your account?
      </p>

      <div className="mt-4 space-y-2">
        <button
          type="button"
          onClick={handleWishlistLoginConfirm}
          className="
            flex
            w-full
            items-center
            justify-center
            rounded-lg
            bg-[var(--foreground)]
            px-3
            py-2
            text-xs
            font-medium
            text-[var(--background)]
            transition
            hover:opacity-90
          "
        >
          Yes, continue
        </button>

        <button
          type="button"
          onClick={() =>
            setIsWishlistLoginDialogOpen(false)
          }
          className="
            w-full
            rounded-lg
            border
            border-[var(--border)]
            px-3
            py-2
            text-xs
            font-medium
            text-[var(--foreground)]
            transition
            hover:bg-[var(--muted)]
          "
        >
          No, please
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
}