"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import { AdminPageHeader } from "@/components/admin";

import DepositTable from "@/components/admin/deposits/DepositTable";
import DepositDetailsDrawer from "@/components/admin/deposits/DepositDetailsDrawer";
import ApproveDepositDialog from "@/components/admin/deposits/ApproveDepositDialog";
import RejectDepositDialog from "@/components/admin/deposits/RejectDepositDialog";
import LoadingSkeleton from "@/components/admin/deposits/LoadingSkeleton";
import EmptyState from "@/components/admin/deposits/EmptyState";
import DepositFilters from "@/components/admin/deposits/DepositFilters";

import type {
  Deposit,
  DepositFilters as DepositFiltersType,
  DepositMethod,
} from "@/components/admin/deposits/types";

export default function DepositsPage() {
  const [
    deposits,
    setDeposits,
  ] = useState<Deposit[]>([]);

  const [
    methods,
    setMethods,
  ] = useState<
    DepositMethod[]
  >([]);

  const [
    filters,
    setFilters,
  ] =
    useState<DepositFiltersType>({
      search: "",

      status: "ALL",

      methodId: "ALL",
    });

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    selectedDeposit,
    setSelectedDeposit,
  ] =
    useState<Deposit | null>(
      null,
    );

  const [
    detailsOpen,
    setDetailsOpen,
  ] = useState(false);

  const [
    approveOpen,
    setApproveOpen,
  ] = useState(false);

  const [
    rejectOpen,
    setRejectOpen,
  ] = useState(false);

const loadDeposits =
  useCallback(async (): Promise<
    Deposit[]
  > => {
      try {
        setLoading(true);

        setError("");

        const response =
          await fetch(
            "/api/admin/deposits",
            {
              cache: "no-store",
            },
          );

const result: {
  success: boolean;
  data: Deposit[];
  error?: string;
} = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ??
              "Unable to fetch deposits.",
          );
        }

const depositData: Deposit[] =
  result.data ?? [];

        setDeposits(
          depositData,
        );

const uniqueMethods = depositData.reduce<DepositMethod[]>(
  (
    accumulator: DepositMethod[],
    deposit: Deposit,
  ) => {
    const exists =
      accumulator.some(
        (method) =>
          method.id ===
          deposit.depositMethod.id,
      );

    if (!exists) {
      accumulator.push(
        deposit.depositMethod,
      );
    }

    return accumulator;
  },
  [],
);

setMethods(
  uniqueMethods,
);

return depositData;
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to fetch deposits.",
        );
        return [];
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadDeposits();
  }, [loadDeposits]);

  function handleView(
    deposit: Deposit,
  ) {
    setSelectedDeposit(
      deposit,
    );

    setDetailsOpen(true);
  }

  function closeDrawer() {
    setDetailsOpen(false);
  }

function openApproveDialog(deposit: Deposit) {
  setSelectedDeposit(deposit);
  setDetailsOpen(false);
  setApproveOpen(true);
}

function openRejectDialog(deposit: Deposit) {
  setSelectedDeposit(deposit);
  setDetailsOpen(false);
  setRejectOpen(true);
}

  function closeApproveDialog() {
    setApproveOpen(false);
  }

  function closeRejectDialog() {
    setRejectOpen(false);
  }

async function handleSuccess() {
  const latestDeposits =
    await loadDeposits();

  if (selectedDeposit) {
    const updatedDeposit =
      latestDeposits.find(
        (deposit) =>
          deposit.id ===
          selectedDeposit.id,
      ) ?? null;

    setSelectedDeposit(
      updatedDeposit,
    );
  }

  setDetailsOpen(false);

  setApproveOpen(false);
  setRejectOpen(false);
}


const filteredDeposits =
  useMemo(() => {
    const search =
      filters.search
        .trim()
        .toLowerCase();

    return deposits.filter(
      (deposit) => {
        const fullName =
          [
            deposit.user.firstName,
            deposit.user.lastName,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const matchesSearch =
          !search ||
          fullName.includes(
            search,
          ) ||
          deposit.user.email
            .toLowerCase()
            .includes(search) ||
          deposit.reference
            .toLowerCase()
            .includes(search);

        const matchesStatus =
          filters.status ===
            "ALL" ||
          deposit.status ===
            filters.status;

        const matchesMethod =
          filters.methodId ===
            "ALL" ||
          deposit.depositMethod
            .id ===
            filters.methodId;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesMethod
        );
      },
    );
  }, [
    deposits,
    filters,
  ]);


  return (
<DashboardPageLayout
  environment="admin"
  breadcrumb={[
        {
          label: "Deposits",
        },
      ]}
    >
      <div
        className="
          space-y-8
        "
      >
        <AdminPageHeader
          title="Deposits"
          description="Review and manage customer deposit requests."
        />

        <DepositFilters
          filters={filters}
          methods={methods}
          onChange={setFilters}
        />

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div
            className="
              rounded-2xl
              border
              border-red-500/20
              bg-red-500/5
              p-6
              text-sm
              text-red-500
            "
          >
            {error}
          </div>
        ) : filteredDeposits.length === 0 ? (
<EmptyState
  title="No matching deposits"
  description="Try changing your search or filter criteria."
  actionLabel="Clear Filters"
  onAction={() =>
    setFilters({
      search: "",
      status: "ALL",
      methodId: "ALL",
    })
  }
/>
        ) : (
<DepositTable
  deposits={
    filteredDeposits
  }
  onView={handleView}
/>
        )}

        <DepositDetailsDrawer
          open={detailsOpen}
          deposit={
            selectedDeposit
          }
          onClose={
            closeDrawer
          }
          onApprove={
            openApproveDialog
          }
          onReject={
            openRejectDialog
          }
        />

        <ApproveDepositDialog
          open={
            approveOpen
          }
          deposit={
            selectedDeposit
          }
          onClose={
            closeApproveDialog
          }
          onSuccess={
            handleSuccess
          }
        />

        <RejectDepositDialog
          open={
            rejectOpen
          }
          deposit={
            selectedDeposit
          }
          onClose={
            closeRejectDialog
          }
          onSuccess={
            handleSuccess
          }
        />
      </div>
</DashboardPageLayout>
  );
}