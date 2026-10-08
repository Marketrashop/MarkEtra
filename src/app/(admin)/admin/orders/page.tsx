"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  toast,
} from "sonner";

import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import {
  AdminPageHeader,
} from "@/components/admin";

import OrderFilters from "@/components/admin/orders/OrderFilters";
import OrderTable from "@/components/admin/orders/OrderTable";
import OrderDetailsModal from "@/components/admin/orders/OrderDetailsModal";
import LoadingSkeleton from "@/components/admin/orders/LoadingSkeleton";
import EmptyState from "@/components/admin/orders/EmptyState";

import type {
  AdminOrder,
  AdminOrderFilters,
  AdminOrdersResponse,
} from "@/components/admin/orders/types";

const DEFAULT_FILTERS: AdminOrderFilters = {
  search: "",
  paymentMethod: "ALL",
  paymentStatus: "ALL",
  status: "ALL",
};

export default function AdminOrdersPage() {
  const [
    orders,
    setOrders,
  ] = useState<AdminOrder[]>([]);

  const [
    filters,
    setFilters,
  ] =
    useState<AdminOrderFilters>(
      DEFAULT_FILTERS,
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    selectedOrder,
    setSelectedOrder,
  ] =
    useState<AdminOrder | null>(
      null,
    );

  const [
    detailsOpen,
    setDetailsOpen,
  ] = useState(false);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const loadOrders =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const params =
            new URLSearchParams();

          const search =
            filters.search.trim();

          if (search) {
            params.set(
              "search",
              search,
            );
          }

          if (
            filters.paymentMethod !==
            "ALL"
          ) {
            params.set(
              "paymentMethod",
              filters.paymentMethod,
            );
          }

          if (
            filters.paymentStatus !==
            "ALL"
          ) {
            params.set(
              "paymentStatus",
              filters.paymentStatus,
            );
          }

          if (
            filters.status !==
            "ALL"
          ) {
            params.set(
              "status",
              filters.status,
            );
          }

          const query =
            params.toString();

          const response =
            await fetch(
              query
                ? `/api/admin/orders?${query}`
                : "/api/admin/orders",
              {
                cache:
                  "no-store",
              },
            );

          const result: AdminOrdersResponse =
            await response.json();

          if (
            !response.ok ||
            !result.success
          ) {
            throw new Error(
              "Unable to fetch orders.",
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
              : "Unable to fetch orders.";

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
      [filters],
    );

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const filteredOrders =
    useMemo(
      () => orders,
      [orders],
    );

  function handleView(
    order: AdminOrder,
  ) {
    setSelectedOrder(
      order,
    );

    setDetailsOpen(
      true,
    );
  }

  function closeDetails() {
    if (actionLoading) {
      return;
    }

    setDetailsOpen(
      false,
    );
    setSelectedOrder(
      null,
    );
  }

async function handleApprove(
  order: AdminOrder,
) {
  if (
    actionLoading ||
    order.paymentMethod !==
      "CRYPTO" ||
    order.paymentStatus !==
      "PENDING" ||
    !order.cryptoDeposit
  ) {
    return;
  }

  try {
    setActionLoading(true);

    const response =
      await fetch(
        `/api/admin/orders/${order.id}/approve`,
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
          "Unable to approve payment.",
      );
    }

    toast.success(
      "Payment approved successfully.",
    );

    const responseOrders =
      await fetch(
        "/api/admin/orders",
        {
          cache:
            "no-store",
        },
      );

    const ordersResult: AdminOrdersResponse =
      await responseOrders.json();

    if (
      !responseOrders.ok ||
      !ordersResult.success
    ) {
      throw new Error(
        "Payment was approved, but the order list could not be refreshed.",
      );
    }

    setOrders(
      ordersResult.data,
    );

    const updatedOrder =
      ordersResult.data.find(
        (item) =>
          item.id ===
          order.id,
      ) ?? null;

    setSelectedOrder(
      updatedOrder,
    );
  } catch (error) {
    console.error(
      error,
    );

    toast.error(
      error instanceof Error
        ? error.message
        : "Unable to approve payment.",
    );
  } finally {
    setActionLoading(
      false,
    );
  }
}

async function handleReject(
  order: AdminOrder,
  reason: string,
) {
  if (
    actionLoading ||
    order.paymentMethod !==
      "CRYPTO" ||
    order.paymentStatus !==
      "PENDING" ||
    !order.cryptoDeposit
  ) {
    return;
  }

  try {
    setActionLoading(true);

    const response =
      await fetch(
        `/api/admin/orders/${order.id}/reject`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            adminNote:
              reason,
          }),
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
          "Unable to reject payment.",
      );
    }

    toast.success(
      "Payment rejected successfully.",
    );

    await loadOrders();

    setDetailsOpen(
      false,
    );

    setSelectedOrder(
      null,
    );
  } catch (error) {
    console.error(
      error,
    );

    toast.error(
      error instanceof Error
        ? error.message
        : "Unable to reject payment.",
    );
  } finally {
    setActionLoading(
      false,
    );
  }
}


async function handleUpdateStatus(
  order: AdminOrder,
  status:
    | "PENDING"
    | "PROCESSING"
    | "NEAR_DESTINATION"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED",
) {
  if (
    actionLoading ||
    order.status === status
  ) {
    return;
  }

  if (
    status !== "CANCELLED" &&
    order.paymentStatus !== "PAID"
  ) {
    return;
  }

  try {
    setActionLoading(true);

    const response =
      await fetch(
        `/api/admin/orders/${order.id}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status,
          }),
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
          "Unable to update order status.",
      );
    }

    toast.success(
      status === "CANCELLED"
        ? "Order cancelled successfully."
        : "Order status updated successfully.",
    );

    const responseOrders =
      await fetch(
        "/api/admin/orders",
        {
          cache:
            "no-store",
        },
      );

    const ordersResult: AdminOrdersResponse =
      await responseOrders.json();

    if (
      !responseOrders.ok ||
      !ordersResult.success
    ) {
      throw new Error(
        "Status was updated, but the order list could not be refreshed.",
      );
    }

    setOrders(
      ordersResult.data,
    );

    const updatedOrder =
      ordersResult.data.find(
        (item) =>
          item.id ===
          order.id,
      ) ?? null;

    setSelectedOrder(
      updatedOrder,
    );
  } catch (error) {
    console.error(
      error,
    );

    toast.error(
      error instanceof Error
        ? error.message
        : "Unable to update order status.",
    );

    throw error;
  } finally {
    setActionLoading(
      false,
    );
  }
}

  function clearFilters() {
    setFilters(
      DEFAULT_FILTERS,
    );
  }

  return (
    <DashboardPageLayout
      environment="admin"
      breadcrumb={[
        {
          label:
            "Orders",
        },
      ]}
    >
      <div
        className="
          space-y-6
          pb-16
        "
      >
        <AdminPageHeader
          title="Orders"
          description="Review customer orders and approve or reject pending crypto payments."
        />

        <OrderFilters
          filters={filters}
          onChange={
            setFilters
          }
        />

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div
            className="
              rounded-xl
              border
              border-[var(--admin-card-border)]
              bg-[var(--admin-card-bg)]
              p-5
              text-sm
              text-[var(--admin-muted)]
              shadow-[var(--admin-card-shadow)]
            "
          >
            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                void loadOrders()
              }
              className="
                mt-3
                h-9
                rounded-lg
                border
                border-[var(--admin-card-border)]
                px-3
                text-xs
                font-medium
                text-[var(--admin-title)]
                transition
                hover:border-[var(--primary)]
              "
            >
              Try again
            </button>
          </div>
        ) : filteredOrders.length ===
          0 ? (
          <EmptyState
            title="No matching orders"
            description="Try changing your search or filter criteria."
            actionLabel="Clear Filters"
            onAction={
              clearFilters
            }
          />
        ) : (
          <OrderTable
            orders={
              filteredOrders
            }
            onView={
              handleView
            }
          />
        )}

<OrderDetailsModal
  open={
    detailsOpen
  }
  order={
    selectedOrder
  }
  loading={
    actionLoading
  }
  onClose={
    closeDetails
  }
  onApprove={
    handleApprove
  }
  onReject={
    handleReject
  }
  onUpdateStatus={
    handleUpdateStatus
  }
/>
      </div>
    </DashboardPageLayout>
  );
}