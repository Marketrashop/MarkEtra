"use client";

import {
  useState,
} from "react";

import {
  LoaderCircle,
} from "lucide-react";

type DepositActionProps = {
  disabled?: boolean;

  onContinue: () => Promise<void> | void;
};

export default function DepositAction({
  disabled = false,
  onContinue,
}: DepositActionProps) {
  const [loading, setLoading] =
    useState(false);

  async function handleContinue() {
    setLoading(true);

    await new Promise(
      (resolve) =>
        setTimeout(resolve, 300),
    );

    await onContinue();

    setLoading(false);
  }

  return (
    <section
      className="
        mt-5
        sm:mt-8
      "
    >
      <button
        type="button"
        disabled={
          disabled || loading
        }
        onClick={handleContinue}
        className="
          inline-flex
          h-10
          w-full
          items-center
          justify-center
          gap-1.5
          rounded-[var(--deposit-action-button-radius)]
          border
          border-[var(--deposit-action-button-border)]
          bg-[var(--deposit-action-button-bg)]
          px-4
          text-[13px]
          font-semibold
          text-[var(--deposit-action-button-text)]
          shadow-[var(--deposit-action-button-shadow)]
          transition-all
          duration-300
          hover:border-[var(--deposit-action-button-hover-border)]
          hover:bg-[var(--deposit-action-button-hover)]
          hover:text-[var(--deposit-action-button-hover-text)]
          disabled:cursor-not-allowed
          disabled:border-[var(--deposit-action-button-disabled-border)]
          disabled:bg-[var(--deposit-action-button-disabled-bg)]
          disabled:text-[var(--deposit-action-button-disabled-text)]
          disabled:shadow-none
          sm:h-auto
          sm:gap-2
          sm:px-6
          sm:py-[var(--deposit-action-button-padding-y)]
          sm:text-[16px]
        "
      >
        {loading ? (
          <>
            <LoaderCircle
              size={15}
              className="
                animate-spin
                sm:h-[18px]
                sm:w-[18px]
              "
            />

            Preparing Deposit...
          </>
        ) : (
          "Continue to Deposit"
        )}
      </button>

      <p
        className="
          mt-2.5
          text-center
          text-[10px]
          leading-4
          text-[var(--deposit-action-note)]
          sm:mt-4
          sm:text-[13px]
          sm:leading-6
        "
      >
        You will review your deposit details and upload your payment receipt before submitting your request.
      </p>
    </section>
  );
}