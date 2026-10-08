"use client";

import {
  useState,
} from "react";

import {
  LoaderCircle,
} from "lucide-react";

import {
  formatWithdrawAmount,
} from "./withdraw.utils";

type WithdrawActionProps = {
  amount: number;

  youReceive: number;

  disabled?: boolean;

  onWithdraw: () =>
    | Promise<void>
    | void;
};

export default function WithdrawAction({
  amount,
  youReceive,
  disabled = false,
  onWithdraw,
}: WithdrawActionProps) {
  const [loading, setLoading] =
    useState(false);

  async function handleWithdraw() {
    if (
      disabled ||
      loading
    ) {
      return;
    }

    setLoading(true);

    try {
      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            300,
          ),
      );

      await onWithdraw();
    } finally {
      setLoading(false);
    }
  }

  const buttonLabel =
    amount > 0
      ? `Withdraw ${formatWithdrawAmount(
          youReceive,
        )}`
      : "Withdraw Funds";

  return (
    <section
      className="
        mt-4
        sm:mt-6
      "
    >
      <button
        type="button"
        disabled={
          disabled ||
          loading
        }
        onClick={
          handleWithdraw
        }
        className="
          inline-flex
          h-9
          w-full
          items-center
          justify-center
          gap-1.5
          rounded-[var(--withdraw-action-radius)]
          bg-[var(--withdraw-action-bg)]
          px-3
          text-[11px]
          font-semibold
          text-[var(--withdraw-action-text)]
          shadow-[var(--withdraw-action-shadow)]
          transition-all
          duration-[var(--withdraw-action-transition)]
          hover:bg-[var(--withdraw-action-hover-bg)]
          hover:text-[var(--withdraw-action-hover-text)]
          disabled:cursor-not-allowed
          disabled:bg-[var(--withdraw-action-disabled-bg)]
          disabled:text-[var(--withdraw-action-disabled-text)]
          disabled:shadow-none
          sm:h-auto
          sm:gap-2
          sm:px-5
          sm:py-[var(--withdraw-action-padding-y)]
          sm:text-[14px]
        "
      >
        {loading ? (
          <>
            <LoaderCircle
              size={14}
              className="
                animate-spin
                sm:h-[17px]
                sm:w-[17px]
              "
            />

            Processing Withdrawal...
          </>
        ) : (
          buttonLabel
        )}
      </button>

      <p
        className="
          mt-2
          text-center
          text-[9px]
          leading-4
          text-[var(--withdraw-action-note)]
          sm:mt-3
          sm:text-[11px]
          sm:leading-5
        "
      >
        Review your withdrawal details
        carefully before continuing.
      </p>
    </section>
  );
}