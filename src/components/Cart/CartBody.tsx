"use client";

import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import SavedForLater from "./SavedForLater";

import { useCartContext } from "@/context/CartContext";

import type {
  AppEnvironment,
} from "@/types/environment";

type CartBodyProps = {
  environment?: AppEnvironment;
  onClose: () => void;
};

export default function CartBody({
  environment = "public",
  onClose,
}: CartBodyProps) {
  const {
    cart,
    loading,
  } = useCartContext();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center px-6">
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"
            style={{
              borderColor:
                "var(--cart-border)",
              borderTopColor:
                "transparent",
            }}
          />

          <p
            className="text-sm"
            style={{
              color:
                "var(--text-secondary)",
            }}
          >
            Loading your cart...
          </p>
        </div>
      </div>
    );
  }

  if (!cart) {
    return null;
  }

  const hasCartItems =
    cart.items.length > 0;

  const hasSavedItems =
    cart.savedItems.length > 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          px-4
          pt-3
          pb-72
        "
      >
        {hasCartItems ? (
          <section>
            {cart.items.map(
              (
                item,
                index,
              ) => (
                <CartItem
                  key={item.id}
                  item={item}
                  environment={
                    environment
                  }
                  onClose={
                    onClose
                  }
                  showDivider={
                    index <
                    cart.items.length - 1
                  }
                />
              ),
            )}
          </section>
        ) : (
          <EmptyCart
            hasSavedItems={false}
            continueShoppingHref={
              environment === "user"
                ? "/Market-Place"
                : "/Shop"
            }
            onContinueShopping={
              onClose
            }
          />
        )}

        {hasSavedItems && (
          <section className="mt-8">
            <div
              className="
                mb-6
                flex
                items-center
                justify-center
                gap-3
              "
            >
              <div
                className="
                  h-px
                  flex-1
                  max-w-16
                "
                style={{
                  background:
                    "color-mix(in srgb, var(--foreground) 35%, transparent)",
                }}
              />

              <span
                className="
                  max-w-[190px]
                  shrink-0
                  text-center
                  text-[9px]
                  font-medium
                  leading-none
                  sm:text-[10px]
                "
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              >
                Below are items you saved for later.
              </span>

              <div
                className="
                  h-px
                  flex-1
                  max-w-16
                "
                style={{
                  background:
                    "color-mix(in srgb, var(--foreground) 35%, transparent)",
                }}
              />
            </div>

            <div
              className="
                rounded-2xl
                p-3
              "
              style={{
                background:
                  "var(--cart-button-secondary-bg)",
                border:
                  "1px solid var(--cart-border)",
              }}
            >
              <SavedForLater
                items={
                  cart.savedItems
                }
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}