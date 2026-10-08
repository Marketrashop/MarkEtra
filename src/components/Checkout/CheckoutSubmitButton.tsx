"use client";

import {
  Loader2,
  LockKeyhole,
} from "lucide-react";

import type {
  CheckoutPaymentMethod,
} from "@/types/checkout.types";

type CheckoutSubmitButtonProps = {
  paymentMethod:
    CheckoutPaymentMethod;

  canSubmit: boolean;

  submitting: boolean;

  onSubmit: () => void;

  onBlocked: () => void;
};

export default function CheckoutSubmitButton({
  paymentMethod,
  canSubmit,
  submitting,
  onSubmit,
  onBlocked,
}: CheckoutSubmitButtonProps) {
  const label =
    paymentMethod ===
    "CRYPTO"
      ? "I have Paid"
      : "Pay Now";

  function handleClick() {
    if (submitting) {
      return;
    }

    if (!canSubmit) {
      onBlocked();

      return;
    }

    onSubmit();
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        aria-disabled={
          !canSubmit ||
          submitting
        }
        aria-busy={
          submitting
        }
        onClick={
          handleClick
        }
        className="
          flex
          h-10
          w-full
          items-center
          justify-center
          gap-2
          rounded-lg
          bg-[var(--services-cta-primary-bg)]
          px-4
          text-sm
          font-semibold
          text-[var(--services-cta-primary-text)]
          transition-all
          duration-200
          hover:opacity-90
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--primary)]
          focus:ring-offset-2
          focus:ring-offset-[var(--background)]
          aria-disabled:cursor-not-allowed
          aria-disabled:opacity-50
        "
      >
        {submitting ? (
          <>
            <Loader2
              size={15}
              className="animate-spin"
            />

            Processing...
          </>
        ) : (
          <>
            {paymentMethod ===
              "CRYPTO" && (
              <LockKeyhole
                size={14}
                strokeWidth={2}
              />
            )}

            {label}
          </>
        )}
      </button>

      <p
        className="
          text-center
          text-[10px]
          leading-4
          text-[var(--user-text-muted)]
        "
      >
        {paymentMethod ===
        "CRYPTO"
          ? "Confirmation is required after your receipt is uploaded."
          : "Your wallet will be debited immediately after confirmation."}
      </p>
    </div>
  );
}