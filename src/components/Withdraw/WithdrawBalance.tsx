"use client";

import { Wallet } from "lucide-react";

import {
  formatWithdrawAmount,
} from "./withdraw.utils";

type WithdrawBalanceProps = {
  availableBalance: number;

  profitBalance: number;

  affiliateBalance: number;

  lockedBalance: number;
};

export default function WithdrawBalance({
  availableBalance,
  profitBalance,
  affiliateBalance,
  lockedBalance,
}: WithdrawBalanceProps) {
  const totalBalance =
    availableBalance +
    profitBalance +
    affiliateBalance +
    lockedBalance;

  return (
    <section
      className="
        rounded-[var(--withdraw-balance-radius)]
        border
        border-[var(--withdraw-balance-border)]
        bg-[var(--withdraw-balance-bg)]
        p-3
        shadow-[var(--withdraw-balance-shadow)]
        transition-all
        duration-[var(--withdraw-balance-transition)]
        sm:p-[var(--withdraw-balance-padding)]
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
        <div
          className="
            min-w-0
          "
        >
          <p
            className="
              text-[10px]
              font-medium
              text-[var(--withdraw-balance-label)]
              sm:text-[12px]
            "
          >
            Total Balance
          </p>

          <h2
            className="
              mt-1.5
              text-[24px]
              font-extrabold
              leading-none
              tracking-[-0.02em]
              text-[var(--withdraw-balance-value)]
              sm:mt-2
              sm:text-[32px]
            "
          >
            {formatWithdrawAmount(
              totalBalance
            )}
          </h2>

          <div
            className="
              mt-3
              space-y-1.5
              text-[10px]
              sm:mt-4
              sm:space-y-1
              sm:text-[12px]
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
                text-[var(--withdraw-balance-text)]
                sm:gap-4
              "
            >
              <span>
                Wallet Balance
              </span>

              <span
                className="font-medium"
              >
                {formatWithdrawAmount(
                  availableBalance
                )}
              </span>
            </div>

            <div
              className="
                flex
                items-center
                justify-between
                gap-3
                text-[var(--withdraw-balance-text)]
                sm:gap-4
              "
            >
              <span>
                Profit Balance
              </span>

              <span
                className="font-medium"
              >
                {formatWithdrawAmount(
                  profitBalance
                )}
              </span>
            </div>

            <div
              className="
                flex
                items-center
                justify-between
                gap-3
                text-[var(--withdraw-balance-text)]
                sm:gap-4
              "
            >
              <span>
                Locked Balance
              </span>

              <span
                className="font-medium"
              >
                {formatWithdrawAmount(
                  lockedBalance
                )}
              </span>
            </div>

            <div
              className="
                flex
                items-center
                justify-between
                gap-3
                text-[var(--withdraw-balance-text)]
                sm:gap-4
              "
            >
              <span>
                Affiliate Balance
              </span>

              <span
                className="font-medium"
              >
                {formatWithdrawAmount(
                  affiliateBalance
                )}
              </span>
            </div>
          </div>

          <p
            className="
              mt-3
              text-[9px]
              leading-4
              text-[var(--withdraw-balance-text)]
              sm:mt-4
              sm:text-[12px]
              sm:leading-normal
            "
          >
            Locked funds are awaiting
            withdrawal review.
          </p>
        </div>

        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-[var(--withdraw-balance-icon-bg)]
            text-[var(--withdraw-balance-icon-color)]
            shadow-[var(--withdraw-balance-icon-shadow)]
            sm:h-14
            sm:w-14
            sm:rounded-xl
          "
        >
          <Wallet
            size={18}
            strokeWidth={2}
            className="
              sm:h-6
              sm:w-6
            "
          />
        </div>
      </div>
    </section>
  );
}