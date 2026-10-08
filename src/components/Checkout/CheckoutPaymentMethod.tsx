"use client";

import {
  Check,
  Wallet,
} from "lucide-react";

import type {
  CheckoutPaymentMethod as CheckoutPaymentMethodType,
} from "@/types/checkout.types";

type CheckoutPaymentMethodProps = {
  value: CheckoutPaymentMethodType;

  onChange: (
    method: CheckoutPaymentMethodType,
  ) => void;
};

const METHODS: {
  value: CheckoutPaymentMethodType;
  label: string;
  description: string;
}[] = [
  {
    value: "WALLET",
    label: "Wallet balance",
    description:
      "Pay instantly from your available balance.",
  },
  {
    value: "CRYPTO",
    label: "Crypto",
    description:
      "Pay using one of the available cryptocurrencies.",
  },
];

export default function CheckoutPaymentMethod({
  value,
  onChange,
}: CheckoutPaymentMethodProps) {
  return (
    <section
      className="
        rounded-xl
        border
        border-[var(--user-card-border)]
        bg-[var(--user-card-bg)]
        p-4
        shadow-[var(--user-card-shadow)]
      "
    >
      <div>
        <p
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-[var(--user-text-muted)]
          "
        >
          Step 2
        </p>

        <h2
          className="
            mt-1
            text-sm
            font-semibold
            text-[var(--user-title)]
          "
        >
          Payment method
        </h2>

        <p
          className="
            mt-1
            text-xs
            text-[var(--user-text-muted)]
          "
        >
          Choose how you want to pay for this
          order.
        </p>
      </div>

      <div
        className="
          mt-4
          grid
          gap-2
          sm:grid-cols-2
        "
      >
        {METHODS.map(
          (method) => {
            const selected =
              value ===
              method.value;

            return (
              <button
                key={
                  method.value
                }
                type="button"
                aria-pressed={
                  selected
                }
                onClick={() =>
                  onChange(
                    method.value,
                  )
                }
                className={`
                  group
                  flex
                  min-w-0
                  items-center
                  gap-3
                  rounded-lg
                  border
                  px-3
                  py-3
                  text-left
                  transition-all
                  duration-200
                  ${
                    selected
                      ? "border-[var(--primary)] bg-[var(--surface-card)]"
                      : "border-[var(--user-card-border)] bg-[var(--user-card-bg)] hover:border-[var(--primary)]"
                  }
                `}
              >
                <span
                  className={`
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    ${
                      selected
                        ? "bg-[var(--primary)] text-[var(--services-cta-primary-text)]"
                        : "bg-[var(--user-stat-bg)] text-[var(--user-text-muted)]"
                    }
                  `}
                >
                  {method.value ===
                  "WALLET" ? (
                    <Wallet
                      size={15}
                      strokeWidth={
                        2.1
                      }
                    />
                  ) : (
                    <span
                      className="
                        text-[11px]
                        font-bold
                      "
                    >
                      ₿
                    </span>
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className="
                      flex
                      items-center
                      justify-between
                      gap-2
                    "
                  >
                    <span
                      className="
                        truncate
                        text-xs
                        font-semibold
                        text-[var(--user-title)]
                      "
                    >
                      {
                        method.label
                      }
                    </span>

                    {selected && (
                      <Check
                        size={15}
                        strokeWidth={
                          2.4
                        }
                        className="
                          shrink-0
                          text-[var(--primary)]
                        "
                      />
                    )}
                  </span>

                  <span
                    className="
                      mt-0.5
                      block
                      text-[11px]
                      leading-4
                      text-[var(--user-text-muted)]
                    "
                  >
                    {
                      method.description
                    }
                  </span>
                </span>
              </button>
            );
          },
        )}
      </div>
    </section>
  );
}