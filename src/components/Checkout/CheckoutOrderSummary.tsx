"use client";

import Image from "next/image";

export type CheckoutSummaryItem = {
  id: string;

  quantity: number;

product: {
  name: string;

  price: number;

  images: {
    imageUrl: string | null;
    imageKey: string | null;
    altText: string | null;
    isPrimary: boolean;
  }[];
};

  variant: {
    label: string | null;

    imageUrl: string | null;

    imageKey: string | null;
  };

  size: string | null;

  unitPrice: number;
};

type CheckoutOrderSummaryProps = {
  items: CheckoutSummaryItem[];

  subtotal: number;

  savings: number;

  total: number;
};

export default function CheckoutOrderSummary({
  items,
  subtotal,
  savings,
  total,
}: CheckoutOrderSummaryProps) {
  return (
    <aside
      className="
        rounded-xl
        border
        border-[var(--user-card-border)]
        bg-[var(--user-card-bg)]
        p-4
        shadow-[var(--user-card-shadow)]
        lg:sticky
        lg:top-4
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
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
            Order summary
          </p>

          <p
            className="
              mt-1
              text-xs
              text-[var(--user-text-muted)]
            "
          >
            {items.length}{" "}
            {items.length === 1
              ? "item"
              : "items"}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {items.map(
          (item) => {
const lineTotal =
  item.unitPrice *
  item.quantity;

const image =
  item.variant.imageUrl
    ? {
        imageUrl:
          item.variant.imageUrl,

        imageKey:
          item.variant.imageKey,

        altText:
          item.variant.label ??
          item.product.name,
      }
    : (
        item.product.images.find(
          (entry) =>
            entry.isPrimary,
        ) ??
        item.product.images[0] ??
        null
      );

            return (
              <div
                key={item.id}
                className="
                  flex
                  min-w-0
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    relative
                    h-12
                    w-12
                    shrink-0
                    overflow-hidden
                    rounded-lg
                    border
                    border-[var(--user-card-border)]
                    bg-[var(--user-stat-bg)]
                  "
                >
                  {image?.imageUrl ? (
                    <Image
                      src={
                        image.imageUrl
                      }
                      alt={
                        image.altText ??
                        item.product
                          .name
                      }
                      fill
                      sizes="48px"
                      className="
                        object-cover
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-full
                        w-full
                        items-center
                        justify-center
                        px-1
                        text-center
                        text-[8px]
                        text-[var(--user-text-muted)]
                      "
                    >
                      No image
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className="
                      truncate
                      text-xs
                      font-semibold
                      text-[var(--user-title)]
                    "
                  >
                    {
                      item.product
                        .name
                    }
                  </p>

                  <div
                    className="
                      mt-0.5
                      flex
                      min-w-0
                      flex-wrap
                      items-center
                      gap-x-2
                      gap-y-0.5
                    "
                  >
                    <span
                      className="
                        text-[10px]
                        text-[var(--user-text-muted)]
                      "
                    >
                      Qty{" "}
                      {
                        item.quantity
                      }
                    </span>

                    {item.variant.label && (
                      <span
                        className="
                          truncate
                          text-[10px]
                          text-[var(--user-text-muted)]
                        "
                      >
                        {
                      item.variant.label
                        }
                      </span>
                    )}

                    {item.size && (
                      <span
                        className="
                          text-[10px]
                          text-[var(--user-text-muted)]
                        "
                      >
                        {
                          item.size
                        }
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className="
                    shrink-0
                    text-xs
                    font-semibold
                    text-[var(--user-title)]
                  "
                >
                  {formatCurrency(
                    lineTotal,
                  )}
                </span>
              </div>
            );
          },
        )}
      </div>

      <div
        className="
          my-4
          border-t
          border-[var(--user-divider)]
        "
      />

      <div className="space-y-2">
        <SummaryRow
          label="Subtotal"
          value={formatCurrency(
            subtotal,
          )}
        />

        {savings > 0 && (
          <SummaryRow
            label="Savings"
            value={`-${formatCurrency(
              savings,
            )}`}
            positive
          />
        )}

        <div
          className="
            mt-3
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <span
            className="
              text-sm
              font-semibold
              text-[var(--user-title)]
            "
          >
            Total
          </span>

          <span
            className="
              text-lg
              font-bold
              text-[var(--user-title)]
            "
          >
            {formatCurrency(
              total,
            )}
          </span>
        </div>
      </div>
    </aside>
  );
}

type SummaryRowProps = {
  label: string;

  value: string;

  positive?: boolean;
};

function SummaryRow({
  label,
  value,
  positive = false,
}: SummaryRowProps) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-3
        text-xs
      "
    >
      <span
        className="
          text-[var(--user-text-muted)]
        "
      >
        {label}
      </span>

      <span
        className={
          positive
            ? "font-medium text-[var(--user-badge-success-text)]"
            : "font-medium text-[var(--user-title)]"
        }
      >
        {value}
      </span>
    </div>
  );
}

function formatCurrency(
  value: number,
) {
  return `$${value.toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;
}