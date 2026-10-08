"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  toast,
} from "sonner";

import WithdrawalFilters from "./WithdrawalFilters";
import WithdrawalReviewModal from "./WithdrawalReviewModal";
import WithdrawalTable from "./WithdrawalTable";

import type {
  Withdrawal,
  WithdrawalFilters as WithdrawalFiltersType,
  WithdrawalMethod,
} from "./withdrawal.types";

export default function WithdrawalsPage() {
  const [
    withdrawals,
    setWithdrawals,
  ] = useState<
    Withdrawal[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const [
    filters,
    setFilters,
  ] =
    useState<WithdrawalFiltersType>({
      search: "",
      methodId: "ALL",
    });

  const [
    methods,
    setMethods,
  ] = useState<
    WithdrawalMethod[]
  >([]);

  const [
    selectedWithdrawal,
    setSelectedWithdrawal,
  ] =
    useState<Withdrawal | null>(
      null
    );

  async function loadWithdrawals() {
    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/admin/withdrawals",
          {
            cache:
              "no-store",
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.message
        );
      }

      setWithdrawals(
        data
      );
    } catch (
      error
    ) {
      console.error(
        error
      );

      toast.error(
        "Failed to load withdrawals."
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  useEffect(() => {
    void loadWithdrawals();
  }, []);

  const filteredWithdrawals =
    useMemo(() => {
      return withdrawals.filter(
        (withdrawal) => {
          const search =
            filters.search
              .trim()
              .toLowerCase();

          const matchesSearch =
            search === "" ||
            withdrawal.reference
              .toLowerCase()
              .includes(search) ||
            withdrawal.user.name
              .toLowerCase()
              .includes(search) ||
            withdrawal.user.email
              .toLowerCase()
              .includes(search);

          const matchesMethod =
            filters.methodId ===
              "ALL" ||
            withdrawal.method.id ===
              filters.methodId;

          return (
            matchesSearch &&
            matchesMethod
          );
        }
      );
    }, [
      withdrawals,
      filters,
    ]);

  async function updateWithdrawal(
    action: "approve" | "reject"
  ) {
    if (!selectedWithdrawal) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch(
        `/api/admin/withdrawals/${selectedWithdrawal.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Unable to update withdrawal."
        );
      }

      toast.success(data.message);

      setSelectedWithdrawal(null);

      await loadWithdrawals();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update withdrawal."
      );
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <>
      <div
        className="
          space-y-3
          sm:space-y-6
        "
      >
        <div
          className="
            flex
            flex-col
            gap-2.5
            lg:flex-row
            lg:items-center
            lg:justify-between
            sm:gap-2.5
          "
        >
          <div>
            <h1
              className="
                text-xl
                font-bold
                text-[var(--admin-foreground)]
                sm:text-2xl
              "
            >
              Withdrawal
              Requests
            </h1>

            <p
              className="
                mt-0.5
                text-[10px]
                leading-4
                text-[var(--admin-muted-foreground)]
                sm:mt-1
                sm:text-sm
                sm:leading-normal
              "
            >
              Review,
              approve,
              or reject
              withdrawal
              requests.
            </p>
          </div>

          <WithdrawalFilters
            filters={
              filters
            }
            methods={
              methods
            }
            onChange={
              setFilters
            }
          />
        </div>

        {loading ? (
          <div
            className="
              rounded-lg
              border
              border-[var(--admin-border)]
              bg-[var(--admin-card-bg)]
              p-6
              text-center
              text-[10px]
              text-[var(--admin-muted-foreground)]
              sm:rounded-xl
              sm:p-12
              sm:text-sm
            "
          >
            Loading
            withdrawals...
          </div>
        ) : (
          <WithdrawalTable
            withdrawals={
              filteredWithdrawals
            }
            onReview={
              setSelectedWithdrawal
            }
          />
        )}
      </div>

      <WithdrawalReviewModal
        open={
          selectedWithdrawal !==
          null
        }
        withdrawal={
          selectedWithdrawal
        }
        loading={
          actionLoading
        }
        onClose={() =>
          setSelectedWithdrawal(
            null
          )
        }
        onApprove={() =>
          void updateWithdrawal(
            "approve"
          )
        }
        onReject={() =>
          void updateWithdrawal(
            "reject"
          )
        }
      />
    </>
  );
}