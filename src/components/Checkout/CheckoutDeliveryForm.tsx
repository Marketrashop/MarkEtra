"use client";

import { useState } from "react";
import type { Address } from "@/types/address.types";
import type { CheckoutDeliveryDetails } from "@/types/checkout.types";
import { CountrySelect } from "@/components/ui/CountrySelect";

type CheckoutDeliveryFormProps = {
  addresses: Address[];

  selectedAddressId:
    | string
    | null;

  useNewAddress: boolean;

  delivery: CheckoutDeliveryDetails;

  saveAsPrimary: boolean;

  onSelectAddress: (
    address: Address,
  ) => void;

  onNewAddress: () => void;

  onDeliveryChange: (
    delivery: CheckoutDeliveryDetails,
  ) => void;

  onSaveAsPrimaryChange: (
    value: boolean,
  ) => void;
};

export default function CheckoutDeliveryForm({
  addresses,
  selectedAddressId,
  useNewAddress,
  delivery,
  saveAsPrimary,
  onSelectAddress,
  onNewAddress,
  onDeliveryChange,
  onSaveAsPrimaryChange,
}: CheckoutDeliveryFormProps) {
  const [
    showAddressLine2,
    setShowAddressLine2,
  ] = useState(
    Boolean(
      delivery.addressLine2,
    ),
  );

  const [
    showAlternatePhone,
    setShowAlternatePhone,
  ] = useState(
    Boolean(
      delivery.alternatePhoneNumber,
    ),
  );

function updateField(
 field: keyof CheckoutDeliveryDetails,
 value: string,
) {
  const nullableFields: Array<
    keyof CheckoutDeliveryDetails
  > = [
    "alternatePhoneNumber",
    "addressLine2",
    "state",
    "postalCode",
  ];

  const nextValue =
    field === "phoneNumber" ||
    field === "alternatePhoneNumber"
      ? sanitizePhone(value)
      : value;

  onDeliveryChange({
    ...delivery,
    [field]: nullableFields.includes(field)
      ? nextValue.trim() === ""
        ? null
        : nextValue
      : nextValue,
  });
}

  return (
    <section
      className="
        rounded-xl
        border
        border-[var(--user-card-border)]
        bg-[var(--user-card-bg)]
        p-4
        shadow-[var(--user-card-shadow)]
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <div>
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-[var(--user-text-muted)]
            "
          >
            Step 1
          </p>

          <h2
            className="
              mt-1
              text-sm
              font-semibold
              text-[var(--user-title)]
            "
          >
            Delivery details
          </h2>

          <p
            className="
              mt-1
              text-xs
              text-[var(--user-text-muted)]
            "
          >
            Choose a saved address or enter
            a new delivery address.
          </p>
        </div>

        {!useNewAddress &&
          selectedAddressId && (
            <span
              className="
                shrink-0
                rounded-full
                border
                border-[var(--user-card-border)]
                px-2.5
                py-1
                text-[10px]
                font-medium
                text-[var(--user-text-muted)]
              "
            >
              Selected
            </span>
          )}
      </div>

      {addresses.length > 0 && (
        <div
          className="
            mt-4
            flex
            flex-wrap
            gap-2
          "
        >
          {addresses.map(
            (address) => {
              const selected =
                !useNewAddress &&
                selectedAddressId ===
                  address.id;

              return (
                <button
                  key={
                    address.id
                  }
                  type="button"
                  onClick={() =>
                    onSelectAddress(
                      address,
                    )
                  }
                  className={`
                    min-w-0
                    rounded-lg
                    border
                    px-3
                    py-2
                    text-left
                    transition
                    ${
                      selected
                        ? "border-[var(--primary)] bg-[var(--surface-card)]"
                        : "border-[var(--user-card-border)] hover:border-[var(--primary)]"
                    }
                  `}
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <span
                      className="
                        truncate
                        text-xs
                        font-semibold
                        text-[var(--user-title)]
                      "
                    >
                      {address.label ??
                        "Address"}
                    </span>

                    {address.isPrimary && (
                      <span
                        className="
                          shrink-0
                          text-[10px]
                          text-[var(--user-text-muted)]
                        "
                      >
                        Primary
                      </span>
                    )}
                  </div>

                  <p
                    className="
                      mt-0.5
                      max-w-[220px]
                      truncate
                      text-[11px]
                      text-[var(--user-text-muted)]
                    "
                  >
                    {address.city}
                    {address.country
                      ? `, ${address.country}`
                      : ""}
                  </p>
                </button>
              );
            },
          )}

          <button
            type="button"
            onClick={
              onNewAddress
            }
            className="
              rounded-lg
              border
              border-[var(--user-card-border)]
              px-3
              py-2
              text-xs
              font-medium
              text-[var(--user-text-muted)]
              transition
              hover:border-[var(--primary)]
              hover:text-[var(--user-title)]
            "
          >
            New address
          </button>
        </div>
      )}

      {addresses.length ===
        0 && (
        <div
          className="
            mt-4
            rounded-lg
            border
            border-[var(--user-card-border)]
            bg-[var(--user-stat-bg)]
            px-3
            py-2.5
            text-xs
            text-[var(--user-text-muted)]
          "
        >
          No saved addresses yet.
          Enter your delivery details below.
        </div>
      )}

      {useNewAddress && (
        <div
          className="
            mt-4
            grid
            gap-3
            sm:grid-cols-2
          "
        >
          <Field
            label="Full name"
            value={
              delivery.fullName
            }
            placeholder="Full name"
            onChange={(value) =>
              updateField(
                "fullName",
                value,
              )
            }
          />

          <Field
            label="Phone number"
            value={
              delivery.phoneNumber
            }
            placeholder="Phone number"
            type="tel"
            onChange={(value) =>
              updateField(
                "phoneNumber",
                value,
              )
            }
          />

          <div className="sm:col-span-2">
            <Field
              label="Address"
              value={
                delivery.addressLine1
              }
              placeholder="Street address"
              onChange={(value) =>
                updateField(
                  "addressLine1",
                  value,
                )
              }
            />
          </div>

          <Field
            label="City"
            value={
              delivery.city
            }
            placeholder="City"
            onChange={(value) =>
              updateField(
                "city",
                value,
              )
            }
          />

<CountrySelect
  compact
  label="Country"
  value={delivery.country as any}
  onChange={(country) =>
    updateField(
      "country",
      country,
    )
  }
/>

          {delivery.state !==
            null && (
            <Field
              label="State"
              value={
                delivery.state ??
                ""
              }
              placeholder="State"
              onChange={(value) =>
                updateField(
                  "state",
                  value,
                )
              }
            />
          )}

          {delivery.postalCode !==
            null && (
            <Field
              label="Postal code"
              value={
                delivery.postalCode ??
                ""
              }
              placeholder="Postal code"
              onChange={(value) =>
                updateField(
                  "postalCode",
                  value,
                )
              }
            />
          )}

          {showAddressLine2 && (
            <div className="sm:col-span-2">
              <Field
                label="Address line 2"
                value={
                  delivery.addressLine2 ??
                  ""
                }
                placeholder="Apartment, suite, unit, etc."
                onChange={(
                  value,
                ) =>
                  updateField(
                    "addressLine2",
                    value,
                  )
                }
              />
            </div>
          )}

          {showAlternatePhone && (
            <Field
              label="Alternative phone"
              value={
                delivery.alternatePhoneNumber ??
                ""
              }
              placeholder="Alternative phone"
              type="tel"
              onChange={(value) =>
                updateField(
                  "alternatePhoneNumber",
                  value,
                )
              }
            />
          )}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-4
              gap-y-2
              sm:col-span-2
            "
          >
            {!showAddressLine2 && (
              <button
                type="button"
                onClick={() =>
                  setShowAddressLine2(
                    true,
                  )
                }
                className="
                  text-xs
                  font-medium
                  text-[var(--primary)]
                  transition
                  hover:opacity-80
                "
              >
                + Address line 2
              </button>
            )}

            {!showAlternatePhone && (
              <button
                type="button"
                onClick={() =>
                  setShowAlternatePhone(
                    true,
                  )
                }
                className="
                  text-xs
                  font-medium
                  text-[var(--primary)]
                  transition
                  hover:opacity-80
                "
              >
                + Alternative phone
              </button>
            )}

            <label
              className="
                ml-auto
                flex
                cursor-pointer
                items-center
                gap-2
                text-xs
                text-[var(--user-text-muted)]
              "
            >
              <input
                type="checkbox"
                checked={
                  saveAsPrimary
                }
                onChange={(
                  event,
                ) =>
                  onSaveAsPrimaryChange(
                    event
                      .target
                      .checked,
                  )
                }
              />

              Save as primary
            </label>
          </div>
        </div>
      )}

      {!useNewAddress &&
        selectedAddressId && (
          <div
            className="
              mt-4
              grid
              gap-2
              rounded-lg
              border
              border-[var(--user-card-border)]
              bg-[var(--user-stat-bg)]
              px-3
              py-2.5
              text-xs
              sm:grid-cols-2
            "
          >
            <Detail
              label="Name"
              value={
                delivery.fullName
              }
            />

            <Detail
              label="Phone"
              value={
                delivery.phoneNumber
              }
            />

            <Detail
              label="Address"
              value={
                delivery.addressLine1
              }
            />

            <Detail
              label="Location"
              value={[
                delivery.city,
                delivery.state,
                delivery.country,
              ]
                .filter(Boolean)
                .join(", ")}
            />
          </div>
        )}
    </section>
  );
}

type FieldProps = {
  label: string;

  value: string | null;

  placeholder: string;

  type?: "text" | "tel";

  onChange: (
    value: string,
  ) => void;
};

function Field({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: FieldProps) {
  return (
    <label className="block">
      <span
        className="
          mb-1.5
          block
          text-[10px]
          font-medium
          uppercase
          tracking-[0.08em]
          text-[var(--user-text-muted)]
        "
      >
        {label}
      </span>

      <input
        type={type}
        value={value ?? ""}
        placeholder={
          placeholder
        }
        inputMode={
          type === "tel"
            ? "tel"
            : undefined
        }
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="
          h-10
          w-full
          rounded-lg
          border
          border-[var(--user-card-border)]
          bg-[var(--user-card-bg)]
          px-3
          text-sm
          text-[var(--user-title)]
          outline-none
          transition
          focus:border-[var(--primary)]
        "
      />
    </label>
  );
}

type DetailProps = {
  label: string;

  value: string;
};

function Detail({
  label,
  value,
}: DetailProps) {
  return (
    <div className="min-w-0">
      <p
        className="
          text-[10px]
          font-medium
          uppercase
          tracking-[0.08em]
          text-[var(--user-text-muted)]
        "
      >
        {label}
      </p>

      <p
        className="
          mt-0.5
          break-words
          text-xs
          font-medium
          text-[var(--user-title)]
        "
      >
        {value || "Not provided"}
      </p>
    </div>
  );
}

function sanitizePhone(
  value: string,
): string {
  const filtered =
    value.replace(
      /[^\d+()\s]/g,
      "",
    );

  if (!filtered.includes("+")) {
    return filtered;
  }

  if (filtered.startsWith("+")) {
    return (
      "+" +
      filtered
        .slice(1)
        .replace(/\+/g, "")
    );
  }

  return filtered.replace(
    /\+/g,
    "",
  );
}