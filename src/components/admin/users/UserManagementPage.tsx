"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { appToast } from "@/lib/toast";

import {
  activateUser,
  approveDeletion,
  deactivateUser,
  deleteUser,
  getUsers,
  restoreUser,
} from "./user.service";

import { UserFilters } from "./UserFilters";
import { UsersTable } from "./UsersTable";

import type {
  AdminUser,
  UserRole,
  UsersResponse,
  UserStatusFilter,
} from "./user.types";

import UserActionModal from "./UserActionModal";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export function UserManagementPage() {
  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<UserStatusFilter>("ALL");

  const [role, setRole] =
    useState<UserRole>("USER");

  const [page, setPage] =
    useState(DEFAULT_PAGE);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalUsers, setTotalUsers] =
    useState(0);

  const [selectedUser, setSelectedUser] =
    useState<AdminUser | null>(null);

  const [pendingAction, setPendingAction] =
    useState<
      | "activate"
      | "deactivate"
      | "restore"
      | "approveDeletion"
      | "delete"
      | null
    >(null);

  const [submitting, setSubmitting] =
    useState(false);

  const loadUsers =
    useCallback(async () => {
      try {
        setLoading(true);

        const response: UsersResponse =
          await getUsers({
            page,
            limit: DEFAULT_LIMIT,
            search,
            status,
            role,
          });

        setUsers(
          response.data.users,
        );

        setTotalPages(
          response.data
            .pagination
            .totalPages,
        );

        setTotalUsers(
          response.data
            .pagination
            .total,
        );
      } catch (error) {
        appToast.error(
          error instanceof Error
            ? error.message
            : "Unable to load users.",
        );
      } finally {
        setLoading(false);
      }
    }, [
      page,
      search,
      status,
      role,
    ]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  function handleSearchChange(
    value: string,
  ) {
    setPage(1);
    setSearch(value);
  }

  function handleStatusChange(
    value: UserStatusFilter,
  ) {
    setPage(1);
    setStatus(value);
  }

  function handleRoleChange(
    value: UserRole,
  ) {
    setPage(1);
    setRole(value);
  }

  function handleUserAction(
    user: AdminUser,
    action:
      | "activate"
      | "deactivate"
      | "restore"
      | "approveDeletion"
      | "delete",
  ) {
    setSelectedUser(user);
    setPendingAction(action);
  }

  function handleRoleChangeAfterUpdate(
    userId: string,
    role: UserRole,
  ) {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              role,
            }
          : user,
      ),
    );
  }

  async function handleConfirmAction() {
    if (
      !selectedUser ||
      !pendingAction
    ) {
      return;
    }

    try {
      setSubmitting(true);

      switch (pendingAction) {
        case "activate":
          await activateUser(
            selectedUser.id,
          );
          break;

        case "deactivate":
          await deactivateUser(
            selectedUser.id,
          );
          break;

        case "restore":
          await restoreUser(
            selectedUser.id,
          );
          break;

        case "approveDeletion":
          await approveDeletion(
            selectedUser.id,
          );
          break;

        case "delete":
          await deleteUser(
            selectedUser.id,
          );
          break;
      }

      appToast.success(
        "User updated successfully.",
      );

      setSelectedUser(null);
      setPendingAction(null);

      await loadUsers();
    } catch (error) {
      appToast.error(
        error instanceof Error
          ? error.message
          : "Unable to update user.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
<header
  className="
    -mt-4
    flex
    flex-col
    gap-1
    sm:-mt-5
    sm:gap-2
  "
>
        <h1
          className="
            text-xl
            font-bold
            leading-6
            sm:text-3xl
            sm:leading-9
          "
          style={{
            color:
              "var(--admin-title)",
          }}
        >
          User Management
        </h1>

        <p
          className="
            text-xs
            leading-5
            sm:text-sm
          "
          style={{
            color:
              "var(--admin-muted)",
          }}
        >
          Manage user accounts, account status, and deletion requests.
        </p>

<p
  className="
    inline-flex
    w-fit
    items-center
    gap-1.5
    rounded-md
    border
    px-2
    py-0.5
    text-[11px]
    leading-4
    sm:gap-2
    sm:rounded-lg
    sm:px-2.5
    sm:py-1
    sm:text-xs
  "
  style={{
    background:
      "var(--admin-input-bg)",
    borderColor:
      "var(--admin-card-border)",
  }}
>
  <span
    className="
      font-medium
    "
    style={{
      color:
        "var(--admin-muted)",
    }}
  >
    Total {role === "ADMIN"
      ? "Admins"
      : "Users"}:
  </span>

  <span
    className="
      flex
      h-4
      min-w-4
      items-center
      justify-center
      rounded-full
      px-1
      text-[9px]
      font-bold
      leading-none
      tabular-nums
      sm:h-5
      sm:min-w-5
      sm:px-1.5
      sm:text-[10px]
    "
    style={{
      background:
        "var(--admin-table-header-bg)",
      border:
        "1px solid var(--admin-card-border)",
      color:
        "var(--admin-table-title)",
      boxShadow:
        "0 1px 3px var(--admin-card-shadow)",
    }}
  >
    {totalUsers}
  </span>
</p>
      </header>

      <UserFilters
        search={search}
        status={status}
        role={role}
        onSearchChange={
          handleSearchChange
        }
        onStatusChange={
          handleStatusChange
        }
        onRoleChange={
          handleRoleChange
        }
      />

      <UsersTable
        users={users}
        loading={loading}
        onAction={
          handleUserAction
        }
        onRoleChange={
          handleRoleChangeAfterUpdate
        }
      />

      <footer
        className="
          flex
          items-center
          justify-between
          gap-2
          sm:gap-4
        "
      >
        <button
          type="button"
          onClick={() =>
            setPage(
              (current) =>
                Math.max(
                  1,
                  current - 1,
                ),
            )
          }
          disabled={
            page === 1 ||
            loading
          }
          className="
            h-8
            rounded-lg
            border
            px-3
            text-[11px]
            font-medium
            transition
            disabled:cursor-not-allowed
            disabled:opacity-50
            sm:h-9
            sm:rounded-xl
            sm:px-4
            sm:text-sm
          "
          style={{
            background:
              "var(--admin-button-secondary-bg)",
            borderColor:
              "var(--admin-button-secondary-border)",
            color:
              "var(--admin-button-secondary-text)",
          }}
        >
          Previous
        </button>

        <span
          className="
            whitespace-nowrap
            text-[11px]
            sm:text-sm
          "
          style={{
            color:
              "var(--admin-muted)",
          }}
        >
          Page {page} of {totalPages}
        </span>

<button
  type="button"
  onClick={() =>
    setPage(
      (current) =>
        Math.min(
          totalPages,
          current + 1,
        ),
    )
  }
  disabled={
    page >=
      totalPages ||
    loading
  }
  className="
    h-8
    rounded-lg
    border
    px-3
    text-[11px]
    font-medium
    transition
    disabled:cursor-not-allowed
    disabled:opacity-50
    sm:h-9
    sm:rounded-xl
    sm:px-4
    sm:text-sm
  "
  style={{
    background:
      "var(--admin-table-header-bg)",
    color:
      "var(--admin-table-title)",
    borderColor:
      "var(--admin-card-border)",
    boxShadow:
      "0 1px 3px var(--admin-card-shadow)",
  }}
>
  Next
</button>
      </footer>

      <UserActionModal
        open={
          selectedUser !== null &&
          pendingAction !== null
        }
        user={selectedUser}
        action={pendingAction}
        loading={submitting}
        onClose={() => {
          if (submitting) {
            return;
          }

          setSelectedUser(null);
          setPendingAction(null);
        }}
        onConfirm={
          handleConfirmAction
        }
      />
    </>
  );
}