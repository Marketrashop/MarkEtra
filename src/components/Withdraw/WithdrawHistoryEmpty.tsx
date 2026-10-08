"use client";

import {
  Wallet,
} from "lucide-react";

export default function WithdrawHistoryEmpty() {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-[var(--withdraw-history-empty-radius)]
        border
        border-[var(--withdraw-history-empty-border)]
        bg-[var(--withdraw-history-empty-bg)]
        p-5
        text-center
        shadow-[var(--withdraw-history-empty-shadow)]
        transition-all
        duration-[var(--withdraw-history-empty-transition)]
        sm:p-[var(--withdraw-history-empty-padding)]
      "
    >
      <div
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-[var(--withdraw-history-empty-icon-bg)]
          sm:h-12
          sm:w-12
        "
      >
        <Wallet
          size={18}
          strokeWidth={2}
          className="
            text-[var(--withdraw-history-empty-icon-color)]
            sm:h-[22px]
            sm:w-[22px]
          "
        />
      </div>

      <h3
        className="
          mt-3
          text-[14px]
          font-bold
          text-[var(--withdraw-history-empty-title)]
          sm:mt-4
          sm:text-[16px]
        "
      >
        No Withdrawals Yet
      </h3>

      <p
        className="
          mt-1.5
          max-w-sm
          text-[10px]
          leading-5
          text-[var(--withdraw-history-empty-text)]
          sm:mt-2
          sm:text-[12px]
          sm:leading-6
        "
      >
        Your withdrawal transactions will
        appear here after you submit your
        first withdrawal request.
      </p>
    </div>
  );
}