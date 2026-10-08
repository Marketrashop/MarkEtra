"use client";

import {
  Check,
  Edit3,
  MapPin,
  MoreVertical,
  Star,
  Trash2,
} from "lucide-react";

import type {
  Address,
} from "./addresses.types";

type AddressCardProps = {
  address: Address;

  onEdit: (
    address: Address,
  ) => void;

  onDelete: (
    address: Address,
  ) => void;

  onSetPrimary: (
    address: Address,
  ) => void;

  updating?: boolean;
};

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetPrimary,
  updating = false,
}: AddressCardProps) {
  return (
    <article
      className="
        relative
        rounded-lg
        border
        border-[var(--user-card-border)]
        bg-[var(--user-card-bg)]
        p-2.5
        shadow-[var(--user-card-shadow)]
        transition-all
        duration-200
        hover:border-[var(--primary)]/30
        sm:rounded-xl
        sm:p-3
      "
    >
      <div
        className="
          flex
          items-start
          gap-2
          sm:gap-3
        "
      >
        <div
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-md
            bg-[var(--user-stat-bg)]
            text-[var(--primary)]
            sm:h-8
            sm:w-8
            sm:rounded-lg
          "
        >
          <MapPin
            size={13}
            className="sm:h-[15px] sm:w-[15px]"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-1.5
              sm:gap-2
            "
          >
            <h3
              className="
                truncate
                text-[12px]
                font-semibold
                text-[var(--user-title)]
                sm:text-sm
              "
            >
              {address.fullName}
            </h3>

            {address.isPrimary && (
              <span
                className="
                  inline-flex
                  items-center
                  gap-0.5
                  rounded-full
                  border
                  border-[var(--user-badge-success-border)]
                  bg-[var(--user-badge-success-bg)]
                  px-1.5
                  py-0.5
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.05em]
                  text-[var(--user-badge-success-text)]
                  sm:gap-1
                  sm:px-2
                  sm:text-[9px]
                  sm:tracking-[0.06em]
                "
              >
                <Star
                  size={8}
                  fill="currentColor"
                  className="sm:h-[9px] sm:w-[9px]"
                />

                Primary
              </span>
            )}
          </div>

          <div
            className="
              mt-1.5
              space-y-0.5
              text-[10px]
              leading-4
              text-[var(--user-text-muted)]
              sm:mt-2
              sm:text-xs
              sm:leading-5
            "
          >
            <p className="break-words">
              {address.addressLine1}
            </p>

            {address.addressLine2 && (
              <p className="break-words">
                {address.addressLine2}
              </p>
            )}

            <p>
              {[
                address.city,
                address.state,
                address.postalCode,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>

            <p>
              {address.country}
            </p>

            <p className="pt-0.5 sm:pt-1">
              {address.phoneNumber}

              {address.alternatePhoneNumber && (
                <>
                  {" "}
                  •{" "}
                  {
                    address.alternatePhoneNumber
                  }
                </>
              )}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <div
            className="
              flex
              items-center
              gap-0.5
              sm:gap-1
            "
          >
            {!address.isPrimary && (
              <button
                type="button"
                disabled={updating}
                onClick={() =>
                  onSetPrimary(
                    address,
                  )
                }
                aria-label="Set as primary address"
                title="Set as primary"
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-md
                  text-[var(--user-text-muted)]
                  transition
                  hover:bg-[var(--user-stat-bg)]
                  hover:text-[var(--primary)]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:h-8
                  sm:w-8
                  sm:rounded-lg
                "
              >
                <Check
                  size={13}
                  className="sm:h-[15px] sm:w-[15px]"
                />
              </button>
            )}

            <button
              type="button"
              disabled={updating}
              onClick={() =>
                onEdit(address)
              }
              aria-label="Edit address"
              title="Edit address"
              className="
                flex
                h-7
                w-7
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
              <Edit3
                size={13}
                className="sm:h-[15px] sm:w-[15px]"
              />
            </button>

            <button
              type="button"
              disabled={updating}
              onClick={() =>
                onDelete(address)
              }
              aria-label="Delete address"
              title="Delete address"
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-md
                text-[var(--user-text-muted)]
                transition
                hover:bg-[var(--user-stat-bg)]
                hover:text-[var(--user-badge-danger-text)]
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:h-8
                sm:w-8
                sm:rounded-lg
              "
            >
              <Trash2
                size={13}
                className="sm:h-[15px] sm:w-[15px]"
              />
            </button>

            <button
              type="button"
              disabled
              aria-hidden="true"
              tabIndex={-1}
              className="
                hidden
                h-7
                w-7
                items-center
                justify-center
                rounded-md
                text-[var(--user-text-muted)]
                sm:h-8
                sm:w-8
                sm:rounded-lg
              "
            >
              <MoreVertical
                size={13}
                className="sm:h-[15px] sm:w-[15px]"
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}