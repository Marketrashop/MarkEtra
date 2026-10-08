"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { CountrySelect } from "@/components/ui/CountrySelect";
import type { Country } from "@/lib/countries";

type ProfileValues = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  secondaryPhoneNumber: string;
  country: string;
};

type Props = {
  initialValues: ProfileValues;
  loading?: boolean;
  onSuccess: (values: ProfileValues) => void;
};

export function EditProfileForm({
  initialValues,
  loading = false,
  onSuccess,
}: Props) {
  const [values, setValues] =
    useState(initialValues);

  const [saving, setSaving] =
    useState(false);

  function updateField(
    field: keyof ProfileValues,
    value: string,
  ) {
    const nextValue =
      field === "phoneNumber" ||
      field === "secondaryPhoneNumber"
        ? sanitizePhone(value)
        : value;

    setValues((previous) => ({
      ...previous,
      [field]: nextValue,
    }));
  }

  function swapPhoneNumbers() {
    if (!values.secondaryPhoneNumber.trim()) {
      toast.error(
        "Add a secondary phone number first.",
      );

      return;
    }

    setValues((previous) => ({
      ...previous,
      phoneNumber:
        previous.secondaryPhoneNumber,
      secondaryPhoneNumber:
        previous.phoneNumber,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const primaryPhoneDigits =
      phoneDigitCount(
        values.phoneNumber,
      );

    const secondaryPhoneDigits =
      phoneDigitCount(
        values.secondaryPhoneNumber,
      );

    if (primaryPhoneDigits < 7) {
      toast.error(
        "Primary phone number must contain at least 7 digits.",
      );

      return;
    }

    if (
      values.secondaryPhoneNumber.trim() &&
      secondaryPhoneDigits < 7
    ) {
      toast.error(
        "Secondary phone number must contain at least 7 digits.",
      );

      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "/api/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(values),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        toast.error(
          data.error ??
            "Unable to update profile.",
        );

        return;
      }

      toast.success(
        "Profile updated successfully.",
      );

      onSuccess(values);
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to update profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        space-y-4
        sm:space-y-6
      "
    >
      <div
        className="
          grid
          gap-3
          md:grid-cols-2
          sm:gap-5
        "
      >
        <Field
          label="First Name"
          value={values.firstName}
          onChange={(value) =>
            updateField(
              "firstName",
              value,
            )
          }
        />

        <Field
          label="Last Name"
          value={values.lastName}
          onChange={(value) =>
            updateField(
              "lastName",
              value,
            )
          }
        />

        <Field
          label="Primary Phone"
          value={values.phoneNumber}
          type="tel"
          onChange={(value) =>
            updateField(
              "phoneNumber",
              value,
            )
          }
        />

        <Field
          label="Secondary Phone"
          value={
            values.secondaryPhoneNumber
          }
          type="tel"
          onChange={(value) =>
            updateField(
              "secondaryPhoneNumber",
              value,
            )
          }
        />

        <CountrySelect
          label="Country"
          value={values.country as Country}
          onChange={(country) =>
            updateField(
              "country",
              country,
            )
          }
        />
      </div>

      <button
        type="button"
        onClick={swapPhoneNumbers}
        className="
          inline-flex
          items-center
          gap-1.5
          rounded-lg
          border
          px-3
          py-1.5
          text-[10px]
          transition
          sm:gap-2
          sm:rounded-[var(--user-radius-md)]
          sm:px-4
          sm:py-2
          sm:text-sm
        "
        style={{
          borderColor:
            "var(--user-input-border)",
          color:
            "var(--user-text)",
        }}
      >
        <ArrowUpDown
          size={14}
          className="sm:h-[18px] sm:w-[18px]"
        />

        Make secondary phone primary
      </button>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={
            saving || loading
          }
          className="
            h-9
            rounded-lg
            bg-[var(--user-button-bg)]
            px-4
            text-[11px]
            font-medium
            text-[var(--user-button-text)]
            transition
            hover:bg-[var(--user-button-hover)]
            disabled:opacity-60
            sm:h-auto
            sm:rounded-[var(--user-radius-md)]
            sm:px-6
            sm:py-3
            sm:text-sm
          "
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  value: string;
  type?: "text" | "tel";
  onChange: (
    value: string,
  ) => void;
};

function Field({
  label,
  value,
  type = "text",
  onChange,
}: FieldProps) {
  return (
    <label
      className="
        space-y-1.5
        sm:space-y-2
      "
    >
      <span
        className="
          text-[10px]
          font-medium
          text-[var(--user-text)]
          sm:text-sm
        "
      >
        {label}
      </span>

      <input
        type={type}
        value={value}
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
          h-9
          w-full
          rounded-lg
          border
          bg-[var(--user-input-bg)]
          px-2.5
          text-[11px]
          text-[var(--user-input-text)]
          outline-none
          transition
          placeholder:text-[var(--user-input-placeholder)]
          focus:border-[var(--user-input-border-focus)]
          sm:h-12
          sm:rounded-[var(--user-radius-md)]
          sm:px-4
          sm:text-sm
        "
        style={{
          borderColor:
            "var(--user-input-border)",
        }}
      />
    </label>
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