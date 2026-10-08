"use client";

import {
  CheckCircle2,
  ChevronDown,
  X,
  XCircle,
} from "lucide-react";

import Image from "next/image";

import {
  useEffect,
  useState,
} from "react";

import type {
  AdminOrder,
} from "./types";

type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "NEAR_DESTINATION"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

type OrderDetailsModalProps = {
  open: boolean;

  order:
    | AdminOrder
    | null;

  loading?: boolean;

  onClose: () => void;

  onApprove: (
    order: AdminOrder,
  ) => Promise<void>;

  onReject: (
    order: AdminOrder,
    reason: string,
  ) => Promise<void>;

  onUpdateStatus: (
    order: AdminOrder,
    status: OrderStatus,
  ) => Promise<void>;
};

const ORDER_STATUS_OPTIONS:
  {
    value: OrderStatus;
    label: string;
  }[] = [
    {
      value: "PENDING",
      label: "Pending",
    },
    {
      value: "PROCESSING",
      label: "Processing",
    },
    {
      value: "NEAR_DESTINATION",
      label: "Near Destination",
    },
    {
      value: "SHIPPED",
      label: "Shipped",
    },
    {
      value: "DELIVERED",
      label: "Delivered",
    },
    {
      value: "CANCELLED",
      label: "Cancelled",
    },
  ];

export default function OrderDetailsModal({
  open,
  order,
  loading = false,
  onClose,
  onApprove,
  onReject,
  onUpdateStatus,
}: OrderDetailsModalProps) {
  const [
    rejectionReason,
    setRejectionReason,
  ] = useState("");

  const [
    showRejectForm,
    setShowRejectForm,
  ] = useState(false);

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState<OrderStatus | "">(
    "",
  );

const [updatingStatus, setUpdatingStatus] =
  useState(false);

const [showStatusDialog, setShowStatusDialog] =
  useState(false);

const [showCancelConfirm, setShowCancelConfirm] =
  useState(false);

const [cancellingOrder, setCancellingOrder] =
  useState(false);

  useEffect(() => {
    if (!open) {
      setRejectionReason("");
      setShowRejectForm(false);
      setSelectedStatus("");
      setUpdatingStatus(false);
      setShowStatusDialog(false);

      return;
    }

    if (order) {
      setSelectedStatus(
        order.status as OrderStatus,
      );
    }
  }, [
    open,
    order,
  ]);

  if (!open || !order) {
    return null;
  }

  const currentOrder =
    order;

  const isCrypto =
    order.paymentMethod ===
    "CRYPTO";

  const canReview =
    isCrypto &&
    order.paymentStatus ===
      "PENDING" &&
    order.cryptoDeposit !==
      null;

  const paymentApproved =
    order.paymentStatus ===
    "PAID";

const canManageStatus =
  paymentApproved &&
  order.status !== "CANCELLED";

const canCancelOrder =
  order.status !==
    "DELIVERED" &&
  order.status !==
    "CANCELLED";

  const customerName =
    [
      order.user.firstName,
      order.user.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    "Unknown customer";

  async function handleApprove() {
    if (
      loading ||
      !canReview
    ) {
      return;
    }

    await onApprove(
      currentOrder,
    );
  }

  async function handleReject() {
    const reason =
      rejectionReason.trim();

    if (
      loading ||
      !canReview
    ) {
      return;
    }

    if (!reason) {
      return;
    }

    await onReject(
      currentOrder,
      reason,
    );
  }

async function handleStatusUpdate() {
  if (
    loading ||
    updatingStatus ||
    !selectedStatus
  ) {
    return;
  }

  const nextStatus =
    selectedStatus as OrderStatus;

  if (
    nextStatus ===
    currentOrder.status
  ) {
    return;
  }

  if (
    nextStatus !==
      "CANCELLED" &&
    !canManageStatus
  ) {
    return;
  }

  if (
    nextStatus ===
      "CANCELLED" &&
    !canCancelOrder
  ) {
    return;
  }

try {
  setUpdatingStatus(true);

  await onUpdateStatus(
    currentOrder,
    nextStatus,
  );

  setShowStatusDialog(false);
} finally {
  setUpdatingStatus(false);
}
}

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-[var(--admin-modal-overlay)]
        p-2
        sm:p-3
      "
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          if (
            !loading &&
            !updatingStatus
          ) {
            onClose();
          }
        }
      }}
    >
<div
  className="
    relative
    flex
    max-h-[96vh]
    w-full
    max-w-2xl
          flex-col
          overflow-hidden
          rounded-lg
          border
          border-[var(--admin-modal-border)]
          bg-[var(--admin-modal-bg)]
          shadow-[var(--admin-modal-shadow)]
          sm:max-h-[92vh]
          sm:rounded-xl
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-details-title"
      >
        <header
          className="
            flex
            items-start
            justify-between
            gap-2
            border-b
            border-[var(--admin-modal-border)]
            bg-[var(--admin-modal-header-bg)]
            px-3
            py-2.5
            sm:gap-3
            sm:px-4
            sm:py-3.5
          "
        >
          <div className="min-w-0">
            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.1em]
                text-[var(--admin-muted)]
                sm:text-[10px]
                sm:tracking-[0.12em]
              "
            >
              Order details
            </p>

            <h2
              id="order-details-title"
              className="
                mt-0.5
                truncate
                text-[12px]
                font-semibold
                text-[var(--admin-title)]
                sm:mt-1
                sm:text-sm
              "
            >
              {order.orderNumber}
            </h2>

            <p
              className="
                mt-0.5
                text-[9px]
                text-[var(--admin-muted)]
                sm:text-[11px]
              "
            >
              {formatDateTime(
                order.createdAt,
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close order details"
            className="
              flex
              h-6
              w-6
              shrink-0
              items-center
              justify-center
              rounded-md
              border
              border-[var(--admin-modal-border)]
              text-[var(--admin-muted)]
              transition
              hover:text-[var(--admin-title)]
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:h-8
              sm:w-8
              sm:rounded-lg
            "
            disabled={
              loading ||
              updatingStatus
            }
          >
            <X
              size={13}
              className="sm:h-4 sm:w-4"
            />
          </button>
        </header>

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            p-2.5
            sm:p-4
          "
        >
          <div
            className="
              grid
              gap-2
              sm:gap-3
              sm:grid-cols-2
            "
          >
            <InfoCard
              label="Customer"
              value={
                customerName
              }
              secondary={
                order.user.email
              }
            />

            <InfoCard
              label="Total"
              value={`$${Number(
                order.total,
              ).toLocaleString(
                undefined,
                {
                  minimumFractionDigits:
                    2,
                  maximumFractionDigits:
                    2,
                },
              )}`}
              secondary={`${order.paymentMethod === "CRYPTO" ? "Crypto" : "Wallet"} payment`}
            />
          </div>

          {order.cryptoDeposit && (
            <section
              className="
                mt-2.5
                rounded-md
                border
                border-[var(--admin-card-border)]
                bg-[var(--admin-card-bg)]
                p-2.5
                sm:mt-3
                sm:rounded-lg
                sm:p-3
              "
            >
              <div
                className="
                  flex
                  flex-wrap
                  items-start
                  justify-between
                  gap-2
                  sm:gap-3
                "
              >
                <div>
                  <p
                    className="
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.07em]
                      text-[var(--admin-muted)]
                      sm:text-[10px]
                      sm:tracking-[0.08em]
                    "
                  >
                    Crypto payment
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[10px]
                      font-semibold
                      text-[var(--admin-title)]
                      sm:mt-1
                      sm:text-xs
                    "
                  >
                    {
                      order
                        .cryptoDeposit
                        .depositMethod
                        .name
                    }
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[9px]
                      text-[var(--admin-muted)]
                      sm:text-[11px]
                    "
                  >
                    {
                      order
                        .cryptoDeposit
                        .depositMethod
                        .symbol
                    }{" "}
                    •{" "}
                    {
                      order
                        .cryptoDeposit
                        .depositMethod
                        .network
                    }
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className="
                      text-[8px]
                      text-[var(--admin-muted)]
                      sm:text-[10px]
                    "
                  >
                    Reference
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[9px]
                      font-medium
                      text-[var(--admin-title)]
                      sm:text-[11px]
                    "
                  >
                    {
                      order
                        .cryptoDeposit
                        .reference
                    }
                  </p>
                </div>
              </div>

              {order.cryptoDeposit.receiptUrl ? (
                <div className="mt-2.5 sm:mt-3">
                  <p
                    className="
                      mb-1.5
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.07em]
                      text-[var(--admin-muted)]
                      sm:mb-2
                      sm:text-[10px]
                      sm:tracking-[0.08em]
                    "
                  >
                    Payment receipt
                  </p>

                  <ReceiptPreview
                    url={
                      order
                        .cryptoDeposit
                        .receiptUrl
                    }
                    name={
                      order
                        .cryptoDeposit
                        .reference
                    }
                  />
                </div>
              ) : (
                <div
                  className="
                    mt-2.5
                    rounded-md
                    border
                    border-[var(--admin-card-border)]
                    bg-[var(--admin-card-bg)]
                    px-2.5
                    py-2
                    text-[9px]
                    text-[var(--admin-muted)]
                    sm:mt-3
                    sm:rounded-lg
                    sm:px-3
                    sm:py-2.5
                    sm:text-[11px]
                  "
                >
                  No receipt was attached.
                </div>
              )}
            </section>
          )}

          <section
            className="
              mt-2.5
              rounded-md
              border
              border-[var(--admin-card-border)]
              bg-[var(--admin-card-bg)]
              p-2.5
              sm:mt-3
              sm:rounded-lg
              sm:p-3
            "
          >
            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.07em]
                text-[var(--admin-muted)]
                sm:text-[10px]
                sm:tracking-[0.08em]
              "
            >
              Delivery
            </p>

            <div
              className="
                mt-1.5
                grid
                gap-x-3
                gap-y-1.5
                sm:mt-2
                sm:gap-x-4
                sm:gap-y-2
                sm:grid-cols-2
              "
            >
              <Detail
                label="Name"
                value={
                  order.deliveryFullName
                }
              />

              <Detail
                label="Phone"
                value={
                  order.deliveryPhoneNumber
                }
              />

              <Detail
                label="Address"
                value={[
                  order.deliveryAddressLine1,
                  order.deliveryAddressLine2,
                ]
                  .filter(Boolean)
                  .join(", ")}
              />

              <Detail
                label="Location"
                value={[
                  order.deliveryCity,
                  order.deliveryState,
                  order.deliveryCountry,
                  order.deliveryPostalCode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              />
            </div>
          </section>

          <section
            className="
              mt-2.5
              rounded-md
              border
              border-[var(--admin-card-border)]
              bg-[var(--admin-card-bg)]
              p-2.5
              sm:mt-3
              sm:rounded-lg
              sm:p-3
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-2
                sm:gap-3
              "
            >
              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.07em]
                  text-[var(--admin-muted)]
                  sm:text-[10px]
                  sm:tracking-[0.08em]
                "
              >
                Items
              </p>

              <p
                className="
                  text-[8px]
                  text-[var(--admin-muted)]
                  sm:text-[10px]
                "
              >
                {order.items.length}{" "}
                {order.items.length ===
                1
                  ? "item"
                  : "items"}
              </p>
            </div>

            <div
              className="
                mt-1.5
                divide-y
                divide-[var(--admin-table-border)]
                sm:mt-2
              "
            >
              {order.items.map(
                (item) => (
                  <div
                    key={
                      item.id
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      py-2
                      sm:gap-3
                      sm:py-2.5
                    "
                  >
                    <div
                      className="
                        relative
                        h-8
                        w-8
                        shrink-0
                        overflow-hidden
                        rounded
                        border
                        border-[var(--admin-card-border)]
                        bg-[var(--admin-table-header-bg)]
                        sm:h-10
                        sm:w-10
                        sm:rounded-md
                      "
                    >
                      {item.primaryImage ? (
                        <Image
                          src={
                            item.primaryImage
                          }
                          alt={
                            item.productName
                          }
                          fill
                          sizes="40px"
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
                            text-[7px]
                            text-[var(--admin-muted)]
                            sm:text-[8px]
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
                          text-[10px]
                          font-semibold
                          text-[var(--admin-title)]
                          sm:text-xs
                        "
                      >
                        {
                          item.productName
                        }
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[8px]
                          text-[var(--admin-muted)]
                          sm:text-[10px]
                        "
                      >
                        Qty{" "}
                        {
                          item.quantity
                        }

                        {item.selectedSize &&
                          ` • ${item.selectedSize}`}

                        {item.selectedColor &&
                          ` • ${item.selectedColor}`}
                      </p>
                    </div>

                    <p
                      className="
                        shrink-0
                        text-[10px]
                        font-semibold
                        text-[var(--admin-title)]
                        sm:text-xs
                      "
                    >
                      $
                      {Number(
                        item.totalPrice,
                      ).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits:
                            2,
                          maximumFractionDigits:
                            2,
                        },
                      )}
                    </p>
                  </div>
                ),
              )}
            </div>
          </section>

          <section
            className="
              mt-2.5
              rounded-md
              border
              border-[var(--admin-card-border)]
              bg-[var(--admin-card-bg)]
              p-2.5
              sm:mt-3
              sm:rounded-lg
              sm:p-3
            "
          >
            <SummaryRow
              label="Subtotal"
              value={`$${Number(
                order.subtotal,
              ).toLocaleString(
                undefined,
                {
                  minimumFractionDigits:
                    2,
                  maximumFractionDigits:
                    2,
                },
              )}`}
            />

            <SummaryRow
              label="Discount"
              value={`$${Number(
                order.discount,
              ).toLocaleString(
                undefined,
                {
                  minimumFractionDigits:
                    2,
                  maximumFractionDigits:
                    2,
                },
              )}`}
            />

            <div
              className="
                mt-1.5
                border-t
                border-[var(--admin-table-border)]
                pt-1.5
                sm:mt-2
                sm:pt-2
              "
            >
              <SummaryRow
                label="Total"
                value={`$${Number(
                  order.total,
                ).toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits:
                      2,
                    maximumFractionDigits:
                      2,
                  },
                )}`}
                strong
              />
            </div>
          </section>

          {order.notes && (
            <section
              className="
                mt-2.5
                rounded-md
                border
                border-[var(--admin-card-border)]
                bg-[var(--admin-card-bg)]
                px-2.5
                py-2
                sm:mt-3
                sm:rounded-lg
                sm:px-3
                sm:py-2.5
              "
            >
              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.07em]
                  text-[var(--admin-muted)]
                  sm:text-[10px]
                  sm:tracking-[0.08em]
                "
              >
                Customer note
              </p>

              <p
                className="
                  mt-0.5
                  whitespace-pre-wrap
                  text-[10px]
                  leading-4
                  text-[var(--admin-title)]
                  sm:mt-1
                  sm:text-xs
                  sm:leading-5
                "
              >
                {
                  order.notes
                }
              </p>
            </section>
          )}

          {canReview &&
            showRejectForm && (
              <section
                className="
                  mt-2.5
                  rounded-md
                  border
                  border-[var(--admin-badge-danger-border)]
                  bg-[var(--admin-badge-danger-bg)]
                  p-2.5
                  sm:mt-3
                  sm:rounded-lg
                  sm:p-3
                "
              >
                <label
                  className="
                    block
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.07em]
                    text-[var(--admin-muted)]
                    sm:text-[10px]
                    sm:tracking-[0.08em]
                  "
                >
                  Rejection reason
                </label>

                <textarea
                  value={
                    rejectionReason
                  }
                  onChange={(
                    event,
                  ) =>
                    setRejectionReason(
                      event.target
                        .value,
                    )
                  }
                  maxLength={1000}
                  rows={3}
                  placeholder="Enter the reason for rejecting this payment."
                  className="
                    mt-1.5
                    w-full
                    resize-none
                    rounded-md
                    border
                    border-[var(--admin-input-border)]
                    bg-[var(--admin-input-bg)]
                    px-2.5
                    py-2
                    text-[10px]
                    text-[var(--admin-input-text)]
                    placeholder:text-[var(--admin-input-placeholder)]
                    outline-none
                    focus:border-[var(--admin-input-focus)]
                    sm:mt-2
                    sm:rounded-lg
                    sm:px-3
                    sm:py-2.5
                    sm:text-xs
                  "
                />

                <div
                  className="
                    mt-1.5
                    flex
                    justify-end
                    gap-1.5
                    sm:mt-2
                    sm:gap-2
                  "
                >
                  <button
                    type="button"
                    disabled={
                      loading
                    }
                    onClick={() =>
                      setShowRejectForm(
                        false,
                      )
                    }
                    className="
                      h-7
                      rounded-md
                      border
                      border-[var(--admin-card-border)]
                      px-2.5
                      text-[9px]
                      font-medium
                      text-[var(--admin-muted)]
                      transition
                      hover:text-[var(--admin-title)]
                      disabled:opacity-50
                      sm:h-8
                      sm:rounded-lg
                      sm:px-3
                      sm:text-xs
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={
                      loading ||
                      !rejectionReason.trim()
                    }
                    onClick={() =>
                      void handleReject()
                    }
                    className="
                      h-7
                      rounded-md
                      border
                      border-[var(--admin-badge-danger-border)]
                      bg-[var(--admin-badge-danger-bg)]
                      px-2.5
                      text-[9px]
                      font-semibold
                      text-[var(--admin-badge-danger-text)]
                      transition
                      hover:opacity-90
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      sm:h-8
                      sm:rounded-lg
                      sm:px-3
                      sm:text-xs
                    "
                  >
                    {loading
                      ? "Rejecting..."
                      : "Confirm rejection"}
                  </button>
                </div>
              </section>
            )}

{(canManageStatus ||
  canCancelOrder) && (
  <section
    className="
      mt-2.5
      rounded-md
      border
      border-[var(--admin-card-border)]
      bg-[var(--admin-card-bg)]
      p-2.5
      sm:mt-3
      sm:rounded-lg
      sm:p-3
    "
  >
    <div
      className="
        flex
        flex-wrap
        items-center
        justify-between
        gap-2
        sm:gap-3
      "
    >
      <div>
        <p
          className="
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.07em]
            text-[var(--admin-muted)]
            sm:text-[10px]
            sm:tracking-[0.08em]
          "
        >
          Order management
        </p>

        <p
          className="
            mt-0.5
            text-[9px]
            text-[var(--admin-muted)]
            sm:text-[11px]
          "
        >
          Manage the order's
          fulfilment status or
          cancellation.
        </p>
      </div>

      <span
        className="
          rounded-full
          border
          border-[var(--admin-card-border)]
          bg-[var(--admin-table-header-bg)]
          px-1.5
          py-0.5
          text-[8px]
          font-semibold
          uppercase
          tracking-[0.05em]
          text-[var(--admin-title)]
          sm:px-2
          sm:py-1
          sm:text-[9px]
          sm:tracking-[0.06em]
        "
      >
        {formatStatusLabel(
          order.status,
        )}
      </span>
    </div>



    {canCancelOrder && (
      <div
        className="
          mt-2
          flex
          items-center
          justify-between
          gap-3
          rounded-md
          border
          border-[var(--admin-badge-danger-border)]
          bg-[var(--admin-badge-danger-bg)]
          px-2.5
          py-2
          sm:mt-3
          sm:rounded-lg
          sm:px-3
          sm:py-2.5
        "
      >
        <div className="min-w-0">
          <p
            className="
              text-[9px]
              font-semibold
              text-[var(--admin-badge-danger-text)]
              sm:text-[10px]
            "
          >
            Cancel this order
          </p>

          <p
            className="
              mt-0.5
              text-[8px]
              leading-3.5
              text-[var(--admin-muted)]
              sm:text-[10px]
              sm:leading-4
            "
          >
            This action will cancel
            the order and return any
            eligible payment to the
            customer's wallet.
          </p>
        </div>

<div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
  {canManageStatus && (
    <button
      type="button"
      disabled={
        loading ||
        updatingStatus ||
        cancellingOrder
      }
      onClick={() => {
        setSelectedStatus(
          currentOrder.status as OrderStatus,
        );
        setShowStatusDialog(true);
      }}
      className="
        inline-flex
        h-8
        shrink-0
        items-center
        justify-center
        gap-1.5
        rounded-md
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-table-header-bg)]
        px-3
        text-[9px]
        font-semibold
        text-[var(--admin-title)]
        transition
        hover:opacity-90
        disabled:cursor-not-allowed
        disabled:opacity-50
        sm:h-9
        sm:rounded-lg
        sm:px-3.5
        sm:text-xs
      "
    >
      Update status
    </button>
  )}

  <button
    type="button"
    disabled={
      loading ||
      updatingStatus
    }
    onClick={() =>
      setShowCancelConfirm(true)
    }
    className="
      inline-flex
      h-8
      shrink-0
      items-center
      justify-center
      gap-1.5
      rounded-md
      border
      border-[var(--admin-badge-danger-border)]
      bg-[var(--admin-badge-danger-bg)]
      px-3
      text-[9px]
      font-semibold
      text-[var(--admin-badge-danger-text)]
      transition
      hover:opacity-90
      disabled:cursor-not-allowed
      disabled:opacity-50
      sm:h-9
      sm:rounded-lg
      sm:px-3.5
      sm:text-xs
    "
  >
    <XCircle
      size={12}
      className="sm:h-3.5 sm:w-3.5"
    />

    {updatingStatus
      ? "Cancelling..."
      : "Cancel order"}
  </button>
</div>
</div>
    )}
      </section>
    )}


{showStatusDialog && (
  <div
    className="
      absolute
      inset-0
      z-50
      flex
      items-center
      justify-center
      rounded-lg
      bg-black/55
      p-4
      backdrop-blur-[3px]
    "
    onMouseDown={(event) => {
      if (
        event.target ===
        event.currentTarget
      ) {
        if (!updatingStatus) {
          setShowStatusDialog(false);
        }
      }
    }}
  >
    <div
      className="
        w-full
        max-w-[360px]
        overflow-hidden
        rounded-xl
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-card-bg)]
        shadow-2xl
      "
    >
      <div className="px-4 pt-4 sm:px-5 sm:pt-5">
        <p
          className="
            text-xs
            font-semibold
            tracking-[-0.01em]
            text-[var(--admin-title)]
            sm:text-[13px]
          "
        >
          Update order status
        </p>

        <p
          className="
            mt-1
            text-[10px]
            leading-4
            text-[var(--admin-muted)]
            sm:text-[11px]
          "
        >
          Select the new fulfilment status for{" "}
          <span className="font-medium text-[var(--admin-title)]">
            {currentOrder.orderNumber}
          </span>
          .
        </p>
      </div>

      <div className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
        <label
          className="
            block
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.07em]
            text-[var(--admin-muted)]
            sm:text-[10px]
            sm:tracking-[0.08em]
          "
        >
          Order status
        </label>

        <div className="relative mt-1.5">
          <select
            value={selectedStatus}
            disabled={
              loading ||
              updatingStatus
            }
            onChange={(event) =>
              setSelectedStatus(
                event.target.value as OrderStatus,
              )
            }
            className="
              h-9
              w-full
              appearance-none
              rounded-md
              border
              border-[var(--admin-input-border)]
              bg-[var(--admin-input-bg)]
              px-2.5
              pr-8
              text-[10px]
              font-medium
              text-[var(--admin-input-text)]
              outline-none
              transition
              focus:border-[var(--admin-input-focus)]
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:h-10
              sm:rounded-lg
              sm:px-3
              sm:pr-9
              sm:text-xs
            "
          >
            {ORDER_STATUS_OPTIONS
              .filter(
                (option) =>
                  option.value !==
                  "CANCELLED",
              )
              .map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
          </select>

          <ChevronDown
            size={13}
            className="
              pointer-events-none
              absolute
              right-2.5
              top-1/2
              -translate-y-1/2
              text-[var(--admin-muted)]
              sm:right-3
            "
          />
        </div>

        <div className="mt-3 flex justify-end gap-1.5 sm:gap-2">
          <button
            type="button"
            disabled={updatingStatus}
            onClick={() =>
              setShowStatusDialog(false)
            }
            className="
              inline-flex
              h-8
              items-center
              justify-center
              rounded-md
              border
              border-[var(--admin-card-border)]
              bg-[var(--admin-table-header-bg)]
              px-3
              text-[9px]
              font-semibold
              text-[var(--admin-title)]
              transition
              hover:opacity-90
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:h-9
              sm:rounded-lg
              sm:px-3.5
              sm:text-xs
            "
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={
              loading ||
              updatingStatus ||
              !selectedStatus ||
              selectedStatus ===
                currentOrder.status
            }
            onClick={() =>
              void handleStatusUpdate()
            }
            className="
              inline-flex
              h-8
              items-center
              justify-center
              rounded-md
              bg-[var(--admin-badge-success-bg)]
              px-3
              text-[9px]
              font-semibold
              text-[var(--admin-badge-success-text)]
              transition
              hover:opacity-90
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:h-9
              sm:rounded-lg
              sm:px-3.5
              sm:text-xs
            "
          >
            {updatingStatus
              ? "Updating..."
              : "Update status"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}


{showCancelConfirm && (
  <div
    className="
      absolute
      inset-0
      z-50
      flex
      items-center
      justify-center
      rounded-lg
      bg-black/55
      p-4
      backdrop-blur-[3px]
    "
  >
    <div
      className="
        w-full
        max-w-[360px]
        overflow-hidden
        rounded-xl
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-card-bg)]
        shadow-2xl
      "
    >
      {/* Header */}
      <div className="px-4 pt-4 sm:px-5 sm:pt-5">
        <div className="flex items-start gap-3">
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-red-500/25
              bg-red-500/[0.10]
              text-red-400
            "
          >
            <XCircle
              size={18}
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0 pt-0.5">
            <p
              className="
                text-xs
                font-semibold
                tracking-[-0.01em]
                text-[var(--admin-title)]
                sm:text-[13px]
              "
            >
              Cancel this order?
            </p>

            <p
              className="
                mt-1
                text-[10px]
                leading-4
                text-[var(--admin-muted)]
                sm:text-[11px]
              "
            >
              You are about to cancel order{" "}
              <span className="font-medium text-[var(--admin-title)]">
                {order.orderNumber}
              </span>
              .
            </p>
          </div>
        </div>

        {/* Warning */}
        <div
          className="
            mt-4
            rounded-lg
            border
            border-red-500/20
            bg-red-500/[0.055]
            px-3
            py-2.5
          "
        >
          <p
            className="
              text-[10px]
              leading-4
              text-[var(--admin-muted)]
              sm:text-[11px]
            "
          >
            This action will cancel the order and, where
            applicable, return the full payment to the
            customer&apos;s wallet.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div
        className="
          mt-4
          flex
          items-center
          justify-end
          gap-2
          border-t
          border-[var(--admin-card-border)]
          bg-black/[0.08]
          px-4
          py-3
          sm:px-5
        "
      >
        <button
          type="button"
          disabled={updatingStatus}
          onClick={() =>
            setShowCancelConfirm(false)
          }
          className="
            h-8
            rounded-md
            border
            border-[var(--admin-input-border)]
            bg-[var(--admin-input-bg)]
            px-3
            text-[10px]
            font-semibold
            text-[var(--admin-muted)]
            transition
            hover:border-[var(--admin-card-border)]
            hover:text-[var(--admin-title)]
            disabled:cursor-not-allowed
            disabled:opacity-50
            sm:h-9
            sm:px-3.5
            sm:text-[11px]
          "
        >
          Keep order
        </button>

<button
  type="button"
  disabled={
    updatingStatus ||
    cancellingOrder
  }
  onClick={async () => {
    try {
      setCancellingOrder(true);

      await onUpdateStatus(
        order,
        "CANCELLED",
      );

      setShowCancelConfirm(false);
    } catch {

    } finally {
      setCancellingOrder(false);
    }
  }}
  className="
    h-8
    rounded-md
    border
    border-red-500/25
    bg-red-500/[0.11]
    px-3
    text-[10px]
    font-semibold
    text-red-400
    transition
    hover:border-red-500/35
    hover:bg-red-500/[0.16]
    hover:text-red-300
    disabled:cursor-not-allowed
    disabled:opacity-50
    sm:h-9
    sm:px-3.5
    sm:text-[11px]
  "
>
  {cancellingOrder
    ? "Cancelling..."
    : "Cancel order"}
</button>
      </div>
    </div>
  </div>
)}


      </div>

      {canReview && (
          <footer
            className="
              flex
              flex-col-reverse
              gap-1.5
              border-t
              border-[var(--admin-modal-border)]
              bg-[var(--admin-modal-footer-bg)]
              p-2.5
              sm:gap-2
              sm:p-3
              sm:flex-row
              sm:justify-end
            "
          >
            {!showRejectForm && (
              <button
                type="button"
                disabled={
                  loading
                }
                onClick={() =>
                  setShowRejectForm(
                    true,
                  )
                }
                className="
                  inline-flex
                  h-7
                  items-center
                  justify-center
                  gap-1.5
                  rounded-md
                  border
                  border-[var(--admin-badge-danger-border)]
                  bg-[var(--admin-badge-danger-bg)]
                  px-2.5
                  text-[9px]
                  font-semibold
                  text-[var(--admin-badge-danger-text)]
                  transition
                  hover:opacity-90
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:h-9
                  sm:gap-2
                  sm:rounded-lg
                  sm:px-3
                  sm:text-xs
                "
              >
                <XCircle
                  size={12}
                  className="sm:h-3.5 sm:w-3.5"
                />

                Reject
              </button>
            )}

            <button
              type="button"
              disabled={
                loading
              }
              onClick={() =>
                void handleApprove()
              }
              className="
                inline-flex
                h-7
                items-center
                justify-center
                gap-1.5
                rounded-md
                bg-[var(--admin-badge-success-bg)]
                px-2.5
                text-[9px]
                font-semibold
                text-[var(--admin-badge-success-text)]
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:h-9
                sm:gap-2
                sm:rounded-lg
                sm:px-3
                sm:text-xs
              "
            >
              <CheckCircle2
                size={12}
                className="sm:h-3.5 sm:w-3.5"
              />

              {loading
                ? "Processing..."
                : "Approve"}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}

type InfoCardProps = {
  label: string;

  value: string;

  secondary?: string;
};

function InfoCard({
  label,
  value,
  secondary,
}: InfoCardProps) {
  return (
    <div
      className="
        rounded-md
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-card-bg)]
        px-2.5
        py-2
        sm:rounded-lg
        sm:px-3
        sm:py-2.5
      "
    >
      <p
        className="
          text-[8px]
          font-semibold
          uppercase
          tracking-[0.07em]
          text-[var(--admin-muted)]
          sm:text-[10px]
          sm:tracking-[0.08em]
        "
      >
        {label}
      </p>

      <p
        className="
          mt-0.5
          truncate
          text-[10px]
          font-semibold
          text-[var(--admin-title)]
          sm:mt-1
          sm:text-xs
        "
      >
        {value}
      </p>

      {secondary && (
        <p
          className="
            mt-0.5
            truncate
            text-[8px]
            text-[var(--admin-muted)]
            sm:text-[10px]
          "
        >
          {secondary}
        </p>
      )}
    </div>
  );
}

type DetailProps = {
  label: string;

  value:
    | string
    | null
    | undefined;
};

function Detail({
  label,
  value,
}: DetailProps) {
  return (
    <div className="min-w-0">
      <p
        className="
          text-[8px]
          font-medium
          uppercase
          tracking-[0.07em]
          text-[var(--admin-muted)]
          sm:text-[10px]
          sm:tracking-[0.08em]
        "
      >
        {label}
      </p>

      <p
        className="
          mt-0.5
          break-words
          text-[10px]
          font-medium
          text-[var(--admin-title)]
          sm:text-xs
        "
      >
        {value ||
          "Not provided"}
      </p>
    </div>
  );
}

type SummaryRowProps = {
  label: string;

  value: string;

  strong?: boolean;
};

function SummaryRow({
  label,
  value,
  strong = false,
}: SummaryRowProps) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-2
        sm:gap-3
      "
    >
      <span
        className="
          text-[10px]
          text-[var(--admin-muted)]
          sm:text-xs
        "
      >
        {label}
      </span>

      <span
        className={
          strong
            ? "text-[11px] font-bold text-[var(--admin-title)] sm:text-sm"
            : "text-[10px] font-medium text-[var(--admin-title)] sm:text-xs"
        }
      >
        {value}
      </span>
    </div>
  );
}

function ReceiptPreview({
  url,
  name,
}: {
  url: string;
  name: string;
}) {
  const isPdf =
    /\.pdf(?:$|\?)/i.test(
      url,
    );

  if (isPdf) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="
          flex
          items-center
          justify-center
          rounded-md
          border
          border-[var(--admin-card-border)]
          bg-[var(--admin-table-header-bg)]
          px-3
          py-6
          text-[10px]
          font-medium
          text-[var(--primary)]
          transition
          hover:opacity-80
          sm:rounded-lg
          sm:px-4
          sm:py-8
          sm:text-xs
        "
      >
        Open payment receipt
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        block
        overflow-hidden
        rounded-md
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-table-header-bg)]
        sm:rounded-lg
      "
    >
      <div
        className="
          relative
          mx-auto
          aspect-[16/10]
          max-h-[220px]
          w-full
          sm:max-h-[280px]
        "
      >
        <Image
          src={url}
          alt={`Payment receipt ${name}`}
          fill
          sizes="(max-width: 640px) 90vw, 640px"
          className="
            object-contain
            p-1.5
            sm:p-2
          "
        />
      </div>
    </a>
  );
}

function formatStatusLabel(
  status:
    | string
    | null
    | undefined,
) {
  if (!status) {
    return "Unknown";
  }

  return status
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

function formatDateTime(
  value: string,
) {
  return new Date(
    value,
  ).toLocaleString(
    undefined,
    {
      dateStyle:
        "medium",
      timeStyle:
        "short",
    },
  );
}