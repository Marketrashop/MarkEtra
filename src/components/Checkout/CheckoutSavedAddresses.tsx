"use client";

import {
  Check,
  MapPin,
} from "lucide-react";

import type {
  Address,
} from "@/types/address.types";

type CheckoutSavedAddressesProps = {
  addresses: Address[];

  selectedAddressId:
    | string
    | null;

  onSelect: (
    address: Address,
  ) => void;

  onNewAddress: () => void;
};

export default function CheckoutSavedAddresses({
  addresses,
  selectedAddressId,
  onSelect,
  onNewAddress,
}: CheckoutSavedAddressesProps) {
  return (
    <div className="space-y-2">
      {addresses.map(
        (address) => {
          const selected =
            selectedAddressId ===
            address.id;

          return (
            <button
              key={address.id}
              type="button"
              onClick={() =>
                onSelect(address)
              }
              className={`
                w-full
                rounded-lg
                border
                p-3
                text-left
                transition-all
                duration-200
                ${
                  selected
                    ? "border-[var(--primary)] bg-[var(--surface-card)]"
                    : "border-[var(--user-card-border)] bg-[var(--user-card-bg)] hover:border-[var(--primary)]"
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`
                    mt-0.5
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    ${
                      selected
                        ? "bg-[var(--primary)] text-[var(--services-cta-primary-text)]"
                        : "bg-[var(--user-stat-bg)] text-[var(--user-text-muted)]"
                    }
                  `}
                >
                  {selected ? (
                    <Check
                      size={14}
                      strokeWidth={2.4}
                    />
                  ) : (
                    <MapPin
                      size={14}
                      strokeWidth={2}
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className="
                        truncate
                        text-xs
                        font-semibold
                        text-[var(--user-title)]
                      "
                    >
                      {address.label ??
                        "Saved Address"}
                    </p>

                    {address.isPrimary && (
                      <span
                        className="
                          shrink-0
                          rounded-full
                          border
                          border-[var(--user-card-border)]
                          px-2
                          py-0.5
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-wide
                          text-[var(--user-text-muted)]
                        "
                      >
                        Primary
                      </span>
                    )}
                  </div>

                  <p
                    className="
                      mt-1
                      truncate
                      text-xs
                      font-medium
                      text-[var(--user-title)]
                    "
                  >
                    {address.fullName}
                  </p>

                  <p
                    className="
                      mt-0.5
                      truncate
                      text-[11px]
                      text-[var(--user-text-muted)]
                    "
                  >
                    {address.addressLine1}
                  </p>

                  <p
                    className="
                      mt-0.5
                      truncate
                      text-[11px]
                      text-[var(--user-text-muted)]
                    "
                  >
                    {[
                      address.city,
                      address.state,
                      address.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[11px]
                      text-[var(--user-text-muted)]
                    "
                  >
                    {address.phoneNumber}
                  </p>
                </div>
              </div>
            </button>
          );
        },
      )}

      <button
        type="button"
        onClick={onNewAddress}
        className="
          flex
          w-full
          items-center
          justify-center
          rounded-lg
          border
          border-dashed
          border-[var(--user-card-border)]
          px-3
          py-2.5
          text-xs
          font-medium
          text-[var(--user-text-muted)]
          transition-all
          duration-200
          hover:border-[var(--primary)]
          hover:text-[var(--user-title)]
        "
      >
        + Use a new address
      </button>
    </div>
  );
}