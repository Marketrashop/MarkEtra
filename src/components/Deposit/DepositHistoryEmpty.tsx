"use client";

import {
  Wallet,
} from "lucide-react";

export default function DepositHistoryEmpty() {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-[var(--deposit-history-empty-radius)]
        border
        border-[var(--deposit-history-empty-border)]
        bg-[var(--deposit-history-empty-bg)]
        p-5
        text-center
        shadow-[var(--deposit-history-empty-shadow)]
        transition-all
        duration-[var(--deposit-history-empty-transition)]
        sm:p-[var(--deposit-history-empty-padding)]
      "
    >
      <div
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          bg-[var(--deposit-history-empty-icon-bg)]
          sm:h-16
          sm:w-16
        "
      >
        <Wallet
          size={22}
          className="
            text-[var(--deposit-history-empty-icon-color)]
            sm:h-[30px]
            sm:w-[30px]
          "
        />
      </div>

      <h3
        className="
          mt-3
          text-[14px]
          font-bold
          text-[var(--deposit-history-empty-title)]
          sm:mt-6
          sm:text-xl
        "
      >
        No Deposits Yet
      </h3>

      <p
        className="
          mt-2
          max-w-md
          text-[10px]
          leading-5
          text-[var(--deposit-history-empty-text)]
          sm:mt-3
          sm:text-sm
          sm:leading-7
        "
      >
        You have not submitted any deposit requests yet.
        Your recent deposits will appear here after they have
        been created.
      </p>
    </div>
  );
}