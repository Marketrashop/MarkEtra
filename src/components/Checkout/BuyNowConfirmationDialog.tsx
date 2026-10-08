"use client";

import {
  Loader2,
} from "lucide-react";

type BuyNowConfirmationDialogProps = {
  open: boolean;

  loading?: boolean;

  onDirectCheckout: () => void;

  onCartCheckout: () => void;

  onClose: () => void;
};

export default function BuyNowConfirmationDialog({
  open,
  loading = false,
  onDirectCheckout,
  onCartCheckout,
  onClose,
}: BuyNowConfirmationDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/45
        px-4
      "
      onClick={onClose}
    >
      <div
        onClick={(event) =>
          event.stopPropagation()
        }
        className="
          w-full
          max-w-[400px]
          rounded-2xl
          border
          border-[var(--border)]
          bg-[var(--background)]
          p-6
          shadow-2xl
        "
      >
        <h2
          className="
            text-lg
            font-semibold
            text-[var(--foreground)]
          "
        >
          Continue to Checkout
        </h2>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-[var(--foreground-muted)]
          "
        >
          Your cart already contains
          other item
          {` `}
          {
            " "}
          .
          Would you like to checkout
          only this product or
          everything in your cart?
        </p>

        <div
          className="
            mt-6
            space-y-3
          "
        >
          <button
            type="button"
            disabled={loading}
            onClick={
              onDirectCheckout
            }
            className="
              flex
              w-full
              items-center
              justify-center
              rounded-xl
              bg-[var(--foreground)]
              px-4
              py-3
              text-sm
              font-medium
              text-[var(--background)]
              transition
              hover:opacity-90
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading ? (
              <Loader2
                className="
                  h-4
                  w-4
                  animate-spin
                "
              />
            ) : (
              "Buy this item only"
            )}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={
              onCartCheckout
            }
            className="
              w-full
              rounded-xl
              border
              border-[var(--border)]
              px-4
              py-3
              text-sm
              font-medium
              text-[var(--foreground)]
              transition
              hover:bg-[var(--muted)]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            Checkout everything
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="
              w-full
              py-2
              text-sm
              text-[var(--foreground-muted)]
              transition
              hover:text-[var(--foreground)]
              disabled:opacity-60
            "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}