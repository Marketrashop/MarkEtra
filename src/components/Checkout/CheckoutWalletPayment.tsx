"use client";

import {
  AlertCircle,
  CheckCircle2,
  Wallet,
} from "lucide-react";

type CheckoutWalletPaymentProps = {
  balance: number;

  total: number;

  canPay: boolean;
};

export default function CheckoutWalletPayment({
  balance,
  total,
  canPay,
}: CheckoutWalletPaymentProps) {
  const formattedBalance =
    balance.toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    );

  const formattedTotal =
    total.toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    );

  const remaining =
    Math.max(
      0,
      balance - total,
    );

  const formattedRemaining =
    remaining.toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    );

  return (
    <div
      className="
        mt-3
        rounded-lg
        border
        border-[var(--user-card-border)]
        bg-[var(--user-stat-bg)]
        p-3
      "
    >
      <div
        className="
          flex
          items-center
          gap-2.5
        "
      >
        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[var(--surface-card)]
            text-[var(--primary)]
          "
        >
          <Wallet
            size={16}
            strokeWidth={2.1}
          />
        </div>

        <div className="min-w-0">
          <p
            className="
              text-xs
              font-semibold
              text-[var(--user-title)]
            "
          >
            Wallet balance
          </p>

          <p
            className="
              mt-0.5
              text-[11px]
              text-[var(--user-text-muted)]
            "
          >
            Payment is processed instantly.
          </p>
        </div>
      </div>

      <div
        className="
          mt-3
          grid
          grid-cols-2
          gap-2
        "
      >
        <Stat
          label="Available"
          value={`$${formattedBalance}`}
        />

        <Stat
          label="Order total"
          value={`$${formattedTotal}`}
        />

        <div className="col-span-2">
          <Stat
            label={
              canPay
                ? "Balance after payment"
                : "Shortfall"
            }
            value={
              canPay
                ? `$${formattedRemaining}`
                : `$${(
                    total -
                    balance
                  ).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits:
                        2,
                      maximumFractionDigits:
                        2,
                    },
                  )}`
            }
            emphasis={
              !canPay
            }
          />
        </div>
      </div>

      <div
        className={`
          mt-3
          flex
          items-start
          gap-2
          rounded-lg
          border
          px-3
          py-2
          text-[11px]
          leading-4
          ${
            canPay
              ? "border-[var(--user-badge-success-border)] bg-[var(--user-badge-success-bg)] text-[var(--user-badge-success-text)]"
              : "border-[var(--user-badge-danger-border)] bg-[var(--user-badge-danger-bg)] text-[var(--user-badge-danger-text)]"
          }
        `}
      >
        {canPay ? (
          <CheckCircle2
            size={14}
            className="mt-0.5 shrink-0"
          />
        ) : (
          <AlertCircle
            size={14}
            className="mt-0.5 shrink-0"
          />
        )}

        <p>
          {canPay
            ? "Your wallet balance is sufficient. Payment will be confirmed immediately."
            : "Your wallet balance is insufficient for this order. Add funds or choose crypto payment."}
        </p>
      </div>
    </div>
  );
}

type StatProps = {
  label: string;

  value: string;

  emphasis?: boolean;
};

function Stat({
  label,
  value,
  emphasis = false,
}: StatProps) {
  return (
    <div
      className="
        rounded-lg
        border
        border-[var(--user-card-border)]
        bg-[var(--user-card-bg)]
        px-3
        py-2
      "
    >
      <p
        className="
          text-[10px]
          font-medium
          uppercase
          tracking-[0.08em]
          text-[var(--user-text-muted)]
        "
      >
        {label}
      </p>

      <p
        className={`
          mt-1
          truncate
          text-xs
          font-semibold
          ${
            emphasis
              ? "text-[var(--user-badge-danger-text)]"
              : "text-[var(--user-title)]"
          }
        `}
      >
        {value}
      </p>
    </div>
  );
}