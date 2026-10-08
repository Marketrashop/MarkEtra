"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { toast } from "sonner";

import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import WalletPageHeader from "@/components/admin/Wallet/WalletPageHeader";
import WalletSearch from "@/components/admin/Wallet/WalletSearch";
import WalletUsersTable from "@/components/admin/Wallet/WalletUsersTable";
import WalletActionModal from "@/components/admin/Wallet/WalletActionModal";
import WalletLoadingSkeleton from "@/components/admin/Wallet/WalletLoadingSkeleton";
import WalletEmptyState from "@/components/admin/Wallet/WalletEmptyState";

import type {
  WalletAction,
  WalletAdjustmentResponse,
  WalletBalanceType,
  WalletUser,
  WalletUsersResponse,
} from "@/components/admin/Wallet/wallet.types";

export default function AdminWalletPage() {
  const [users, setUsers] = useState<
    WalletUser[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [search, setSearch] =
    useState("");

  const [
    selectedUser,
    setSelectedUser,
  ] = useState<WalletUser | null>(
    null,
  );

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const fetchUsers =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await fetch(
            "/api/admin/wallet/users",
            {
              cache: "no-store",
            },
          );

        const result: WalletUsersResponse =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            "Unable to load users.",
          );
        }

        setUsers(
          result.data,
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load users.",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const filteredUsers =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return users;
      }

      return users.filter(
        (user) => {
          const fullName =
            `${user.firstName} ${user.lastName}`.toLowerCase();

          return (
            fullName.includes(
              query,
            ) ||
            user.email
              .toLowerCase()
              .includes(query)
          );
        },
      );
    }, [users, search]);

  async function handleSubmit(
    balanceType: WalletBalanceType,
    action: WalletAction,
    amount: number,
  ) {
    if (!selectedUser) {
      return;
    }

    try {
      setSubmitting(true);

      const response =
        await fetch(
          "/api/admin/wallet/adjust",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              userId:
                selectedUser.id,

              balanceType,

              action,

              amount,
            }),
          },
        );

      const result: WalletAdjustmentResponse =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Wallet adjustment failed.",
        );
      }

      toast.success(
        result.message,
      );

      setUsers((current) =>
        current.map(
          (user) => {
            if (
              user.id !==
              selectedUser.id
            ) {
              return user;
            }

            if (
              balanceType ===
              "wallet"
            ) {
              return {
                ...user,

                wallet: {
                  id:
                    user.wallet?.id ??
                    "",

                  availableBalance:
                    result.data.balance,

                  lockedBalance:
                    user.wallet
                      ?.lockedBalance ??
                    "0",
                },
              };
            }

            if (
              balanceType ===
              "profit"
            ) {
              return {
                ...user,

                profit:
                  result.data.balance,
              };
            }

            if (
              balanceType ===
              "totalDeposit"
            ) {
              return {
                ...user,

                totalDeposit:
                  result.data.balance,
              };
            }

            return {
              ...user,

              affiliateCommission:
                result.data.balance,
            };
          },
        ),
      );

      setModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Wallet adjustment failed.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardPageLayout
      environment="admin"
      breadcrumb={[
        {
          label: "Wallet",
        },
      ]}
    >
      <section className="py-6">
        <div
          className="
            flex
            flex-col
            gap-[var(--admin-page-gap)]
          "
        >
          <WalletPageHeader />

          <WalletSearch
            value={search}
            onChange={setSearch}
          />

          {loading ? (
            <WalletLoadingSkeleton />
          ) : filteredUsers.length ===
            0 ? (
            <WalletEmptyState />
          ) : (
            <WalletUsersTable
              users={filteredUsers}
              loading={loading}
              onManage={(
                user,
              ) => {
                setSelectedUser(
                  user,
                );

                setModalOpen(true);
              }}
            />
          )}

          <WalletActionModal
            open={modalOpen}
            user={selectedUser}
            loading={submitting}
            onClose={() => {
              setModalOpen(false);
              setSelectedUser(null);
            }}
            onSubmit={
              handleSubmit
            }
          />
        </div>
      </section>
    </DashboardPageLayout>
  );
}