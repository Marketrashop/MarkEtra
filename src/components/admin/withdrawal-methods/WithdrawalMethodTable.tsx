"use client";

import { useMemo, useState } from "react";

import {
  Plus,
  Search,
} from "lucide-react";

import WithdrawalMethodCard from "./WithdrawalMethodCard";
import WithdrawalMethodModal from "./WithdrawalMethodModal";
import WithdrawalMethodDeleteModal from "./WithdrawalMethodDeleteModal";

import type {
  WithdrawalMethod,
  WithdrawalMethodFormValues,
} from "./withdrawal-method.types";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

const EMPTY_FORM: WithdrawalMethodFormValues = {
  type: "crypto",
  name: "",
  symbol: "",
  network: "",
  placeholder: "",
  fee: 0,
  feeType: "fixed",
  minimumAmount: 0,
  maximumAmount: null,
  icon: null,
};

type WithdrawalMethodTableProps = {
  methods: WithdrawalMethod[];
};

export default function WithdrawalMethodTable({
  methods,
}: WithdrawalMethodTableProps) {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    createOpen,
    setCreateOpen,
  ] = useState(false);

  const [
    editing,
    setEditing,
  ] =
    useState<WithdrawalMethod | null>(
      null
    );

  const [
    deleting,
    setDeleting,
  ] =
    useState<WithdrawalMethod | null>(
      null
    );

  const [
    form,
    setForm,
  ] = useState<WithdrawalMethodFormValues>(
    EMPTY_FORM
  );

  const router = useRouter();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const filteredMethods =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return methods;
      }

      return methods.filter(
        (method) =>
          method.name
            .toLowerCase()
            .includes(keyword) ||
          method.symbol
            .toLowerCase()
            .includes(keyword) ||
          method.type
            .toLowerCase()
            .includes(keyword)
      );
    }, [
      methods,
      search,
    ]);

  async function handleCreate() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/withdrawal-methods",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Failed to create withdrawal method.",
        );
      }

      toast.success(
        "Withdrawal method created.",
      );

      setCreateOpen(false);
      setForm(EMPTY_FORM);

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (!editing) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/withdrawal-methods/${editing.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Failed to update withdrawal method.",
        );
      }

      toast.success(
        "Withdrawal method updated.",
      );

      setEditing(null);
      setForm(EMPTY_FORM);

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleting) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/withdrawal-methods/${deleting.id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Failed to delete withdrawal method.",
        );
      }

      toast.success(
        "Withdrawal method deleted.",
      );

      setDeleting(null);

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div
        className="
          rounded-[var(--admin-card-radius)]
          border
          border-[var(--admin-card-border)]
          bg-[var(--admin-card-bg)]
          shadow-[var(--admin-card-shadow)]
          transition-all
          duration-[var(--admin-card-transition)]
        "
      >
        <div
          className="
            flex
            flex-col
            gap-2.5
            border-b
            border-[var(--admin-card-border)]
            p-2.5
            sm:gap-4
            sm:p-6
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div>
            <h2
              className="
                text-sm
                font-bold
                text-[var(--admin-title)]
                sm:text-xl
              "
            >
              Withdrawal Methods
            </h2>

            <p
              className="
                mt-0.5
                text-[10px]
                leading-4
                text-[var(--admin-muted)]
                sm:mt-1
                sm:text-sm
              "
            >
              Manage crypto and bank withdrawal methods.
            </p>
          </div>

          <div
            className="
              flex
              flex-col
              gap-1.5
              sm:flex-row
              sm:gap-3
            "
          >
            <div
              className="
                relative
                w-full
                sm:w-auto
              "
            >
              <Search
                size={14}
                className="
                  absolute
                  left-2
                  top-1/2
                  -translate-y-1/2
                  text-[var(--admin-muted)]
                  sm:left-3
                  sm:h-[18px]
                  sm:w-[18px]
                "
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search methods..."
                className="
                  h-7
                  w-full
                  rounded-md
                  border
                  border-[var(--admin-input-border)]
                  bg-[var(--admin-input-bg)]
                  pl-7
                  pr-2
                  text-[9px]
                  text-[var(--admin-input-text)]
                  outline-none
                  placeholder:text-[var(--admin-input-placeholder)]
                  focus:border-[var(--admin-input-focus)]
                  sm:h-11
                  sm:rounded-[var(--admin-input-radius)]
                  sm:pl-10
                  sm:pr-4
                  sm:text-sm
                  sm:w-72
                "
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setForm(EMPTY_FORM);
                setCreateOpen(true);
              }}
              className="
                inline-flex
                h-7
                items-center
                justify-center
                gap-1
                rounded-md
                border
                px-2.5
                text-[9px]
                font-semibold
                transition-all
                duration-300
                hover:opacity-90
                sm:h-11
                sm:gap-2
                sm:rounded-[var(--admin-input-radius)]
                sm:px-5
                sm:text-sm
              "
              style={{
                background: "var(--admin-table-header-bg)",
                color: "var(--admin-table-title)",
                borderColor: "var(--admin-card-border)",
                boxShadow: "0 1px 3px var(--admin-card-shadow)",
              }}
            >
              <Plus
                size={12}
                className="sm:h-[18px] sm:w-[18px]"
              />

              Add Method
            </button>
          </div>
        </div>

        {filteredMethods.length === 0 ? (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              px-3
              py-8
              text-center
              sm:px-6
              sm:py-20
            "
          >
            <h3
              className="
                text-xs
                font-semibold
                text-[var(--admin-title)]
                sm:text-lg
              "
            >
              No withdrawal methods found
            </h3>

            <p
              className="
                mt-0.5
                max-w-md
                text-[10px]
                leading-4
                text-[var(--admin-muted)]
                sm:mt-2
                sm:text-sm
              "
            >
              Create your first withdrawal method or adjust your search.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table
                className="
                  min-w-full
                  border-collapse
                "
              >
                <thead
                  className="
                    bg-[var(--admin-table-header-bg)]
                  "
                >
                  <tr>
                    {[
                      "Method",
                      "Type",
                      "Fee",
                      "Status",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="
                          px-6
                          py-4
                          text-left
                          text-sm
                          font-semibold
                          text-[var(--admin-table-header-text)]
                        "
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredMethods.map(
                    (method) => (
                      <WithdrawalMethodCard
                        key={method.id}
                        method={method}
                        desktop
                        onEdit={() => {
                          setEditing(method);

                          setForm({
                            type: method.type,
                            name: method.name,
                            symbol: method.symbol,
                            network:
                              method.network ?? "",
                            placeholder:
                              method.placeholder,
                            fee: method.fee,
                            feeType:
                              method.feeType,
                            minimumAmount:
                              method.minimumAmount,
                            maximumAmount:
                              method.maximumAmount,
                            icon: method.icon,
                          });
                        }}
                        onDelete={() =>
                          setDeleting(
                            method
                          )
                        }
                      />
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div
              className="
                space-y-2
                p-2
                sm:space-y-4
                sm:p-4
                lg:hidden
              "
            >
              {filteredMethods.map(
                (method) => (
                  <WithdrawalMethodCard
                    key={method.id}
                    method={method}
                    onEdit={() => {
                      setEditing(method);

                      setForm({
                        type: method.type,
                        name: method.name,
                        symbol: method.symbol,
                        network:
                          method.network ?? "",
                        placeholder:
                          method.placeholder,
                        fee: method.fee,
                        feeType:
                          method.feeType,
                        minimumAmount:
                          method.minimumAmount,
                        maximumAmount:
                          method.maximumAmount,
                        icon: method.icon,
                      });
                    }}
                    onDelete={() =>
                      setDeleting(
                        method
                      )
                    }
                  />
                )
              )}
            </div>
          </>
        )}
      </div>

      <WithdrawalMethodModal
        open={createOpen}
        title="Add Withdrawal Method"
        description="Create a new withdrawal method."
        value={form}
        loading={loading}
        onChange={setForm}
        onSubmit={handleCreate}
        onClose={() => {
          if (loading) return;

          setCreateOpen(false);
          setForm(EMPTY_FORM);
        }}
      />

      <WithdrawalMethodModal
        open={Boolean(editing)}
        title="Edit Withdrawal Method"
        description="Update the selected withdrawal method."
        value={form}
        loading={loading}
        onChange={setForm}
        onSubmit={handleUpdate}
        onClose={() => {
          if (loading) return;

          setEditing(null);
          setForm(EMPTY_FORM);
        }}
      />

      <WithdrawalMethodDeleteModal
        open={Boolean(deleting)}
        loading={loading}
        method={deleting ?? undefined}
        onDelete={handleDelete}
        onClose={() => {
          if (loading) return;

          setDeleting(null);
        }}
      />
    </>
  );
}