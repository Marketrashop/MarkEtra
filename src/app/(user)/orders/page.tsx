"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Image from "next/image";

import {
  ChevronDown,
  Loader2,
  Package,
  Search,
  X,
  XCircle,
} from "lucide-react";

import {
  toast,
} from "sonner";

import DashboardPageLayout from "@/components/dashboard/DashboardPage";
import { PageHeader } from "@/components/dashboard";

type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

type OrderPaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED";

type PaymentMethod =
  | "WALLET"
  | "CRYPTO";

type OrderItem = {
  id: string;

  productId: string;

  variantSizeId:
    | string
    | null;

  quantity: number;

  unitPrice: string;

  totalPrice: string;

  selectedColor:
    | string
    | null;

  selectedSize:
    | string
    | null;

  product: {
    id: string;

    name: string;

    slug: string;

    primaryImage:
      | string
      | null;
  };
};

type Order = {
  id: string;

  orderNumber: string;

  subtotal: string;

  discount: string;

  total: string;

  paymentMethod: PaymentMethod;

  paymentStatus:
    OrderPaymentStatus;

  status: OrderStatus;

  walletTransactionId:
    | string
    | null;

  cryptoDepositId:
    | string
    | null;

  paidAt:
    | string
    | null;

  createdAt: string;

  updatedAt: string;

  notes:
    | string
    | null;

  delivery: {
    fullName:
      | string
      | null;

    phoneNumber:
      | string
      | null;

    alternatePhoneNumber:
      | string
      | null;

    addressLine1:
      | string
      | null;

    addressLine2:
      | string
      | null;

    city:
      | string
      | null;

    state:
      | string
      | null;

    country:
      | string
      | null;

    postalCode:
      | string
      | null;
  };

  cryptoDeposit: {
    id: string;

    reference: string;

    amount: string;

    receiptUrl:
      | string
      | null;

    status:
      | "PENDING"
      | "APPROVED"
      | "REJECTED";

    depositMethod: {
      id: string;

      name: string;

      symbol: string;

      network: string;

      iconKey:
        | string
        | null;
    };
  } | null;

  items: OrderItem[];
};

type OrdersResponse = {
  success: boolean;

  data: Order[];
};

const STATUS_OPTIONS: {
  value:
    | "ALL"
    | OrderStatus;

  label: string;
}[] = [
  {
    value: "ALL",
    label: "All orders",
  },
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "PROCESSING",
    label: "Processing",
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

export default function OrdersPage() {
  const [
    orders,
    setOrders,
  ] = useState<Order[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState<
    "ALL" | OrderStatus
  >("ALL");

const [
  selectedOrder,
  setSelectedOrder,
] = useState<Order | null>(null);

const [
  cancellingOrderId,
  setCancellingOrderId,
] = useState<string | null>(
  null,
);

const [
  cancelConfirmationOrder,
  setCancelConfirmationOrder,
] =
  useState<Order | null>(null);

const [
  currentTime,
  setCurrentTime,
] = useState(() => Date.now());

  const loadOrders =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const params =
            new URLSearchParams();

          if (
            search.trim()
          ) {
            params.set(
              "search",
              search.trim(),
            );
          }

          if (
            status !== "ALL"
          ) {
            params.set(
              "status",
              status,
            );
          }

          const query =
            params.toString();

          const response =
            await fetch(
              query
                ? `/api/orders?${query}`
                : "/api/orders",
              {
                cache:
                  "no-store",
              },
            );

          const result: OrdersResponse =
            await response.json();

          if (
            !response.ok ||
            !result.success
          ) {
            throw new Error(
              "Unable to load orders.",
            );
          }

          setOrders(
            result.data,
          );
        } catch (error) {
          console.error(
            error,
          );

          const message =
            error instanceof Error
              ? error.message
              : "Unable to load orders.";

          setError(
            message,
          );

          toast.error(
            message,
          );
        } finally {
          setLoading(false);
        }
      },
      [
        search,
        status,
      ],
    );

  useEffect(() => {
    const timeout =
      window.setTimeout(
        () => {
          void loadOrders();
        },
        250,
      );

    return () =>
      window.clearTimeout(
        timeout,
      );
  }, [loadOrders]);

useEffect(() => {
  const interval =
    window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 30_000);

  return () =>
    window.clearInterval(
      interval,
    );
}, []);

  const totalOrders =
    useMemo(
      () => orders.length,
      [orders],
    );

function openOrderDetails(
  order: Order,
) {
  setSelectedOrder(order);
}

async function cancelOrder(
  order: Order,
) {
  if (cancellingOrderId) {
    return;
  }

  const cancellationState =
    getCancellationState(
      order,
      currentTime,
    );

  if (
    !cancellationState.canCancel
  ) {
    toast.error(
      cancellationState.reason,
    );

    return;
  }

setSelectedOrder(null);

setCancelConfirmationOrder(
  order,
);
}

async function confirmCancelOrder() {
  if (
    !cancelConfirmationOrder ||
    cancellingOrderId
  ) {
    return;
  }

  const order =
    cancelConfirmationOrder;

  setCancellingOrderId(
    order.id,
  );

  try {
    const response =
      await fetch(
        `/api/orders/${order.id}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
        },
      );

    const result =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.error ??
          "Unable to cancel order.",
      );
    }

    setOrders(
      (currentOrders) =>
        currentOrders.map(
          (currentOrder) =>
            currentOrder.id ===
            order.id
              ? {
                  ...currentOrder,
                  status:
                    "CANCELLED",
                }
              : currentOrder,
        ),
    );

    setCancelConfirmationOrder(
      null,
    );

    toast.success(
      result.data
        ?.walletCredited
        ? "Order cancelled. The order amount has been returned to your wallet."
        : "Order cancelled successfully.",
    );
  } catch (error) {
    console.error(
      "Order cancellation error:",
      error,
    );

    toast.error(
      error instanceof Error
        ? error.message
        : "Unable to cancel order.",
    );
  } finally {
    setCancellingOrderId(
      null,
    );
  }
}

  return (
    <DashboardPageLayout
      environment="user"
      breadcrumb={[
        {
          label: "Orders",
        },
      ]}
    >
      <div
        className="
          space-y-5
          pb-16
        "
      >
        <PageHeader
          title="My Orders"
          description="Track your purchases, payment status, and delivery progress."
        />

        <section
          className="
            rounded-xl
            border
            border-[var(--user-card-border)]
            bg-[var(--user-card-bg)]
            p-3
            shadow-[var(--user-card-shadow)]
          "
        >
          <div
            className="
              flex
              flex-col
              gap-2
              sm:flex-row
            "
          >
            <div
              className="
                relative
                min-w-0
                flex-1
              "
            >
              <Search
                size={15}
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-[var(--user-text-muted)]
                "
              />

              <input
                type="search"
                value={search}
                onChange={(
                  event,
                ) =>
                  setSearch(
                    event.target
                      .value,
                  )
                }
                placeholder="Search order number or crypto reference"
                className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  border-[var(--user-card-border)]
                  bg-[var(--user-card-bg)]
                  pl-9
                  pr-3
                  text-sm
                  text-[var(--user-title)]
                  outline-none
                  placeholder:text-[var(--user-text-muted)]
                  focus:border-[var(--primary)]
                "
              />
            </div>

            <select
              value={status}
              onChange={(
                event,
              ) =>
                setStatus(
                  event.target
                    .value as
                    | "ALL"
                    | OrderStatus,
                )
              }
              className="
                h-10
                rounded-lg
                border
                border-[var(--user-card-border)]
                bg-[var(--user-card-bg)]
                px-3
                text-xs
                text-[var(--user-title)]
                outline-none
                focus:border-[var(--primary)]
              "
            >
              {STATUS_OPTIONS.map(
                (option) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </option>
                ),
              )}
            </select>
          </div>
        </section>

        {!loading &&
          !error && (
            <p
              className="
                text-xs
                text-[var(--user-text-muted)]
              "
            >
              {totalOrders}{" "}
              {totalOrders ===
              1
                ? "order"
                : "orders"}
            </p>
          )}

        {loading ? (
          <OrdersLoading />
        ) : error ? (
          <section
            className="
              rounded-xl
              border
              border-[var(--user-card-border)]
              bg-[var(--user-card-bg)]
              p-6
              text-center
              shadow-[var(--user-card-shadow)]
            "
          >
            <p
              className="
                text-sm
                font-semibold
                text-[var(--user-title)]
              "
            >
              Unable to load orders
            </p>

            <p
              className="
                mt-1.5
                text-xs
                text-[var(--user-text-muted)]
              "
            >
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                void loadOrders()
              }
              className="
                mt-4
                h-9
                rounded-lg
                border
                border-[var(--user-card-border)]
                px-3
                text-xs
                font-medium
                text-[var(--user-title)]
                transition
                hover:border-[var(--primary)]
              "
            >
              Try again
            </button>
          </section>
        ) : orders.length ===
          0 ? (
          <section
            className="
              rounded-xl
              border
              border-[var(--user-card-border)]
              bg-[var(--user-card-bg)]
              p-8
              text-center
              shadow-[var(--user-card-shadow)]
            "
          >
            <div
              className="
                mx-auto
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-[var(--user-stat-bg)]
                text-[var(--user-text-muted)]
              "
            >
              <Package
                size={18}
              />
            </div>

            <h2
              className="
                mt-3
                text-sm
                font-semibold
                text-[var(--user-title)]
              "
            >
              No orders found
            </h2>

            <p
              className="
                mx-auto
                mt-1.5
                max-w-md
                text-xs
                leading-5
                text-[var(--user-text-muted)]
              "
            >
              Your completed and pending
              purchases will appear here.
            </p>
          </section>
        ) : (
<div
  className="
    max-h-[620px]
    space-y-2
    overflow-y-auto
    pr-1
  "
>
{orders.map(
  (order) => (
    <OrderCard
      key={order.id}
      order={order}
      onOpen={() =>
        openOrderDetails(order)
      }
    />
  ),
)}
</div>
        )}
      </div>


{selectedOrder && (
  <OrderDetailsModal
    order={selectedOrder}
    currentTime={currentTime}
    cancelling={
      cancellingOrderId ===
      selectedOrder.id
    }
    onClose={() =>
      setSelectedOrder(null)
    }
    onCancel={() =>
      void cancelOrder(
        selectedOrder,
      )
    }
  />
)}

{cancelConfirmationOrder && (
  <OrderCancellationModal
    order={
      cancelConfirmationOrder
    }
    loading={
      cancellingOrderId ===
      cancelConfirmationOrder.id
    }
    onClose={() => {
      if (!cancellingOrderId) {
        setCancelConfirmationOrder(
          null,
        );
      }
    }}
    onConfirm={() => {
      void confirmCancelOrder();
    }}
  />
)}
    </DashboardPageLayout>
  );
}

type OrderCardProps = {
  order: Order;
  onOpen: () => void;
};

function OrderCard({
  order,
  onOpen,
}: OrderCardProps) {
  return (
    <article
      className="
        overflow-hidden
        rounded-xl
        border
        border-[var(--user-card-border)]
        bg-[var(--user-card-bg)]
        shadow-[var(--user-card-shadow)]
      "
    >
      <button
        type="button"
        onClick={onOpen}
        className="
          flex
          w-full
          items-center
          gap-3
          px-3
          py-3
          text-left
          transition
          hover:bg-[var(--user-stat-bg)]
        "
        aria-label={`View order ${order.orderNumber}`}
      >
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-[var(--user-stat-bg)]
            text-[var(--primary)]
          "
        >
          <Package
            size={16}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-2
              gap-y-1
            "
          >
            <span
              className="
                text-xs
                font-semibold
                text-[var(--user-title)]
              "
            >
              {order.orderNumber}
            </span>

            <StatusPill
              value={
                order.status
              }
              tone={getOrderTone(
                order.status,
              )}
            />

            <StatusPill
              value={
                order.paymentStatus
              }
              tone={getPaymentTone(
                order.paymentStatus,
              )}
            />
          </div>

          <div
            className="
              mt-1
              flex
              flex-wrap
              items-center
              gap-x-2
              gap-y-0.5
              text-[10px]
              text-[var(--user-text-muted)]
            "
          >
            <span>
              {order.paymentMethod ===
              "CRYPTO"
                ? "Crypto"
                : "Wallet"}
            </span>

            <span>
              •
            </span>

            <span>
              {formatDate(
                order.createdAt,
              )}
            </span>

            {order.cryptoDeposit && (
              <>
                <span>
                  •
                </span>

                <span className="truncate">
                  {
                    order.cryptoDeposit
                      .reference
                  }
                </span>
              </>
            )}
          </div>
        </div>

        <div
          className="
            shrink-0
            text-right
          "
        >
          <p
            className="
              text-sm
              font-semibold
              text-[var(--user-title)]
            "
          >
            {formatCurrency(
              Number(
                order.total,
              ),
            )}
          </p>

          <span
            className="
              mt-1
              flex
              justify-end
              text-[var(--user-text-muted)]
            "
          >
            <ChevronDown
              size={15}
            />
          </span>
        </div>
      </button>
    </article>
  );
}

function OrderDetailsModal({
  order,
  currentTime,
  cancelling,
  onClose,
  onCancel,
}: {
  order: Order;
  currentTime: number;
  cancelling: boolean;
  onClose: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape" &&
        !cancelling
      ) {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    cancelling,
    onClose,
  ]);

  return (
    <div
      className="
        fixed
        inset-0
        z-[90]
        flex
        items-center
        justify-center
        bg-black/55
        px-4
        py-6
        backdrop-blur-[3px]
      "
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !cancelling
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-details-title"
        className="
          flex
          max-h-[min(760px,calc(100vh-48px))]
          w-full
          max-w-[480px]
          flex-col
          overflow-hidden
          rounded-xl
          border
          border-[var(--user-card-border)]
          bg-[var(--user-card-bg)]
          shadow-2xl
        "
      >
<div
  className="
    relative
    shrink-0
    border-b
    border-[var(--user-card-border)]
    px-12
    py-4
    text-center
  "
>
  <div className="flex flex-wrap items-center justify-center gap-1.5">
    <h2
      id="order-details-title"
      className="text-sm font-semibold text-[var(--user-title)]"
    >
      Order Details
    </h2>

    <StatusPill value={order.status} tone={getOrderTone(order.status)} />
    <StatusPill
      value={order.paymentStatus}
      tone={getPaymentTone(order.paymentStatus)}
    />
  </div>

  <p className="mt-1 truncate text-[10px] text-[var(--user-text-muted)]">
    {order.orderNumber}
  </p>

  <button
    type="button"
    onClick={onClose}
    disabled={cancelling}
    aria-label="Close order details"
    className="
      absolute
      right-4
      top-4
      flex
      h-7
      w-7
      items-center
      justify-center
      rounded-md
      border
      border-[var(--user-card-border)]
      bg-[var(--user-stat-bg)]
      text-[var(--user-text-muted)]
      transition
      hover:text-[var(--user-title)]
      disabled:cursor-not-allowed
      disabled:opacity-50
    "
  >
    <X size={14} />
  </button>
</div>

<div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
  <div className="mx-auto w-full max-w-[420px] space-y-3">
    {/* Items */}
    <div>
      <div className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--user-text-muted)]">
          Items
        </p>
        <p className="mt-0.5 text-[10px] text-[var(--user-text-muted)]">
          {order.items.length} {order.items.length === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="mt-2.5 space-y-2">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="
              flex
              flex-col
              items-center
              gap-2
              rounded-lg
              border
              border-[var(--user-card-border)]
              bg-[var(--user-stat-bg)]
              p-3
              text-center
            "
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[var(--user-card-border)]">
              {item.product.primaryImage ? (
                <Image
                  src={item.product.primaryImage}
                  alt={item.product.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[8px] text-[var(--user-text-muted)]">
                  No image
                </div>
              )}
            </div>

            <div className="min-w-0 max-w-full">
              <p className="truncate text-xs font-medium text-[var(--user-title)]">
                {item.product.name}
              </p>

              <p className="mt-0.5 text-[10px] text-[var(--user-text-muted)]">
                Qty {item.quantity}
                {item.selectedSize && ` • ${item.selectedSize}`}
                {item.selectedColor && ` • ${item.selectedColor}`}
              </p>
            </div>

            <p className="text-sm font-semibold text-[var(--user-title)]">
              {formatCurrency(Number(item.totalPrice))}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Details */}
    <InfoBlock
      label="Payment"
      value={
        order.paymentMethod === "CRYPTO"
          ? `Crypto • ${order.cryptoDeposit?.depositMethod.symbol ?? ""}`
          : "Wallet balance"
      }
    />

    <InfoBlock
      label="Delivery"
      value={[
        order.delivery.addressLine1,
        order.delivery.city,
        order.delivery.state,
        order.delivery.country,
      ]
        .filter(Boolean)
        .join(", ")}
    />

    <InfoBlock
      label="Contact"
      value={[order.delivery.fullName, order.delivery.phoneNumber]
        .filter(Boolean)
        .join(" • ")}
    />

    {order.cryptoDeposit && (
      <InfoBlock
        label="Crypto reference"
        value={order.cryptoDeposit.reference}
      />
    )}

    {/* Summary */}
    <div className="rounded-lg border border-[var(--user-card-border)] bg-[var(--user-stat-bg)] px-3 py-2.5">
      <SummaryRow
        label="Subtotal"
        value={formatCurrency(Number(order.subtotal))}
      />
      <SummaryRow
        label="Discount"
        value={formatCurrency(Number(order.discount))}
      />

      <div className="mt-2 border-t border-[var(--user-divider)] pt-2">
        <SummaryRow
          label="Total"
          value={formatCurrency(Number(order.total))}
          strong
        />
      </div>
    </div>

    {order.notes && (
      <div className="rounded-lg border border-[var(--user-card-border)] bg-[var(--user-stat-bg)] px-3 py-2.5 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--user-text-muted)]">
          Note
        </p>
        <p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-[var(--user-title)]">
          {order.notes}
        </p>
      </div>
    )}

    {order.status !== "CANCELLED" && (
      <OrderCancellationAction
        order={order}
        currentTime={currentTime}
        cancelling={cancelling}
        onCancel={onCancel}
      />
    )}
  </div>
</div>

        </div>
      </div>
  );
}

function OrderCancellationAction({
  order,
  currentTime,
  cancelling,
  onCancel,
}: {
  order: Order;
  currentTime: number;
  cancelling: boolean;
  onCancel: () => void;
}) {
  const {
    canCancel,
    reason,
  } = getCancellationState(
    order,
    currentTime,
  );

  return (
    <div
      className="
        rounded-lg
        border
        border-[var(--user-card-border)]
        bg-[var(--user-stat-bg)]
        px-3
        py-2.5
      "
    >
<div className="flex flex-col items-center gap-2.5 text-center">
        <div className="min-w-0">
          <p
            className="
              text-xs
              font-medium
              text-[var(--user-title)]
            "
          >
            Cancel order
          </p>

          <p
            className="
              mt-0.5
              text-[10px]
              leading-4
              text-[var(--user-text-muted)]
            "
          >
            {canCancel
              ? "You can cancel this order within the first 2 hours."
              : reason}
          </p>
        </div>

        <button
          type="button"
          aria-disabled={!canCancel || cancelling}
          onClick={onCancel}
          className={`
            inline-flex
            h-8
            shrink-0
            items-center
            justify-center
            gap-1.5
            rounded-md
            border
            px-3
            text-[10px]
            font-semibold
            transition
            ${
              canCancel && !cancelling
                ? `
                  border-red-500/30
                  bg-red-500/[0.08]
                  text-red-400
                  hover:border-red-500/50
                  hover:bg-red-500/[0.14]
                `
                : `
                  cursor-not-allowed
                  border-[var(--user-card-border)]
                  bg-[var(--user-card-bg)]
                  text-[var(--user-text-muted)]
                `
            }
          `}
        >
          <XCircle
            size={13}
            strokeWidth={2}
          />

          {cancelling
            ? "Cancelling..."
            : "Cancel Order"}
        </button>
      </div>
    </div>
  );
}


function OrderCancellationModal({
  order,
  loading,
  onClose,
  onConfirm,
}: {
  order: Order;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const confirmRef =
    useRef<HTMLButtonElement>(
      null,
    );

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    confirmRef.current?.focus();

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape" &&
        !loading
      ) {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    loading,
    onClose,
  ]);

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/55
        px-4
        backdrop-blur-[3px]
      "
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !loading
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-order-title"
        className="
          w-full max-w-[340px]
          overflow-hidden
          rounded-xl
          border
          border-[var(--user-card-border)]
          bg-[var(--user-card-bg)]
          shadow-2xl
        "
      >
        <div
          className="
            flex
            items-start
            gap-3
            px-4
            py-4
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
              border
              border-red-500/25
              bg-red-500/[0.08]
              text-red-400
            "
          >
            <XCircle
              size={16}
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="cancel-order-title"
              className="
                text-sm
                font-semibold
                text-[var(--user-title)]
              "
            >
              Cancel Order?
            </h2>

            <p
              className="
                mt-1
                text-[10px]
                leading-4
                text-[var(--user-text-muted)]
              "
            >
              Are you sure you want to
              cancel{" "}
              <span
                className="
                  font-medium
                  text-[var(--user-title)]
                "
              >
                {order.orderNumber}
              </span>
              ?
            </p>

            <p
              className="
                mt-1.5
                text-[10px]
                leading-4
                text-red-400/85
              "
            >
              This action cannot be
              undone.
            </p>
          </div>
        </div>

        <div
          className="
            flex
            items-center
            justify-end
            gap-2
            border-t
            border-[var(--user-card-border)]
            bg-[var(--user-stat-bg)]
            px-4
            py-3
          "
        >
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="
              h-8
              rounded-md
              border
              border-[var(--user-card-border)]
              bg-[var(--user-card-bg)]
              px-3
              text-[10px]
              font-medium
              text-[var(--user-text-muted)]
              transition
              hover:text-[var(--user-title)]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Keep Order
          </button>

          <button
            ref={confirmRef}
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="
              inline-flex
              h-8
              items-center
              justify-center
              gap-1.5
              rounded-md
              border
              border-red-500/30
              bg-red-500/[0.10]
              px-3
              text-[10px]
              font-semibold
              text-red-400
              transition
              hover:border-red-500/50
              hover:bg-red-500/[0.16]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading && (
              <Loader2
                size={12}
                className="animate-spin"
              />
            )}

            {loading
              ? "Cancelling..."
              : "Cancel Order"}
          </button>
        </div>
      </div>
    </div>
  );
}


function getCancellationState(
  order: Order,
  currentTime: number,
): {
  canCancel: boolean;
  reason: string;
} {
  if (
    order.status ===
    "DELIVERED"
  ) {
    return {
      canCancel: false,
      reason:
        "This order has already been delivered and cannot be cancelled.",
    };
  }

  if (
    order.status ===
    "SHIPPED"
  ) {
    return {
      canCancel: false,
      reason:
        "This order has already shipped and can no longer be cancelled.",
    };
  }

  if (
    order.status !==
      "PENDING" &&
    order.status !==
      "PROCESSING"
  ) {
    return {
      canCancel: false,
      reason:
        "This order can no longer be cancelled.",
    };
  }

  const cancellationDeadline =
    new Date(
      order.createdAt,
    ).getTime() +
    2 * 60 * 60 * 1000;

  if (
    currentTime >=
    cancellationDeadline
  ) {
    return {
      canCancel: false,
      reason:
        "The 2-hour cancellation window for this order has expired.",
    };
  }

  return {
    canCancel: true,
    reason: "",
  };
}


function InfoBlock({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div
      className="
        rounded-lg
        border
        border-[var(--user-card-border)]
        bg-[var(--user-stat-bg)]
        px-3
        py-2.5
        text-center
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
        className="
          mt-1
          break-words
          text-xs
          font-medium
          text-[var(--user-title)]
        "
      >
        {value || "Not provided"}
      </p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;

  value: string;

  strong?: boolean;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-3
      "
    >
      <span
        className="
          text-xs
          text-[var(--user-text-muted)]
        "
      >
        {label}
      </span>

      <span
        className={
          strong
            ? "text-sm font-bold text-[var(--user-title)]"
            : "text-xs font-medium text-[var(--user-title)]"
        }
      >
        {value}
      </span>
    </div>
  );
}

type StatusTone =
  | "success"
  | "warning"
  | "danger"
  | "neutral";

function StatusPill({
  value,
  tone,
}: {
  value: string;

  tone: StatusTone;
}) {
  const classes: Record<
    StatusTone,
    string
  > = {
    success:
      "border-[var(--user-badge-success-border)] bg-[var(--user-badge-success-bg)] text-[var(--user-badge-success-text)]",

    warning:
      "border-[var(--user-badge-warning-border)] bg-[var(--user-badge-warning-bg)] text-[var(--user-badge-warning-text)]",

    danger:
      "border-[var(--user-badge-danger-border)] bg-[var(--user-badge-danger-bg)] text-[var(--user-badge-danger-text)]",

    neutral:
      "border-[var(--user-card-border)] bg-[var(--user-card-bg)] text-[var(--user-text-muted)]",
  };

  return (
    <span
      className={`
        inline-flex
        rounded-full
        border
        px-2
        py-0.5
        text-[9px]
        font-semibold
        uppercase
        tracking-[0.04em]
        ${classes[tone]}
      `}
    >
      {formatStatusLabel(
        value,
      )}
    </span>
  );
}

function getPaymentTone(
  value: OrderPaymentStatus,
): StatusTone {
  if (
    value === "PAID"
  ) {
    return "success";
  }

  if (
    value === "FAILED"
  ) {
    return "danger";
  }

  return "warning";
}

function getOrderTone(
  value: OrderStatus,
): StatusTone {
  if (
    value ===
      "PROCESSING" ||
    value ===
      "SHIPPED" ||
    value ===
      "DELIVERED"
  ) {
    return "success";
  }

  if (
    value ===
    "CANCELLED"
  ) {
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

function OrdersLoading() {
  return (
    <div className="space-y-2">
      {Array.from({
        length: 5,
      }).map(
        (_, index) => (
          <div
            key={index}
            className="
              h-[68px]
              animate-pulse
              rounded-xl
              border
              border-[var(--user-card-border)]
              bg-[var(--user-card-bg)]
            "
          />
        ),
      )}
    </div>
  );
}