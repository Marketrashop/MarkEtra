"use client";

import {
  useEffect,
} from "react";

import {
  X,
} from "lucide-react";

import AddressForm from "./AddressForm";

import type {
  Address,
  AddressFormValues,
} from "./addresses.types";

type AddressModalProps = {
  open: boolean;

  address?: Address | null;

  submitting?: boolean;

  onClose: () => void;

  onSubmit: (
    values: AddressFormValues,
  ) => Promise<void> | void;
};

export default function AddressModal({
  open,
  address = null,
  submitting = false,
  onClose,
  onSubmit,
}: AddressModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape" &&
        !submitting
      ) {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    open,
    submitting,
    onClose,
  ]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-[var(--overlay)]
        p-2
        sm:p-5
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="address-modal-title"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          if (!submitting) {
            onClose();
          }
        }
      }}
    >
      <div
        className="
          w-full
          max-w-xl
          max-h-[calc(100vh-16px)]
          overflow-y-auto
          rounded-xl
          border
          border-[var(--user-card-border)]
          bg-[var(--user-card-bg)]
          shadow-[var(--user-card-shadow)]
          sm:max-h-[calc(100vh-40px)]
          sm:rounded-2xl
        "
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div
          className="
            sticky
            top-0
            z-10
            flex
            items-center
            justify-between
            gap-2
            border-b
            border-[var(--user-card-border)]
            bg-[var(--user-card-bg)]
            px-3
            py-2.5
            sm:gap-3
            sm:px-4
            sm:py-3
          "
        >
          <div className="min-w-0">
            <h2
              id="address-modal-title"
              className="
                text-[13px]
                font-semibold
                text-[var(--user-title)]
                sm:text-sm
              "
            >
              {address
                ? "Edit address"
                : "Add address"}
            </h2>

            <p
              className="
                mt-0.5
                text-[9px]
                leading-4
                text-[var(--user-text-muted)]
                sm:text-[10px]
                sm:leading-normal
              "
            >
              {address
                ? "Update your saved delivery details."
                : "Save a delivery address for faster checkout."}
            </p>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            aria-label="Close address dialog"
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-md
              text-[var(--user-text-muted)]
              transition
              hover:bg-[var(--user-stat-bg)]
              hover:text-[var(--user-title)]
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:h-8
              sm:w-8
              sm:rounded-lg
            "
          >
            <X
              size={14}
              className="sm:h-4 sm:w-4"
            />
          </button>
        </div>

        <div
          className="
            p-3
            sm:p-5
          "
        >
          <AddressForm
            address={address}
            submitting={submitting}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}