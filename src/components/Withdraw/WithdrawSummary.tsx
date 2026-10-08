"use client";

import {
  formatWithdrawAmount,
} from "./withdraw.utils";

import type {
  WithdrawSummary as WithdrawSummaryType,
} from "./withdraw.types";

type WithdrawSummaryProps = {
  summary: WithdrawSummaryType;
};

export default function WithdrawSummary({
  summary,
}: WithdrawSummaryProps) {
  return (
    <section
      className="
        mt-5
        rounded-[var(--withdraw-summary-radius)]
        border
        border-[var(--withdraw-summary-border)]
        bg-[var(--withdraw-summary-bg)]
        p-3
        shadow-[var(--withdraw-summary-shadow)]
        transition-all
        duration-[var(--withdraw-summary-transition)]
        sm:mt-6
        sm:p-[var(--withdraw-summary-padding)]
      "
    >
      <h2
        className="
          text-[15px]
          font-bold
          text-[var(--withdraw-summary-title)]
          sm:text-[18px]
        "
      >
        Withdrawal Summary
      </h2>

      <div
        className="
          mt-4
          space-y-2.5
          sm:mt-5
          sm:space-y-3
        "
      >
        <SummaryRow
          label="Payment Method"
          value={summary.method}
        />

        <SummaryRow
          label="Withdrawal Amount"
          value={formatWithdrawAmount(
            summary.amount
          )}
        />

        <SummaryRow
          label="Network Fee"
          value={formatWithdrawAmount(
            summary.networkFee
          )}
        />
      </div>

      <div
        className="
          my-3
          border-t
          border-[var(--withdraw-summary-divider)]
          sm:my-4
        "
      />

      <div
        className="
          flex
          items-end
          justify-between
          gap-3
          sm:gap-4
        "
      >
        <span
          className="
            text-[10px]
            font-semibold
            text-[var(--withdraw-summary-receive-label)]
            sm:text-[13px]
          "
        >
          You Receive
        </span>

        <span
          className="
            text-[17px]
            font-extrabold
            tracking-[-0.02em]
            text-[var(--withdraw-summary-receive-value)]
            sm:text-[20px]
          "
        >
          {formatWithdrawAmount(
            summary.youReceive
          )}
        </span>
      </div>
    </section>
  );
}

type SummaryRowProps = {
  label: string;

  value: string;
};

function SummaryRow({
  label,
  value,
}: SummaryRowProps) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-3
        sm:gap-4
      "
    >
      <span
        className="
          text-[10px]
          text-[var(--withdraw-summary-label)]
          sm:text-[12px]
        "
      >
        {label}
      </span>

      <span
        className="
          text-[10px]
          font-semibold
          text-[var(--withdraw-summary-value)]
          sm:text-[12px]
        "
      >
        {value}
      </span>
    </div>
  );
}