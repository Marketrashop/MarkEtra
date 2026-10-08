"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Loader2,
} from "lucide-react";

import type {
  Address,
  AddressFormValues,
} from "./addresses.types";

type AddressFormProps = {
  address?: Address | null;

  submitting?: boolean;

  onSubmit: (
    values: AddressFormValues,
  ) => Promise<void> | void;

  onCancel?: () => void;
};

const EMPTY_VALUES: AddressFormValues = {
  fullName: "",
  phoneNumber: "",
  alternatePhoneNumber:
    null,
  addressLine1: "",
  addressLine2: null,
  city: "",
  state: null,
  country: "",
  postalCode: null,
  isPrimary: false,
};

export default function AddressForm({
  address,
  submitting = false,
  onSubmit,
  onCancel,
}: AddressFormProps) {
  const [
    values,
    setValues,
  ] = useState<AddressFormValues>(
    EMPTY_VALUES,
  );

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    if (!address) {
      setValues(
        EMPTY_VALUES,
      );

      return;
    }

    setValues({
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
        address.isPrimary,
    });

    setError("");
  }, [address]);

  const isEditing =
    Boolean(address);

  const canSubmit =
    useMemo(
      () =>
        values.fullName.trim() &&
        values.phoneNumber.trim() &&
        values.addressLine1.trim() &&
        values.city.trim() &&
        values.country.trim(),
      [values],
    );

  function updateField<
    K extends keyof AddressFormValues,
  >(
    field: K,
    value: AddressFormValues[K],
  ) {
    const nextValue =
      field === "phoneNumber" ||
      field === "alternatePhoneNumber"
        ? sanitizePhone(
            value as string,
          )
        : value;

    setValues(
      (current) => ({
        ...current,
        [field]:
          nextValue,
      }),
    );

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    if (!canSubmit) {
      setError(
        "Complete all required address details.",
      );

      return;
    }

    const phoneDigits =
      phoneDigitCount(
        values.phoneNumber,
      );

    const alternatePhoneDigits =
      phoneDigitCount(
        values.alternatePhoneNumber ??
          "",
      );

    if (phoneDigits < 7) {
      setError(
        "Phone number must contain at least 7 digits.",
      );

      return;
    }

    if (
      values.alternatePhoneNumber?.trim() &&
      alternatePhoneDigits < 7
    ) {
      setError(
        "Alternate phone number must contain at least 7 digits.",
      );

      return;
    }

    try {
      setError("");

      await onSubmit({
        ...values,

        fullName:
          values.fullName.trim(),

        phoneNumber:
          values.phoneNumber.trim(),

        alternatePhoneNumber:
          values.alternatePhoneNumber
            ?.trim() || null,

        addressLine1:
          values.addressLine1.trim(),

        addressLine2:
          values.addressLine2
            ?.trim() || null,

        city:
          values.city.trim(),

        state:
          values.state
            ?.trim() || null,

        country:
          values.country.trim(),

        postalCode:
          values.postalCode
            ?.trim() || null,
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to save address.",
      );
    }
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="
        space-y-2.5
        sm:space-y-3
      "
    >
      <div
        className="
          grid
          gap-2.5
          sm:grid-cols-2
          sm:gap-3
        "
      >
        <Field
          label="Full name"
          placeholder="Enter your full name"
          required
          value={
            values.fullName
          }
          disabled={
            submitting
          }
          onChange={(value) =>
            updateField(
              "fullName",
              value,
            )
          }
        />

        <Field
          label="Phone number"
          placeholder="Enter your phone number"
          required
          type="tel"
          value={
            values.phoneNumber
          }
          disabled={
            submitting
          }
          onChange={(value) =>
            updateField(
              "phoneNumber",
              value,
            )
          }
        />
      </div>

      <Field
        label="Alternate phone"
        placeholder="Enter an alternate phone number"
        type="tel"
        value={
          values.alternatePhoneNumber ??
          ""
        }
        disabled={
          submitting
        }
        onChange={(value) =>
          updateField(
            "alternatePhoneNumber",
            value || null,
          )
        }
      />

      <Field
        label="Address line 1"
        placeholder="Street address"
        required
        value={
          values.addressLine1
        }
        disabled={
          submitting
        }
        onChange={(value) =>
          updateField(
            "addressLine1",
            value,
          )
        }
      />

      <Field
        label="Address line 2"
        placeholder="Apartment, suite, unit, etc. (optional)"
        value={
          values.addressLine2 ??
          ""
        }
        disabled={
          submitting
        }
        onChange={(value) =>
          updateField(
            "addressLine2",
            value || null,
          )
        }
      />

      <div
        className="
          grid
          gap-2.5
          sm:grid-cols-2
          sm:gap-3
        "
      >
        <Field
          label="City"
          placeholder="Enter your city"
          required
          value={
            values.city
          }
          disabled={
            submitting
          }
          onChange={(value) =>
            updateField(
              "city",
              value,
            )
          }
        />

        <Field
          label="State"
          placeholder="Enter your state (optional)"
          value={
            values.state ??
            ""
          }
          disabled={
            submitting
          }
          onChange={(value) =>
            updateField(
              "state",
              value || null,
            )
          }
        />
      </div>

      <div
        className="
          grid
          gap-2.5
          sm:grid-cols-2
          sm:gap-3
        "
      >
        <Field
          label="Country"
          placeholder="Select your country"
          required
          value={
            values.country
          }
          disabled={
            submitting
          }
          onChange={(value) =>
            updateField(
              "country",
              value,
            )
          }
        />

        <Field
          label="Postal code"
          placeholder="Enter postal code (optional)"
          value={
            values.postalCode ??
            ""
          }
          disabled={
            submitting
          }
          onChange={(value) =>
            updateField(
              "postalCode",
              value || null,
            )
          }
        />
      </div>

      <label
        className="
          flex
          cursor-pointer
          items-center
          gap-2
          rounded-lg
          border
          border-[var(--user-card-border)]
          bg-[var(--user-stat-bg)]
          px-2.5
          py-2
          sm:gap-2.5
          sm:px-3
          sm:py-2.5
        "
      >
        <input
          type="checkbox"
          checked={
            values.isPrimary
          }
          disabled={
            submitting
          }
          onChange={(
            event,
          ) =>
            updateField(
              "isPrimary",
              event.target
                .checked,
            )
          }
          className="
            h-3.5
            w-3.5
            accent-[var(--primary)]
          "
        />

        <span
          className="
            text-[10px]
            font-medium
            text-[var(--user-title)]
            sm:text-xs
          "
        >
          Make this my primary
          delivery address
        </span>
      </label>

      {error && (
        <p
          className="
            text-[10px]
            leading-4
            text-[var(--user-badge-danger-text)]
            sm:text-xs
            sm:leading-5
          "
        >
          {error}
        </p>
      )}

      <div
        className="
          flex
          justify-end
          gap-1.5
          pt-0.5
          sm:gap-2
          sm:pt-1
        "
      >
        {onCancel && (
          <button
            type="button"
            disabled={
              submitting
            }
            onClick={
              onCancel
            }
            className="
              h-8
              rounded-lg
              border
              border-[var(--user-card-border)]
              px-2.5
              text-[10px]
              font-medium
              text-[var(--user-title)]
              transition
              hover:border-[var(--primary)]
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:h-9
              sm:px-3
              sm:text-xs
            "
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={
            submitting ||
            !canSubmit
          }
          className="
            relative
            inline-flex
            h-8
            items-center
            justify-center
            overflow-hidden
            rounded-lg
            border
            border-[rgba(255,255,255,0.08)]
            bg-gradient-to-r
            from-[#6D63FF]
            to-[#5A4FFF]
            px-4
            text-[10px]
            font-medium
            text-white
            shadow-[0_6px_18px_rgba(90,79,255,0.3)]
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:shadow-[0_10px_26px_rgba(90,79,255,0.4)]
            active:translate-y-0
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-50
            disabled:hover:translate-y-0
            disabled:hover:shadow-[0_6px_18px_rgba(90,79,255,0.3)]
            sm:h-9
            sm:px-5
            sm:text-xs
            sm:shadow-[0_8px_24px_rgba(90,79,255,0.35)]
            sm:disabled:hover:shadow-[0_8px_24px_rgba(90,79,255,0.35)]
          "
        >
          <span
            className="
              absolute
              inset-0
              -translate-x-full
              bg-gradient-to-r
              from-transparent
              via-white/15
              to-transparent
              transition-transform
              duration-700
              group-hover:translate-x-full
            "
          />

          <span
            className="
              relative
              z-10
              inline-flex
              items-center
              gap-1.5
              sm:gap-2
            "
          >
            {submitting ? (
              <>
                <Loader2
                  size={13}
                  className="animate-spin"
                />

                Saving...
              </>
            ) : isEditing ? (
              "Save changes"
            ) : (
              "Add address"
            )}
          </span>
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;

  placeholder: string;

  value: string;

  onChange: (
    value: string,
  ) => void;

  required?: boolean;

  type?: "text" | "tel";

  disabled?: boolean;
};

function Field({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  type = "text",
  disabled = false,
}: FieldProps) {
  return (
    <div className="min-w-0">
      <label
        className="
          mb-1
          block
          text-[9px]
          font-medium
          text-[var(--user-text-muted)]
          sm:mb-1.5
          sm:text-[10px]
        "
      >
        {label}

        {required && (
          <span className="ml-0.5">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={
          disabled
        }
        inputMode={
          type === "tel"
            ? "tel"
            : undefined
        }
        onChange={(
          event,
        ) =>
          onChange(
            event.target
              .value,
          )
        }
        className="
          h-8
          w-full
          rounded-lg
          border
          border-[var(--user-card-border)]
          bg-[var(--user-card-bg)]
          px-2.5
          text-[10px]
          text-[var(--user-title)]
          outline-none
          placeholder:text-[var(--user-text-muted)]
          focus:border-[var(--primary)]
          disabled:cursor-not-allowed
          disabled:opacity-60
          sm:h-9
          sm:px-3
          sm:text-xs
        "
      />
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

function phoneDigitCount(
  value: string,
): number {
  return value.replace(
    /\D/g,
    "",
  ).length;
}