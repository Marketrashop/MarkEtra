"use client";

import type {
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";

import type {
  KycFormValues,
} from "./kyc.validation";

import { Controller } from "react-hook-form";

import {
  CountrySelect,
} from "@/components/ui/CountrySelect";

import type {
  Country,
} from "@/lib/countries";

type PersonalInformationSectionProps = {
  register: UseFormRegister<KycFormValues>;

  control: any;

  errors: FieldErrors<KycFormValues>;
};

function Input({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        space-y-1
      "
    >
      <label
        className="
          text-[10px]
          font-medium
          text-[var(--user-title)]
          sm:text-xs
        "
      >
        {label}
      </label>

      {children}

      {error && (
        <p
          className="
            text-[10px]
            text-[var(--user-danger)]
            sm:text-xs
          "
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default function PersonalInformationSection({
  register,
  control,
  errors,
}: PersonalInformationSectionProps) {
  return (
    <section
      className="
        rounded-[var(--user-radius-lg)]
        border
        border-[var(--user-card-border)]
        bg-[var(--user-card-bg)]
        p-3
        sm:p-4
      "
    >
      <div
        className="
          mb-2.5
          sm:mb-3
        "
      >
        <h2
          className="
            text-sm
            font-semibold
            text-[var(--user-title)]
            sm:text-base
          "
        >
          Personal Information
        </h2>

        <p
          className="
            mt-0.5
            text-[10px]
            leading-4
            text-[var(--user-text-muted)]
            sm:text-xs
            sm:leading-normal
          "
        >
          Enter your personal information exactly as it appears on your identity
          document.
        </p>
      </div>

      <div
        className="
          grid
          gap-2.5
          sm:gap-3
          sm:grid-cols-2
        "
      >
        <Input
          label="First Name"
          error={errors.firstName?.message}
        >
          <input
            {...register("firstName")}
            placeholder="Enter your first name"
            className="
              h-8
              w-full
              rounded-lg
              border
              border-[var(--user-input-border)]
              bg-[var(--user-input-bg)]
              px-2.5
              text-[11px]
              text-[var(--user-input-text)]
              placeholder:text-[var(--user-input-placeholder)]
              outline-none
              transition-colors
              duration-[var(--user-transition)]
              focus:border-[var(--user-input-border-focus)]
              sm:h-auto
              sm:rounded-[var(--user-radius-md)]
              sm:px-4
              sm:py-2
              sm:text-base
            "
          />
        </Input>

        <Input
          label="Last Name"
          error={errors.lastName?.message}
        >
          <input
            {...register("lastName")}
            placeholder="Enter your last name"
            className="
              h-8
              w-full
              rounded-lg
              border
              border-[var(--user-input-border)]
              bg-[var(--user-input-bg)]
              px-2.5
              text-[11px]
              text-[var(--user-input-text)]
              placeholder:text-[var(--user-input-placeholder)]
              outline-none
              transition-colors
              duration-[var(--user-transition)]
              focus:border-[var(--user-input-border-focus)]
              sm:h-auto
              sm:rounded-[var(--user-radius-md)]
              sm:px-3
              sm:py-3
              sm:text-base
            "
          />
        </Input>

        <Input
          label="Date of Birth"
          error={errors.dateOfBirth?.message}
        >
          <input
            type="date"
            {...register("dateOfBirth")}
            placeholder="Select your date of birth"
className="
  h-8
  w-full
  min-w-0
  appearance-none
  rounded-lg
  border
  border-[var(--user-input-border)]
  bg-[var(--user-input-bg)]
  px-2.5
  text-[11px]
  text-[var(--user-input-text)]
  outline-none
  transition-colors
  duration-[var(--user-transition)]
  focus:border-[var(--user-input-border-focus)]
  sm:h-auto
  sm:rounded-[var(--user-radius-md)]
  sm:px-4
  sm:py-3
  sm:text-base
"
          />
        </Input>

        <Input
          label="Nationality"
          error={errors.nationality?.message}
        >
          <input
            {...register("nationality")}
            placeholder="Enter your nationality"
            className="
              h-8
              w-full
              rounded-lg
              border
              border-[var(--user-input-border)]
              bg-[var(--user-input-bg)]
              px-2.5
              text-[11px]
              text-[var(--user-input-text)]
              placeholder:text-[var(--user-input-placeholder)]
              outline-none
              transition-colors
              duration-[var(--user-transition)]
              focus:border-[var(--user-input-border-focus)]
              sm:h-auto
              sm:rounded-[var(--user-radius-md)]
              sm:px-4
              sm:py-3
              sm:text-base
            "
          />
        </Input>

        <div
          className="
            sm:col-span-2
          "
        >
          <Input
            label="Residential Address"
            error={
              errors.residentialAddress?.message
            }
          >
            <input
              {...register(
                "residentialAddress",
              )}
              placeholder="Enter your residential address"
              className="
                h-8
                w-full
                rounded-lg
                border
                border-[var(--user-input-border)]
                bg-[var(--user-input-bg)]
                px-2.5
                text-[11px]
                text-[var(--user-input-text)]
                placeholder:text-[var(--user-input-placeholder)]
                outline-none
                transition-colors
                duration-[var(--user-transition)]
                focus:border-[var(--user-input-border-focus)]
                sm:h-auto
                sm:rounded-[var(--user-radius-md)]
                sm:px-4
                sm:py-3
                sm:text-base
              "
            />
          </Input>
        </div>

        <Input
          label="City"
          error={errors.city?.message}
        >
          <input
            {...register("city")}
            placeholder="Enter your city"
            className="
              h-8
              w-full
              rounded-lg
              border
              border-[var(--user-input-border)]
              bg-[var(--user-input-bg)]
              px-2.5
              text-[11px]
              text-[var(--user-input-text)]
              placeholder:text-[var(--user-input-placeholder)]
              outline-none
              transition-colors
              duration-[var(--user-transition)]
              focus:border-[var(--user-input-border-focus)]
              sm:h-auto
              sm:rounded-[var(--user-radius-md)]
              sm:px-4
              sm:py-3
              sm:text-base
            "
          />
        </Input>

        <Input
          label="State / Province"
          error={errors.state?.message}
        >
          <input
            {...register("state")}
            placeholder="Enter your state or province"
            className="
              h-8
              w-full
              rounded-lg
              border
              border-[var(--user-input-border)]
              bg-[var(--user-input-bg)]
              px-2.5
              text-[11px]
              text-[var(--user-input-text)]
              placeholder:text-[var(--user-input-placeholder)]
              outline-none
              transition-colors
              duration-[var(--user-transition)]
              focus:border-[var(--user-input-border-focus)]
              sm:h-auto
              sm:rounded-[var(--user-radius-md)]
              sm:px-4
              sm:py-3
              sm:text-base
            "
          />
        </Input>

        <Input
          label="Postal Code"
          error={errors.postalCode?.message}
        >
          <input
            {...register("postalCode")}
            placeholder="Enter your postal code"
            className="
              h-8
              w-full
              rounded-lg
              border
              border-[var(--user-input-border)]
              bg-[var(--user-input-bg)]
              px-2.5
              text-[11px]
              text-[var(--user-input-text)]
              placeholder:text-[var(--user-input-placeholder)]
              outline-none
              transition-colors
              duration-[var(--user-transition)]
              focus:border-[var(--user-input-border-focus)]
              sm:h-auto
              sm:rounded-[var(--user-radius-md)]
              sm:px-4
              sm:py-3
              sm:text-base
            "
          />
        </Input>

        <Input
          label="Country"
          error={errors.country?.message}
        >
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
<CountrySelect
  label=""
  value={
    (field.value as Country) || ""
  }
  onChange={(country) =>
    field.onChange(country)
  }
  placeholder="Select your country"
/>
            )}
          />
        </Input>
      </div>
    </section>
  );
}