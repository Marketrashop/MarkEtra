"use client";

import Image from "next/image";

import {
  Building2,
  Check,
} from "lucide-react";

import type {
  WithdrawMethod,
} from "./withdraw.types";

type WithdrawMethodCardProps = {
  method: WithdrawMethod;

  selected: boolean;

  onSelect: (
    method: WithdrawMethod
  ) => void;
};

export default function WithdrawMethodCard({
  method,
  selected,
  onSelect,
}: WithdrawMethodCardProps) {
  return (
    <button
      type="button"
      onClick={() =>
        onSelect(method)
      }
      aria-pressed={selected}
      className={`
        relative
        flex
        min-w-[112px]
        flex-1
        items-center
        gap-2
        rounded-[var(--withdraw-method-card-radius)]
        border
        p-2
        text-left
        shadow-[var(--withdraw-method-card-shadow)]
        transition-all
        duration-[var(--withdraw-method-card-transition)]
        focus:outline-none
        focus:ring-2
        focus:ring-[var(--withdraw-method-card-focus)]
        focus:ring-offset-2
        focus:ring-offset-[var(--withdraw-method-card-focus-offset)]
        sm:min-w-[132px]
        sm:gap-3
        sm:p-[var(--withdraw-method-card-padding)]
        ${
          selected
            ? `
                border-[var(--withdraw-method-card-selected-border)]
                bg-[var(--withdraw-method-card-selected-bg)]
                text-[var(--withdraw-method-card-selected-text)]
                shadow-[var(--withdraw-method-card-selected-shadow)]
              `
            : `
                border-[var(--withdraw-method-card-border)]
                bg-[var(--withdraw-method-card-bg)]
                text-[var(--withdraw-method-card-text)]
                hover:border-[var(--withdraw-method-card-hover-border)]
                hover:bg-[var(--withdraw-method-card-hover-bg)]
                hover:text-[var(--withdraw-method-card-hover-text)]
              `
        }
      `}
    >
      {selected && (
        <span
          className="
            absolute
            right-1.5
            top-1.5
            flex
            h-3.5
            w-3.5
            items-center
            justify-center
            rounded-full
            bg-[var(--withdraw-method-card-check-bg)]
            text-[var(--withdraw-method-card-check-color)]
            sm:right-2
            sm:top-2
            sm:h-4
            sm:w-4
          "
          aria-hidden="true"
        >
          <Check
            size={9}
            strokeWidth={3}
            className="
              sm:h-2.5
              sm:w-2.5
            "
          />
        </span>
      )}

      <span
        className="
          relative
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-md
          bg-[var(--withdraw-method-card-icon-bg)]
          sm:h-9
          sm:w-9
          sm:rounded-lg
        "
      >
        {method.type === "bank" ? (
          <Building2
            size={16}
            strokeWidth={2}
            className="
              text-[var(--withdraw-method-card-icon-color)]
              sm:h-[18px]
              sm:w-[18px]
            "
          />
        ) : (
          <Image
            src={method.icon}
            alt=""
            fill
            sizes="36px"
            className="
              object-contain
              p-1
              sm:p-1.5
            "
          />
        )}
      </span>

      <span
        className="
          min-w-0
        "
      >
        <span
          className="
            block
            truncate
            text-[10px]
            font-semibold
            sm:text-[12px]
          "
        >
          {method.name}
        </span>

        <span
          className="
            mt-0.5
            block
            text-[9px]
            font-medium
            opacity-75
            sm:text-[10px]
          "
        >
          {method.symbol}
        </span>
      </span>
    </button>
  );
}