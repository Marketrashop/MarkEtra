"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Loader2,
  Plus,
} from "lucide-react";

import {
  toast,
} from "sonner";

import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import AddressCard from "./AddressCard";
import AddressEmptyState from "./AddressEmptyState";
import AddressModal from "./AddressModal";

import type {
  Address,
  AddressFormValues,
} from "./addresses.types";

export default function AddressesPage() {
  const [
    addresses,
    setAddresses,
  ] = useState<Address[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    deletingId,
    setDeletingId,
  ] = useState<string | null>(
    null,
  );

  const [
    updatingPrimaryId,
    setUpdatingPrimaryId,
  ] = useState<string | null>(
    null,
  );

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    editingAddress,
    setEditingAddress,
  ] = useState<Address | null>(
    null,
  );

  const loadAddresses =
    useCallback(
      async () => {
        try {
          setLoading(true);

          const response =
            await fetch(
              "/api/addresses",
              {
                cache:
                  "no-store",
                credentials:
                  "include",
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
                "Unable to load addresses.",
            );
          }

          setAddresses(
            result.data,
          );
        } catch (error) {
          console.error(
            "Addresses load error:",
            error,
          );

          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load addresses.",
          );
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    void loadAddresses();
  }, [
    loadAddresses,
  ]);

  function openCreateModal() {
    setEditingAddress(
      null,
    );

    setModalOpen(true);
  }

  function openEditModal(
    address: Address,
  ) {
    setEditingAddress(
      address,
    );

    setModalOpen(true);
  }

  function closeModal() {
    if (submitting) {
      return;
    }

    setModalOpen(false);

    setEditingAddress(
      null,
    );
  }

  async function handleSubmit(
    values: AddressFormValues,
  ) {
    try {
      setSubmitting(true);

      const editing =
        Boolean(
          editingAddress,
        );

      const response =
        await fetch(
          editing
            ? `/api/addresses/${editingAddress?.id}`
            : "/api/addresses",
          {
            method:
              editing
                ? "PATCH"
                : "POST",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                values,
              ),
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
            "Unable to save address.",
        );
      }

      await loadAddresses();

      setModalOpen(false);

      setEditingAddress(
        null,
      );

      toast.success(
        editing
          ? "Address updated successfully."
          : "Address added successfully.",
      );
    } catch (error) {
      console.error(
        "Address save error:",
        error,
      );

      throw new Error(
        error instanceof Error
          ? error.message
          : "Unable to save address.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(
    address: Address,
  ) {
    const confirmed =
      window.confirm(
        address.isPrimary
          ? "Delete your primary address? Another saved address will become primary."
          : "Delete this saved address?",
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        address.id,
      );

      const response =
        await fetch(
          `/api/addresses/${address.id}`,
          {
            method:
              "DELETE",

            credentials:
              "include",
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
            "Unable to delete address.",
        );
      }

      setAddresses(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              address.id,
          ),
      );

      await loadAddresses();

      toast.success(
        "Address deleted successfully.",
      );
    } catch (error) {
      console.error(
        "Address delete error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete address.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSetPrimary(
    address: Address,
  ) {
    if (
      address.isPrimary ||
      updatingPrimaryId
    ) {
      return;
    }

    try {
      setUpdatingPrimaryId(
        address.id,
      );

      const response =
        await fetch(
          `/api/addresses/${address.id}`,
          {
            method:
              "PATCH",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                fullName:
                  address.fullName,

                phoneNumber:
                  address.phoneNumber,

                alternatePhoneNumber:
                  address.alternatePhoneNumber,

                addressLine1:
                  address.addressLine1,

                addressLine2:
                  address.addressLine2,

                city:
                  address.city,

                state:
                  address.state,

                country:
                  address.country,

                postalCode:
                  address.postalCode,

                isPrimary:
                  true,
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
            "Unable to update primary address.",
        );
      }

      await loadAddresses();

      toast.success(
        "Primary address updated.",
      );
    } catch (error) {
      console.error(
        "Primary address error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update primary address.",
      );
    } finally {
      setUpdatingPrimaryId(
        null,
      );
    }
  }

  const updating =
    deletingId !== null ||
    updatingPrimaryId !== null;

  return (
    <DashboardPageLayout
      environment="user"
      breadcrumb={[
        {
          label: "Addresses",
        },
      ]}
    >
      <div
        className="
          mx-auto
          w-full
          max-w-5xl
          pb-10
          sm:pb-16
        "
      >
        <div
          className="
            flex
            items-end
            justify-between
            gap-2.5
            sm:gap-4
          "
        >
          <div className="min-w-0">
            <h1
              className="
                text-[16px]
                font-semibold
                text-[var(--user-title)]
                sm:text-lg
              "
            >
              Delivery addresses
            </h1>

            <p
              className="
                mt-0.5
                max-w-xl
                text-[10px]
                leading-4
                text-[var(--user-text-muted)]
                sm:mt-1
                sm:text-xs
                sm:leading-5
              "
            >
              Save your delivery details for
              faster checkout and keep a primary
              address ready for your next order.
            </p>
          </div>

          <button
            type="button"
            onClick={
              openCreateModal
            }
            className="
              inline-flex
              h-8
              shrink-0
              items-center
              gap-1.5
              rounded-lg
              bg-[#5b5ef7]
              px-2.5
              text-[10px]
              font-semibold
              text-white
              transition
              hover:opacity-90
              sm:h-9
              sm:gap-2
              sm:px-3.5
              sm:text-xs
            "
          >
            <Plus
              size={13}
              className="sm:h-[14px] sm:w-[14px]"
            />

            <span className="hidden sm:inline">
              Add address
            </span>

            <span className="sm:hidden">
              Add
            </span>
          </button>
        </div>

        <div
          className="
            mt-4
            sm:mt-5
          "
        >
          {loading ? (
            <div
              className="
                flex
                min-h-[180px]
                items-center
                justify-center
                rounded-lg
                border
                border-[var(--user-card-border)]
                bg-[var(--user-card-bg)]
                shadow-[var(--user-card-shadow)]
                sm:min-h-[220px]
                sm:rounded-xl
              "
            >
              <Loader2
                size={18}
                className="
                  animate-spin
                  text-[var(--primary)]
                  sm:h-5
                  sm:w-5
                "
              />
            </div>
          ) : addresses.length ===
            0 ? (
            <AddressEmptyState
              onAdd={
                openCreateModal
              }
            />
          ) : (
            <div
              className="
                grid
                gap-2
                md:grid-cols-2
                md:gap-3
              "
            >
              {addresses.map(
                (address) => (
                  <AddressCard
                    key={
                      address.id
                    }
                    address={
                      address
                    }
                    updating={
                      updating
                    }
                    onEdit={
                      openEditModal
                    }
                    onDelete={
                      handleDelete
                    }
                    onSetPrimary={
                      handleSetPrimary
                    }
                  />
                ),
              )}
            </div>
          )}
        </div>
      </div>

      <AddressModal
        open={
          modalOpen
        }
        address={
          editingAddress
        }
        submitting={
          submitting
        }
        onClose={
          closeModal
        }
        onSubmit={
          handleSubmit
        }
      />
    </DashboardPageLayout>
  );
}