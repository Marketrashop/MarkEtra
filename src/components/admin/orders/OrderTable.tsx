"use client";

import {
  ChevronRight,
  Eye,
} from "lucide-react";

import type {
  AdminOrder,
} from "./types";

import {
  getCloudinaryImageUrl,
} from "@/lib/cloudinary";

type OrderTableProps = {
  orders: AdminOrder[];

  onView: (
    order: AdminOrder,
  ) => void;
};

export default function OrderTable({
  orders,
  onView,
}: OrderTableProps) {
  return (
    <>
      {/* DESKTOP TABLE */}
      <div
        className="
          hidden
          overflow-hidden
          rounded-lg
          border
          border-[var(--admin-card-border)]
          bg-[var(--admin-card-bg)]
          shadow-[var(--admin-card-shadow)]
          sm:rounded-xl
          md:block
        "
      >
        <div
          className="
            max-h-[520px]
            overflow-auto
          "
        >
          <table
            className="
              min-w-[980px]
              w-full
              border-collapse
            "
          >
            <thead className="sticky top-0 z-10">
              <tr
                className="
                  border-b
                  border-[var(--admin-table-border)]
                  bg-[var(--admin-table-header-bg)]
                "
              >
                <HeaderCell>
                  Customer
                </HeaderCell>

                <HeaderCell>
                  Order
                </HeaderCell>

                <HeaderCell>
                  Total
                </HeaderCell>

                <HeaderCell>
                  Payment
                </HeaderCell>

                <HeaderCell>
                  Payment Status
                </HeaderCell>

                <HeaderCell>
                  Order Status
                </HeaderCell>

                <HeaderCell>
                  Created
                </HeaderCell>

                <HeaderCell align="right">
                  View
                </HeaderCell>
              </tr>
            </thead>

            <tbody
              className="
                bg-[var(--admin-table-bg)]
              "
            >
              {orders.map(
                (order) => (
                  <OrderRow
                    key={
                      order.id
                    }
                    order={order}
                    onView={
                      onView
                    }
                  />
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE ORDER LIST */}
      <div
        className="
          space-y-1.5
          md:hidden
        "
      >
        {orders.map(
          (order) => {
const customerName =
  [
    order.user.firstName,
    order.user.lastName,
  ]
    .filter(Boolean)
    .join(" ") ||
  "Unknown customer";

const avatarUrl =
  getCloudinaryImageUrl(
    order.user.avatarKey,
    "c_fill,w_160,h_160,f_auto,q_auto",
  );

            return (
              <button
                key={
                  order.id
                }
                type="button"
                onClick={() =>
                  onView(order)
                }
                aria-label={`View order ${order.orderNumber}`}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-[var(--admin-table-border)]
                  bg-[var(--admin-table-bg)]
                  px-3
                  py-3
                  text-left
                  transition
                  duration-200
                  active:scale-[0.99]
                  hover:bg-[var(--admin-table-row-hover)]
                "
              >
<div
  className="
    relative
    h-9
    w-9
    shrink-0
    overflow-hidden
    rounded-full
    border
    border-[var(--admin-table-border)]
    bg-[var(--admin-surface-bg)]
  "
>
{avatarUrl ? (
  <img
    src={avatarUrl}
    alt={customerName}
    className="
      h-full
      w-full
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
        text-[10px]
        font-semibold
        text-[var(--admin-muted)]
      "
    >
      {customerName.charAt(0).toUpperCase()}
    </div>
  )}
</div>

<div
  className="
    min-w-0
    flex-1
  "
>
  <div
    className="
      flex
      min-w-0
      items-center
      gap-2
    "
  >
    <p
      className="
        min-w-0
        truncate
        text-[13px]
        font-semibold
        text-[var(--admin-table-title)]
      "
    >
      {customerName}
    </p>

    <StatusPill
      value={order.status}
      tone={getOrderTone(
        order.status,
      )}
    />
  </div>

  <p
    className="
      mt-0.5
      truncate
      text-[9px]
      leading-4
      text-[var(--admin-table-muted)]
    "
  >
    {order.orderNumber}
  </p>
</div>

                <ChevronRight
                  className="
                    h-4
                    w-4
                    shrink-0
                    text-[var(--admin-muted)]
                  "
                />
              </button>
            );
          },
        )}
      </div>
    </>
  );
}

type OrderRowProps = {
  order: AdminOrder;

  onView: (
    order: AdminOrder,
  ) => void;
};

function OrderRow({
  order,
  onView,
}: OrderRowProps) {
  const customerName =
    [
      order.user.firstName,
      order.user.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    "Unknown customer";

const avatarUrl =
  getCloudinaryImageUrl(
    order.user.avatarKey,
    "c_fill,w_160,h_160,f_auto,q_auto",
  );

  const canReview =
    order.paymentMethod ===
      "CRYPTO" &&
    order.paymentStatus ===
      "PENDING" &&
    order.cryptoDeposit !==
      null;

  return (
<tr
  className="
    border-b
    border-[var(--admin-table-border)]
    transition-colors
    duration-200
    hover:bg-[var(--admin-table-row-hover)]
  "
>
  {/* CUSTOMER */}
  <td
    className="
      px-2.5
      py-2.5
      sm:px-4
      sm:py-3.5
    "
  >
    <div className="flex items-center gap-2.5">
      <div
        className="
          relative
          h-8
          w-8
          shrink-0
          overflow-hidden
          rounded-full
          border
          border-[var(--admin-table-border)]
          bg-[var(--admin-surface-bg)]
        "
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={customerName}
            className="
              h-full
              w-full
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
              text-[9px]
              font-semibold
              text-[var(--admin-muted)]
            "
          >
            {customerName
              .charAt(0)
              .toUpperCase()}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div
          className="
            truncate
            text-[10px]
            font-semibold
            text-[var(--admin-table-title)]
            sm:text-xs
          "
        >
          {customerName}
        </div>

        <div
          className="
            mt-0.5
            max-w-[210px]
            truncate
            text-[8px]
            text-[var(--admin-table-muted)]
            sm:text-[10px]
          "
        >
          {order.user.email}
        </div>
      </div>
    </div>
  </td>

  {/* ORDER */}
  <td
    className="
      px-2.5
      py-2.5
      sm:px-4
      sm:py-3.5
    "
  >
    <div
      className="
        text-[10px]
        font-semibold
        text-[var(--admin-table-title)]
        sm:text-xs
      "
    >
      {order.orderNumber}
    </div>

    {order.cryptoDeposit && (
      <div
        className="
          mt-0.5
          text-[8px]
          text-[var(--admin-table-muted)]
          sm:text-[10px]
        "
      >
        {order.cryptoDeposit.reference}
      </div>
    )}
  </td>

  {/* TOTAL */}
  <td
    className="
      whitespace-nowrap
      px-2.5
      py-2.5
      text-[10px]
      font-semibold
      text-[var(--admin-table-title)]
      sm:px-4
      sm:py-3.5
      sm:text-xs
    "
  >
    $
    {Number(
      order.total,
    ).toLocaleString(
      undefined,
      {
        minimumFractionDigits:
          2,
        maximumFractionDigits:
          2,
      },
    )}
  </td>

      <td
        className="
          px-2.5
          py-2.5
          sm:px-4
          sm:py-3.5
        "
      >
        <StatusPill
          value={
            order.paymentMethod ===
            "CRYPTO"
              ? "Crypto"
              : "Wallet"
          }
          tone={
            order.paymentMethod ===
            "CRYPTO"
              ? "info"
              : "neutral"
          }
        />
      </td>

      <td
        className="
          px-2.5
          py-2.5
          sm:px-4
          sm:py-3.5
        "
      >
        <StatusPill
          value={
            order.paymentStatus
          }
          tone={getPaymentTone(
            order.paymentStatus,
          )}
        />
      </td>

      <td
        className="
          px-2.5
          py-2.5
          sm:px-4
          sm:py-3.5
        "
      >
        <StatusPill
          value={
            order.status
          }
          tone={getOrderTone(
            order.status,
          )}
        />
      </td>

      <td
        className="
          whitespace-nowrap
          px-2.5
          py-2.5
          text-[9px]
          text-[var(--admin-table-muted)]
          sm:px-4
          sm:py-3.5
          sm:text-[11px]
        "
      >
        {formatDate(
          order.createdAt,
        )}
      </td>

      <td
        className="
          px-2.5
          py-2.5
          text-right
          sm:px-4
          sm:py-3.5
        "
      >
        <button
          type="button"
          onClick={() =>
            onView(order)
          }
          aria-label={`View order ${order.orderNumber}`}
          title={
            canReview
              ? "View order and review payment"
              : "View order"
          }
          className="
            inline-flex
            h-7
            w-7
            items-center
            justify-center
            rounded-md
            border
            border-[var(--admin-card-border)]
            bg-[var(--admin-card-bg)]
            text-[var(--admin-muted)]
            transition-all
            duration-200
            hover:border-[var(--primary)]
            hover:text-[var(--primary)]
            focus:outline-none
            focus:ring-2
            focus:ring-[var(--primary)]
            focus:ring-offset-2
            focus:ring-offset-[var(--admin-table-bg)]
            sm:h-9
            sm:w-9
            sm:rounded-lg
          "
        >
          <Eye
            size={13}
            strokeWidth={2}
            className="
              sm:h-[15px]
              sm:w-[15px]
            "
          />
        </button>
      </td>
    </tr>
  );
}

type HeaderCellProps = {
  children: React.ReactNode;

  align?: "left" | "right";
};

function HeaderCell({
  children,
  align = "left",
}: HeaderCellProps) {
  return (
    <th
      className={`
        px-2.5
        py-2.5
        text-${align}
        text-[8px]
        font-semibold
        uppercase
        tracking-[0.06em]
        text-[var(--admin-table-header-text)]
        sm:px-4
        sm:py-3.5
        sm:text-[10px]
        sm:tracking-[0.08em]
      `}
    >
      {children}
    </th>
  );
}

type StatusTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

type StatusPillProps = {
  value: string;

  tone: StatusTone;
};

function StatusPill({
  value,
  tone,
}: StatusPillProps) {
  const toneClasses: Record<
    StatusTone,
    string
  > = {
    success:
      "border-[var(--admin-badge-success-border)] bg-[var(--admin-badge-success-bg)] text-[var(--admin-badge-success-text)]",

    warning:
      "border-[var(--admin-badge-warning-border)] bg-[var(--admin-badge-warning-bg)] text-[var(--admin-badge-warning-text)]",

    danger:
      "border-[var(--admin-badge-danger-border)] bg-[var(--admin-badge-danger-bg)] text-[var(--admin-badge-danger-text)]",

    info:
      "border-[var(--admin-badge-info-border)] bg-[var(--admin-badge-info-bg)] text-[var(--admin-badge-info-text)]",

    neutral:
      "border-[var(--admin-card-border)] bg-[var(--admin-card-bg)] text-[var(--admin-muted)]",
  };

  return (
    <span
      className={`
        inline-flex
        whitespace-nowrap
        rounded-full
        border
        px-1.5
        py-0.5
        text-[8px]
        font-semibold
        uppercase
        tracking-[0.04em]
        ${toneClasses[tone]}
        sm:px-2
        sm:py-1
        sm:text-[9px]
        sm:tracking-[0.05em]
      `}
    >
      {formatStatusLabel(
        value,
      )}
    </span>
  );
}

function getPaymentTone(
  status: AdminOrder["paymentStatus"],
): StatusTone {
  if (status === "PAID") {
    return "success";
  }

  if (status === "FAILED") {
    return "danger";
  }

  return "warning";
}

function getOrderTone(
  status: AdminOrder["status"],
): StatusTone {
  if (
    status === "PROCESSING" ||
    status === "SHIPPED" ||
    status === "DELIVERED"
  ) {
    return "success";
  }

  if (status === "CANCELLED") {
    return "danger";
  }

  return "warning";
}

function formatStatusLabel(
  value: string,
) {
  return value
    .replaceAll(
      "_",
      " ",
    )
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

function formatDate(
  value: string,
) {
  return new Date(
    value,
  ).toLocaleDateString(
    undefined,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}