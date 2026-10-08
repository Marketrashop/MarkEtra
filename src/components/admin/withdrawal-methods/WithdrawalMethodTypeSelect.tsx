"use client";

import type {
  WithdrawalMethodType,
} from "./withdrawal-method.types";

type WithdrawalMethodTypeSelectProps = {
  value: WithdrawalMethodType;

  onChange: (
    value: WithdrawalMethodType
  ) => void;

  disabled?: boolean;
};

export default function WithdrawalMethodTypeSelect({
  value,
  onChange,
  disabled = false,
}: WithdrawalMethodTypeSelectProps) {
  return (
    <div
      className="
        space-y-0.5
        sm:space-y-2
      "
    >
      <label
        htmlFor="withdrawal-method-type"
        className="
          block
          text-[11px]
          font-medium
          text-[var(--admin-text)]
          sm:text-sm
        "
      >
        Withdrawal Method Type
      </label>

      <select
        id="withdrawal-method-type"
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(
            event.target
              .value as WithdrawalMethodType
          )
        }
        className="
          h-7
          w-full
          rounded-md
          border
          border-[var(--admin-input-border)]
          bg-[var(--admin-input-bg)]
          px-2
          text-[11px]
          text-[var(--admin-input-text)]
          outline-none
          transition-all
          duration-300
          focus:border-[var(--admin-input-focus)]
          disabled:cursor-not-allowed
          disabled:opacity-60
          sm:h-11
          sm:rounded-[var(--admin-input-radius)]
          sm:px-3
          sm:text-sm
        "
      >
        <option value="crypto">
          Crypto
        </option>

        <option value="bank">
          Bank
        </option>
      </select>

      <p
        className="
          text-[9px]
          leading-3.5
          text-[var(--admin-muted)]
          sm:text-xs
          sm:leading-5
        "
      >
        Crypto allows users to withdraw to
        supported blockchain wallets. Bank
        allows users to submit international
        bank account details.
      </p>
    </div>
  );
}