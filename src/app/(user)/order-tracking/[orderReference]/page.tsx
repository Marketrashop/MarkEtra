
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Truck,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import DashboardPageLayout from "@/components/dashboard/DashboardPage";
import { PageHeader } from "@/components/dashboard";
import NavigationLink from "@/components/ui/Preloader/NavigationLink";
import Image from "next/image";

type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "NEAR_DESTINATION"
  | "DELIVERED"
  | "CANCELLED";

type TrackingItem = {
  id: string;
  name: string;
  image: string | null;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  selectedColor: string | null;
  selectedSize: string | null;
};

type Delivery = {
  fullName: string | null;
  phoneNumber: string | null;
  alternatePhoneNumber: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
};

type TrackingOrder = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  paymentMethod: "WALLET" | "CRYPTO";
  subtotal: string;
  discount: string;
  total: string;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
  delivery: Delivery;
  items: TrackingItem[];
};

type TrackingResponse = {
  success: boolean;
  error?: string;
  data?: TrackingOrder;
};

const STEPS = [
  {
    status: "PENDING",
    title: "Order placed",
    description: "Your order has been received.",
    color: "#64748b",
    soft: "rgba(100,116,139,.12)",
    border: "rgba(100,116,139,.32)",
    Icon: Package,
  },
  {
    status: "PROCESSING",
    title: "Processing",
    description: "Your order is being prepared.",
    color: "#8b5cf6",
    soft: "rgba(139,92,246,.12)",
    border: "rgba(139,92,246,.32)",
    Icon: Clock3,
  },
  {
    status: "SHIPPED",
    title: "Shipped",
    description: "Your order has left for delivery.",
    color: "#2563eb",
    soft: "rgba(37,99,235,.12)",
    border: "rgba(37,99,235,.32)",
    Icon: Truck,
  },
  {
    status: "NEAR_DESTINATION",
    title: "Near destination",
    description: "Your order is nearing its destination.",
    color: "#d97706",
    soft: "rgba(217,119,6,.12)",
    border: "rgba(217,119,6,.32)",
    Icon: MapPin,
  },
  {
    status: "DELIVERED",
    title: "Delivered",
    description: "Delivery has been marked complete.",
    color: "#059669",
    soft: "rgba(5,150,105,.12)",
    border: "rgba(5,150,105,.32)",
    Icon: PackageCheck,
  },
] as const;

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCurrency(value: string | number) {
  const amount = typeof value === "number" ? value : Number(value);

  return `$${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getAddressLines(delivery: Delivery) {
  return [
    delivery.addressLine1,
    delivery.addressLine2,
    [delivery.city, delivery.state].filter(Boolean).join(", "),
    [delivery.country, delivery.postalCode].filter(Boolean).join(" "),
  ].filter((line): line is string => Boolean(line?.trim()));
}

export default function OrderTrackingPage() {
  const params = useParams<{ orderReference: string }>();
  const router = useRouter();
  const orderReference = params.orderReference ?? "";

  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [showDeliveredDialog, setShowDeliveredDialog] = useState(false);
  const [hasShownDeliveredDialog, setHasShownDeliveredDialog] = useState(false);

  const loadTracking = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const response = await fetch(
        `/api/orders/track/${encodeURIComponent(orderReference)}`,
        {
          cache: "no-store",
          headers: { Accept: "application/json" },
        },
      );

      const result: TrackingResponse = await response.json();

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok || !result.success || !result.data) {
        throw new Error(
          response.status === 404
            ? "We couldn't find this order in your account."
            : result.error ?? "Unable to load tracking information.",
        );
      }

      setOrder(result.data);

      if (
        result.data.status === "DELIVERED" &&
        !hasShownDeliveredDialog
      ) {
        setShowDeliveredDialog(true);
        setHasShownDeliveredDialog(true);
      }

      if (manual) toast.success("Order status refreshed.");
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load tracking information.";

      setError(message);

      if (manual) toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [hasShownDeliveredDialog, orderReference, router]);

  useEffect(() => {
    void loadTracking();
  }, [loadTracking]);

  const activeStep = useMemo(() => {
    if (!order || order.status === "CANCELLED") return -1;
    return STEPS.findIndex((step) => step.status === order.status);
  }, [order]);

  const cancelled = order?.status === "CANCELLED";
  const delivered = order?.status === "DELIVERED";

  const currentStep =
    order && !cancelled
      ? STEPS.find((step) => step.status === order.status)
      : undefined;

  return (
    <DashboardPageLayout
      environment="user"
      breadcrumb={[
        { label: "Orders" },
        { label: "Order tracking" },
      ]}
    >
      <div className="mx-auto w-full max-w-6xl space-y-3 pb-20 sm:space-y-4 sm:pb-16">
        <div className="flex flex-wrap items-center justify-between gap-2">

<NavigationLink
  href="/orders"
  className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--user-card-border)] bg-[var(--user-card-bg)] px-3 text-xs font-semibold text-[var(--user-title)] transition hover:border-[var(--primary)]"
>
  <ArrowLeft size={14} />
  My orders
</NavigationLink>
        </div>

        {loading ? (
          <TrackingSkeleton />
        ) : error ? (
          <section className="rounded-xl border border-[var(--user-card-border)] bg-[var(--user-card-bg)] px-4 py-7 text-center sm:rounded-2xl sm:px-5 sm:py-10 shadow-[var(--user-card-shadow)]">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl border border-red-500/20 bg-red-500/10 text-red-500">
              <Package size={21} />
            </div>

            <h2 className="mt-3 text-[13px] font-semibold text-[var(--user-title)] sm:text-sm">
              Unable to show this order
            </h2>

            <p className="mx-auto mt-1 max-w-md text-[11px] leading-4 sm:text-xs sm:leading-5 text-[var(--user-text-muted)]">
              {error}
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => void loadTracking()}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#5b5ef7] px-4 text-xs font-semibold text-white transition hover:bg-[#4b4ee8] active:scale-[0.98]"
              >
                <RefreshCw size={13} />
                Try again
              </button>

<NavigationLink
  href="/orders"
  className="inline-flex h-9 items-center rounded-lg border border-[var(--user-card-border)] px-4 text-xs font-semibold text-[var(--user-title)] transition hover:border-[var(--primary)]"
>
  Back to orders
</NavigationLink>
            </div>
          </section>
        ) : order ? (
          <>
            {/* Order overview */}
            <section className="relative overflow-hidden rounded-xl border border-[var(--user-card-border)] bg-[var(--user-card-bg)] shadow-[var(--user-card-shadow)] sm:rounded-2xl">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500" />

              <div className="p-3.5 sm:p-5 lg:p-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start sm:gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--user-card-border)] bg-[var(--user-stat-bg)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--user-text-muted)]">
                        <ShieldCheck size={12} />
                        Order tracking
                      </span>

                      {delivered && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">
                          <CheckCircle2 size={12} />
                          Delivered
                        </span>
                      )}

                      {cancelled && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-red-500/25 bg-red-500/10 px-2 py-0.5 text-[9px] font-semibold text-red-500">
                          <XCircle size={12} />
                          Cancelled
                        </span>
                      )}
                    </div>

                    <h2 className="mt-2 break-all text-base font-semibold tracking-tight sm:text-xl text-[var(--user-title)] sm:text-2xl">
                      {order.orderNumber}
                    </h2>

                    <p className="mt-1 text-[11px] text-[var(--user-text-muted)] sm:text-xs">
                      Placed on {formatDateTime(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--user-card-border)] bg-[var(--user-stat-bg)] px-3 py-2.5 sm:min-w-[190px] sm:px-4 sm:py-3 sm:justify-start">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--user-text-muted)]">
                        Order total
                      </p>
                      <p className="mt-0.5 text-lg font-bold tracking-tight sm:text-xl text-[var(--user-title)]">
                        {formatCurrency(order.total)}
                      </p>
                    </div>

                    <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--user-card-border)] bg-[var(--user-card-bg)] text-[var(--primary)]">
                      <PackageCheck size={19} />
                    </div>
                  </div>
                </div>

                {/* Delivery progress */}
                <div className="mt-4 rounded-xl border border-[var(--user-card-border)] bg-[var(--user-stat-bg)] p-3 sm:mt-5 sm:rounded-2xl sm:p-5">
                  {cancelled ? (
                    <div className="flex flex-col items-center py-2 text-center sm:py-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/25 bg-red-500/10 text-red-500">
                        <XCircle size={26} />
                      </div>

                      <h3 className="mt-3 text-[13px] font-semibold text-[var(--user-title)] sm:text-sm">
                        This order was cancelled
                      </h3>

                      <p className="mt-1 max-w-md text-[11px] leading-4 sm:text-xs sm:leading-5 text-[var(--user-text-muted)]">
                        This order will not continue through the delivery stages.
                        Review the payment information below for its recorded status.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--user-text-muted)]">
                            Delivery progress
                          </p>

                          <h3 className="mt-0.5 text-[13px] font-semibold text-[var(--user-title)] sm:text-sm sm:text-base">
                            {currentStep?.title ?? "Order received"}
                          </h3>
                        </div>

                        <span
                          className="inline-flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold"
                          style={{
                            color: currentStep?.color ?? "#64748b",
                            backgroundColor: currentStep?.soft ?? "rgba(100,116,139,.12)",
                            borderColor: currentStep?.border ?? "rgba(100,116,139,.32)",
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: currentStep?.color ?? "#64748b" }}
                          />
                          {formatStatus(order.status)}
                        </span>
                      </div>

                      <div className="mt-4 sm:mt-6">
                        <div className="relative px-0.5 sm:px-4">
                          <div className="absolute left-[9%] right-[9%] top-4 h-0.5 sm:top-5 sm:h-[3px] rounded-full bg-[var(--user-card-border)]" />

                          <div
                            className="absolute left-[9%] top-4 h-0.5 sm:top-5 sm:h-[3px] rounded-full transition-all duration-700"
                            style={{
                              width: activeStep <= 0
                                ? "0%"
                                : `${(activeStep / (STEPS.length - 1)) * 82}%`,
                              background: "linear-gradient(90deg, #64748b 0%, #8b5cf6 28%, #2563eb 55%, #d97706 78%, #059669 100%)",
                            }}
                          />

                          <div className="relative grid grid-cols-5">
                            {STEPS.map((step, index) => {
                              const complete = index < activeStep;
                              const active = index === activeStep;
                              const StepIcon = step.Icon;

                              return (
                                <div
                                  key={step.status}
                                  className="flex min-w-0 flex-col items-center text-center"
                                >
                                  <div
                                    className="z-[1] flex h-7 w-7 items-center justify-center rounded-lg border sm:h-10 sm:w-10 sm:rounded-xl sm:border-2 transition-all duration-300"
                                    style={{
                                      color: complete || active ? "#fff" : step.color,
                                      backgroundColor: complete
                                        ? "#059669"
                                        : active
                                          ? step.color
                                          : "var(--user-card-bg)",
                                      borderColor: complete
                                        ? "#059669"
                                        : active
                                          ? step.color
                                          : "var(--user-card-border)",
                                      boxShadow: active
                                        ? `0 0 0 3px ${step.soft}`
                                        : "none",
                                    }}
                                  >
                                    {complete ? (
                                      <Check size={17} strokeWidth={2.5} />
                                    ) : (
                                      <StepIcon size={16} />
                                    )}
                                  </div>

                                  <p
                                    className={`mt-2 max-w-[64px] text-[8px] font-semibold leading-3 sm:mt-3 sm:max-w-none sm:text-[11px] sm:leading-4 ${
                                      complete || active
                                        ? "text-[var(--user-title)]"
                                        : "text-[var(--user-text-muted)]"
                                    }`}
                                  >
                                    {step.title}
                                  </p>

                                  <p className="mt-1 hidden max-w-[120px] text-[10px] leading-4 text-[var(--user-text-muted)] md:block">
                                    {step.description}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--user-divider)] pt-2.5 sm:pt-3">
                          <p className="text-[10px] text-[var(--user-text-muted)]">
                            Last updated {formatDateTime(order.updatedAt)}
                          </p>

                          <button
                            type="button"
                            disabled={refreshing}
                            onClick={() => void loadTracking(true)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--user-card-border)] bg-[var(--user-card-bg)] px-3 text-[10px] font-semibold text-[var(--user-title)] transition hover:border-[var(--primary)] disabled:opacity-60"
                          >
                            <RefreshCw
                              size={12}
                              className={refreshing ? "animate-spin" : ""}
                            />
                            {refreshing ? "Refreshing..." : "Refresh status"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* Delivery confirmation banner */}
            {delivered && (
              <section className="flex flex-col gap-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-3 sm:flex-row sm:p-4 sm:items-center">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <CheckCircle2 size={20} />
                </div>

                <div className="flex-1">
                  <h3 className="text-[13px] font-semibold text-[var(--user-title)] sm:text-sm">
                    Your order has been delivered
                  </h3>
                  <p className="mt-1 text-[11px] leading-4 text-[var(--user-text-muted)] sm:text-xs sm:leading-5">
                    Delivery is marked complete in your order record. Check the saved
                    delivery address below.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDeliveredDialog(true)}
                  className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-500/15 dark:text-emerald-400"
                >
                  Delivery details
                  <ChevronRight size={14} />
                </button>
              </section>
            )}

            <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1.25fr_.75fr]">
              {/* Items and totals */}
              <section className="overflow-hidden rounded-xl border border-[var(--user-card-border)] bg-[var(--user-card-bg)] shadow-[var(--user-card-shadow)] sm:rounded-2xl">
                <div className="flex items-center justify-between border-b border-[var(--user-card-border)] px-3.5 py-3 sm:px-5 sm:py-4">
                  <div>
                    <h3 className="text-[13px] font-semibold text-[var(--user-title)] sm:text-sm">
                      Items in this order
                    </h3>
                    <p className="mt-0.5 text-[9px] text-[var(--user-text-muted)] sm:mt-1 sm:text-[10px]">
                      {order.items.length} {order.items.length === 1 ? "item" : "items"}
                      {" · "}Order #{order.orderNumber}
                    </p>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--user-stat-bg)] text-[var(--primary)]">
                    <Package size={17} />
                  </div>
                </div>

                <div className="divide-y divide-[var(--user-divider)]">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-2.5 px-3.5 py-3 sm:gap-3 sm:px-5 sm:py-4">
<div className="relative flex h-11 w-11 shrink-0 sm:h-14 sm:w-14 items-center justify-center overflow-hidden rounded-xl border border-[var(--user-card-border)] bg-[var(--user-stat-bg)] text-[var(--user-text-muted)]">
  {item.image ? (
    <Image
      src={item.image}
      alt={item.name}
      fill
      sizes="(max-width: 640px) 44px, 56px"
      className="object-cover"
    />
  ) : (
    <Package size={20} />
  )}
</div>

                      <div className="min-w-0 flex-1">
                        <p className="break-words text-[11px] font-semibold sm:text-xs text-[var(--user-title)]">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-[9px] text-[var(--user-text-muted)] sm:mt-1 sm:text-[10px]">
                          Qty {item.quantity}
                          {item.selectedSize ? ` · Size ${item.selectedSize}` : ""}
                          {item.selectedColor ? ` · ${item.selectedColor}` : ""}
                        </p>
                        <p className="mt-0.5 text-[9px] text-[var(--user-text-muted)] sm:mt-1 sm:text-[10px]">
                          {formatCurrency(item.unitPrice)} each
                        </p>
                      </div>

                      <p className="shrink-0 text-xs font-semibold text-[var(--user-title)]">
                        {formatCurrency(item.totalPrice)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5 border-t border-[var(--user-card-border)] bg-[var(--user-stat-bg)] px-3.5 py-3 sm:space-y-2 sm:px-5 sm:py-4">
                  <PriceRow label="Subtotal" value={formatCurrency(order.subtotal)} />
                  <PriceRow label="Discount" value={`−${formatCurrency(order.discount)}`} />

                  <div className="border-t border-[var(--user-divider)] pt-2.5 sm:pt-3">
                    <PriceRow
                      label="Order total"
                      value={formatCurrency(order.total)}
                      strong
                    />
                  </div>
                </div>
              </section>

              <div className="space-y-3 sm:space-y-5">
                {/* Delivery address */}
                <section className="rounded-xl border border-[var(--user-card-border)] bg-[var(--user-card-bg)] p-3.5 shadow-[var(--user-card-shadow)] sm:rounded-2xl sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl bg-[var(--user-stat-bg)] text-[var(--primary)]">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-semibold text-[var(--user-title)] sm:text-sm">
                        Delivery address
                      </h3>
                      <p className="mt-0.5 text-[9px] text-[var(--user-text-muted)] sm:text-[10px]">
                        Address saved with this order
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg border border-[var(--user-card-border)] bg-[var(--user-stat-bg)] p-3 sm:mt-4 sm:rounded-xl sm:p-3.5">
                    <p className="text-xs font-semibold text-[var(--user-title)]">
                      {order.delivery.fullName || "Recipient not provided"}
                    </p>

                    <div className="mt-1.5 space-y-0.5 text-[11px] leading-4 sm:mt-2 sm:space-y-1 sm:text-xs sm:leading-5 text-[var(--user-text-muted)]">
                      {getAddressLines(order.delivery).length ? (
                        getAddressLines(order.delivery).map((line, index) => (
                          <p key={`${line}-${index}`}>{line}</p>
                        ))
                      ) : (
                        <p>No delivery address was saved for this order.</p>
                      )}
                    </div>

                    {order.delivery.phoneNumber && (
                      <p className="mt-3 border-t border-[var(--user-divider)] pt-2.5 sm:pt-3 text-xs text-[var(--user-title)]">
                        {order.delivery.phoneNumber}
                      </p>
                    )}

                    {order.delivery.alternatePhoneNumber && (
                      <p className="mt-1 text-[11px] text-[var(--user-text-muted)] sm:text-xs">
                        Alternate: {order.delivery.alternatePhoneNumber}
                      </p>
                    )}

                    {order.delivery.postalCode && (
                      <p className="mt-0.5 text-[9px] text-[var(--user-text-muted)] sm:mt-1 sm:text-[10px]">
                        Postal code: {order.delivery.postalCode}
                      </p>
                    )}
                  </div>
                </section>

                {/* Payment information */}
                <section className="rounded-xl border border-[var(--user-card-border)] bg-[var(--user-card-bg)] p-3.5 shadow-[var(--user-card-shadow)] sm:rounded-2xl sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl bg-[var(--user-stat-bg)] text-[var(--primary)]">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-semibold text-[var(--user-title)] sm:text-sm">
                        Payment summary
                      </h3>
                      <p className="mt-0.5 text-[9px] text-[var(--user-text-muted)] sm:text-[10px]">
                        Payment method and status
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] text-[var(--user-text-muted)] sm:text-xs">
                        Method
                      </span>
                      <span className="text-[11px] font-medium text-[var(--user-title)] sm:text-xs">
                        {order.paymentMethod === "CRYPTO"
                          ? "Cryptocurrency"
                          : "Wallet balance"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] text-[var(--user-text-muted)] sm:text-xs">
                        Payment status
                      </span>
                      <span
className={`rounded-full border px-2 py-1 text-[9px] font-semibold ${
  cancelled || order.paymentStatus === "PAID"
    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600"
    : order.paymentStatus === "FAILED"
      ? "border-red-500/25 bg-red-500/10 text-red-500"
      : "border-amber-500/25 bg-amber-500/10 text-amber-600"
}`}
                      >
{cancelled
  ? "Refunded"
  : formatStatus(order.paymentStatus)}
                      </span>
                    </div>

                    {order.paidAt && (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] text-[var(--user-text-muted)] sm:text-xs">
                          Paid on
                        </span>
                        <span className="text-right text-[11px] font-medium text-[var(--user-title)] sm:text-xs">
                          {formatDate(order.paidAt)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3 border-t border-[var(--user-divider)] pt-2.5 sm:pt-3">
                      <span className="text-[11px] text-[var(--user-text-muted)] sm:text-xs">
                        Order placed
                      </span>
                      <span className="text-right text-[11px] font-medium text-[var(--user-title)] sm:text-xs">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--user-card-border)] bg-[var(--user-card-bg)] px-4 py-3">
              <p className="text-[10px] leading-5 text-[var(--user-text-muted)]">
                Tracking reflects the latest status recorded by MarkEtra. It does not show live GPS location.
              </p>

<NavigationLink
  href="/orders"
  className="inline-flex h-8 items-center gap-1.5 text-xs font-semibold text-[var(--primary)] transition hover:opacity-80"
>
  Return to orders
  <ChevronRight size={14} />
</NavigationLink>
            </div>
          </>
        ) : null}
      </div>

      {showDeliveredDialog && order?.status === "DELIVERED" && (
        <DeliveredDialog
          order={order}
          onClose={() => setShowDeliveredDialog(false)}
        />
      )}
    </DashboardPageLayout>
  );
}

function PriceRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span
        className={`text-xs ${
          strong
            ? "font-semibold text-[var(--user-title)]"
            : "text-[var(--user-text-muted)]"
        }`}
      >
        {label}
      </span>
      <span
        className={
          strong
            ? "text-sm font-bold text-[var(--user-title)]"
            : "text-[11px] font-medium text-[var(--user-title)] sm:text-xs"
        }
      >
        {value}
      </span>
    </div>
  );
}

function DeliveredDialog({
  order,
  onClose,
}: {
  order: TrackingOrder;
  onClose: () => void;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const addressLines = getAddressLines(order.delivery);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 px-3 py-3 sm:px-4 sm:py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delivered-dialog-title"
        className="relative w-full max-w-md overflow-hidden rounded-xl sm:rounded-2xl border border-[var(--user-card-border)] bg-[var(--user-card-bg)] shadow-2xl"
      >
        <div className="h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400" />

        <button
          type="button"
          aria-label="Close delivery confirmation"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-7 w-7 sm:right-4 sm:top-4 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-[var(--user-card-border)] bg-[var(--user-stat-bg)] text-[var(--user-text-muted)] transition hover:text-[var(--user-title)]"
        >
          <X size={15} />
        </button>

        <div className="px-4 pb-4 pt-6 text-center sm:px-6 sm:pb-6 sm:pt-8 sm:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl sm:h-16 sm:w-16 sm:rounded-2xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 shadow-[0_0_0_8px_rgba(16,185,129,.05)]">
            <CheckCircle2 size={30} strokeWidth={1.7} />
          </div>

          <p className="mt-3 text-[9px] font-semibold uppercase sm:mt-5 sm:text-[10px] tracking-[0.18em] text-emerald-600">
            Delivery confirmed
          </p>

          <h2
            id="delivered-dialog-title"
            className="mt-1.5 text-lg font-semibold tracking-tight sm:mt-2 sm:text-xl text-[var(--user-title)]"
          >
            Your order has arrived
          </h2>

          <p className="mt-1.5 text-[11px] leading-4 text-[var(--user-text-muted)] sm:mt-2 sm:text-xs sm:leading-5">
            MarkEtra has recorded this order as delivered. Here are the details saved
            with your purchase.
          </p>

          <div className="mt-3 rounded-lg border border-[var(--user-card-border)] bg-[var(--user-stat-bg)] p-3 text-left sm:mt-5 sm:rounded-xl sm:p-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--user-text-muted)]">
              Order reference
            </p>
            <p className="mt-1 break-all text-[11px] font-semibold sm:text-xs text-[var(--user-title)]">
              {order.orderNumber}
            </p>

            <div className="mt-2 flex items-center justify-between gap-3 border-t border-[var(--user-divider)] pt-2.5 sm:pt-3">
              <span className="text-[11px] text-[var(--user-text-muted)] sm:text-xs">
                Order total
              </span>
              <span className="text-sm font-bold text-[var(--user-title)]">
                {formatCurrency(order.total)}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-[11px] text-[var(--user-text-muted)] sm:text-xs">
                Recorded status
              </span>
              <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-[9px] font-semibold text-emerald-600">
                DELIVERED
              </span>
            </div>
          </div>

          <div className="mt-2.5 rounded-lg border border-[var(--user-card-border)] p-3 text-left sm:mt-3 sm:rounded-xl sm:p-4">
            <div className="flex items-center gap-2 text-[var(--primary)]">
              <MapPin size={15} />
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em]">
                Delivery address
              </p>
            </div>

            <p className="mt-1.5 text-[11px] font-semibold text-[var(--user-title)] sm:mt-2 sm:text-xs">
              {order.delivery.fullName || "Recipient not provided"}
            </p>

            <div className="mt-1 space-y-0.5 text-[11px] leading-4 sm:text-xs sm:leading-5 text-[var(--user-text-muted)]">
              {addressLines.length ? (
                addressLines.map((line, index) => (
                  <p key={`${line}-${index}`}>{line}</p>
                ))
              ) : (
                <p>No delivery address was saved for this order.</p>
              )}
            </div>

            {order.delivery.phoneNumber && (
              <p className="mt-1.5 text-[11px] text-[var(--user-title)] sm:mt-2 sm:text-xs">
                {order.delivery.phoneNumber}
              </p>
            )}
          </div>


<button
  type="button"
  onClick={onClose}
className="mt-3 inline-flex h-9 w-full sm:mt-5 sm:h-10 items-center justify-center gap-2 rounded-xl border border-[#5b5ef7]/30 bg-[#5b5ef7] px-4 text-xs font-semibold text-white shadow-lg shadow-[#5b5ef7]/20 transition hover:bg-[#4b4ee8] active:scale-[0.99]"
>
  <Check size={15} />
  Continue tracking
</button>

        </div>
      </section>
    </div>
  );
}

function TrackingSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-5">
      <div className="h-[220px] animate-pulse sm:h-[290px] rounded-2xl border border-[var(--user-card-border)] bg-[var(--user-card-bg)]" />

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1.25fr_.75fr]">
        <div className="h-[280px] animate-pulse sm:h-[330px] rounded-2xl border border-[var(--user-card-border)] bg-[var(--user-card-bg)]" />

        <div className="space-y-3 sm:space-y-5">
          <div className="h-[150px] animate-pulse sm:h-[190px] rounded-2xl border border-[var(--user-card-border)] bg-[var(--user-card-bg)]" />
          <div className="h-[130px] animate-pulse sm:h-[160px] rounded-2xl border border-[var(--user-card-border)] bg-[var(--user-card-bg)]" />
        </div>
      </div>
    </div>
  );
}
