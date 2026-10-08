"use client";

import type {
  DepositSummary as DepositSummaryType,
} from "./deposit.types";

import {
  formatDepositMoney,
} from "./deposit.utils";

type DepositSummaryProps = {
  summary: DepositSummaryType;
};

export default function DepositSummary({
  summary,
}: DepositSummaryProps) {
  const formatMoney = (
    value: number
  ) =>
    new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    ).format(value);

  return (
    <section
      className="
        mt-5
        rounded-[var(--deposit-summary-radius)]
        border
        border-[var(--deposit-summary-border)]
        bg-[var(--deposit-summary-bg)]
        p-3
        shadow-[var(--deposit-summary-shadow)]
        sm:mt-8
        sm:p-[var(--deposit-summary-padding)]
      "
    >
      <h2
        className="
          text-[16px]
          font-bold
          text-[var(--deposit-summary-title)]
          sm:text-[20px]
        "
      >
        Deposit Summary
      </h2>

      <div
        className="
          mt-4
          space-y-2.5
          sm:mt-6
          sm:space-y-4
        "
      >
        <SummaryRow
          label="Payment Method"
          value={summary.method}
        />

        <SummaryRow
          label="Deposit Amount"
          value={formatDepositMoney(
            summary.amount
          )}
        />

        <SummaryRow
          label="Gateway Fee"
          value={formatDepositMoney(
            summary.gatewayFee
          )}
        />

        <SummaryRow
          label="Bonus"
          value={formatDepositMoney(
            summary.bonus
          )}
        />

        <div
          className="
            border-t
            border-[var(--deposit-summary-divider)]
            pt-2.5
            sm:pt-4
          "
        >
          <SummaryRow
            label="Total Credit"
            value={formatDepositMoney(
              summary.totalCredit
            )}
            total
          />
        </div>
      </div>
    </section>
  );
}

type SummaryRowProps = {
  label: string;

  value: string;

  total?: boolean;
};

function SummaryRow({
  label,
  value,
  total = false,
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
          text-[var(--deposit-summary-label)]
          sm:text-[14px]
        "
      >
        {label}
      </span>

      <span
        className={
          total
            ? `
                text-[14px]
                font-bold
                text-[var(--deposit-summary-total)]
                sm:text-[18px]
              `
            : `
                text-[11px]
                font-semibold
                text-[var(--deposit-summary-value)]
                sm:text-[15px]
              `
        }
      >
        {value}
      </span>
    </div>
  );
}