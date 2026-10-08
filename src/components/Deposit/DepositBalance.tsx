"use client";

import { Wallet } from "lucide-react";

type DepositBalanceProps = {
  balance: number;
};

export default function DepositBalance({
  balance,
}: DepositBalanceProps) {
  const formattedBalance = `$${balance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <section
      className="
        rounded-[var(--deposit-balance-radius)]
        border
        border-[var(--deposit-balance-border)]
        bg-[var(--deposit-balance-bg)]
        p-3
        shadow-[var(--deposit-balance-shadow)]
        transition-all
        duration-[var(--deposit-balance-transition)]
        sm:p-[var(--deposit-balance-padding)]
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-2.5
          sm:gap-4
        "
      >
        <div className="min-w-0">
          <p
            className="
              text-[11px]
              font-medium
              text-[var(--deposit-balance-title)]
              sm:text-[14px]
            "
          >
            Wallet Balance
          </p>

          <h2
            className="
              mt-1.5
              text-[24px]
              font-extrabold
              leading-none
              tracking-[-0.02em]
              text-[var(--deposit-balance-amount)]
              sm:mt-2
              sm:text-[36px]
              lg:text-[42px]
            "
          >
            {formattedBalance}
          </h2>
        </div>

        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-[var(--deposit-balance-icon-bg)]
            text-[var(--deposit-balance-icon-color)]
            shadow-md
            sm:h-16
            sm:w-16
            sm:rounded-2xl
          "
        >
          <Wallet
            size={20}
            strokeWidth={2}
            className="
              sm:h-7
              sm:w-7
            "
          />
        </div>
      </div>

      <p
        className="
          mt-3
          text-[11px]
          leading-5
          text-[var(--deposit-balance-text)]
          sm:mt-4
          sm:text-[14px]
          sm:leading-6
        "
      >
        Deposit funds into your wallet to purchase products, subscribe to plans, and access premium features.
      </p>
    </section>
  );
}