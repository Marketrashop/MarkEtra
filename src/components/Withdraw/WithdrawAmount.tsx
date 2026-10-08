"use client";

import {
  formatWithdrawAmount,
  calculateRemainingBalance,
} from "./withdraw.utils";

type WithdrawAmountProps = {
  availableBalance: number;

  value: number;

  onChange: (
    amount: number
  ) => void;

  disabled?: boolean;
};

export default function WithdrawAmount({
  availableBalance,
  value,
  onChange,
  disabled = false,
}: WithdrawAmountProps) {
  const remainingBalance =
    calculateRemainingBalance(
      availableBalance,
      value
    );

  function handleUseMax() {
    onChange(
      availableBalance
    );
  }

  function handleAmountChange(
    input: string
  ) {
    if (input === "") {
      onChange(0);
      return;
    }

    const nextAmount =
      Number(input);

    if (
      Number.isNaN(nextAmount)
    ) {
      return;
    }

    onChange(nextAmount);
  }

  return (
    <div
      className="
        mt-4
        sm:mt-5
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-2
          sm:gap-3
        "
      >
        <p
          className="
            text-[10px]
            font-medium
            text-[var(--withdraw-amount-label)]
            sm:text-[12px]
          "
        >
          Available Balance
        </p>

        <div
          className="
            flex
            items-center
            gap-1.5
            sm:gap-2
          "
        >
          <span
            className="
              text-[10px]
              font-medium
              text-[var(--withdraw-amount-balance)]
              sm:text-[12px]
            "
          >
            {formatWithdrawAmount(
              availableBalance
            )}
          </span>

          <button
            type="button"
            onClick={
              handleUseMax
            }
            disabled={
              disabled ||
              availableBalance <=
                0
            }
            className="
              rounded-md
              border
              border-[var(--withdraw-amount-max-border)]
              bg-[var(--withdraw-amount-max-bg)]
              px-1.5
              py-0.5
              text-[9px]
              font-medium
              text-[var(--withdraw-amount-max-text)]
              transition-all
              duration-[var(--withdraw-amount-transition)]
              hover:border-[var(--withdraw-amount-max-hover-border)]
              hover:bg-[var(--withdraw-amount-max-hover-bg)]
              hover:text-[var(--withdraw-amount-max-hover-text)]
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:px-2
              sm:py-1
              sm:text-[11px]
            "
          >
            Use Max
          </button>
        </div>
      </div>

      <label
        htmlFor="withdrawal-amount"
        className="
          mb-1.5
          mt-3
          block
          text-[10px]
          font-medium
          text-[var(--withdraw-amount-label)]
          sm:mb-2
          sm:mt-4
          sm:text-[12px]
        "
      >
        Withdrawal Amount
      </label>

      <div
        className="
          relative
        "
      >
        <span
          className="
            pointer-events-none
            absolute
            left-2.5
            top-1/2
            -translate-y-1/2
            text-[11px]
            font-medium
            text-[var(--withdraw-amount-currency)]
            sm:left-3
            sm:text-[13px]
          "
        >
          $
        </span>

        <input
          id="withdrawal-amount"
          type="number"
          min="0"
          max={
            availableBalance
          }
          step="0.01"
          value={
            value || ""
          }
          onChange={(event) =>
            handleAmountChange(
              event.target.value
            )
          }
          disabled={disabled}
          placeholder="0.00"
          inputMode="decimal"
          className="
            h-8
            w-full
            rounded-lg
            border
            border-[var(--withdraw-amount-input-border)]
            bg-[var(--withdraw-amount-input-bg)]
            pl-6
            pr-2.5
            text-[11px]
            text-[var(--withdraw-amount-input-text)]
            outline-none
            transition-all
            duration-[var(--withdraw-amount-transition)]
            placeholder:text-[var(--withdraw-amount-input-placeholder)]
            focus:border-[var(--withdraw-amount-input-focus)]
            disabled:cursor-not-allowed
            disabled:opacity-60
            sm:h-auto
            sm:rounded-xl
            sm:py-2.5
            sm:pl-7
            sm:pr-3
            sm:text-[13px]
          "
        />
      </div>

      <div
        className="
          mt-2.5
          flex
          items-center
          justify-between
          gap-2
          sm:mt-3
          sm:gap-3
        "
      >
        <span
          className="
            text-[9px]
            text-[var(--withdraw-amount-remaining-label)]
            sm:text-[11px]
          "
        >
          Remaining Balance
        </span>

        <span
          className="
            text-[11px]
            font-semibold
            text-[var(--withdraw-amount-remaining-value)]
            sm:text-[12px]
          "
        >
          {formatWithdrawAmount(
            remainingBalance
          )}
        </span>
      </div>
    </div>
  );
}