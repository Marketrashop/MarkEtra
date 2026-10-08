"use client";

import CloudinaryUploader from "@/components/shared/CloudinaryUploader";

type BankMethodFieldsProps = {
  name: string;

  symbol: string;

  placeholder: string;

  fee: number | null;

  feeType: "fixed" | "percentage";

  minimumAmount: number | null;

  maximumAmount: number | null;

  icon: string | null;

  onChange: (
    values: Partial<{
      name: string;
      symbol: string;
      placeholder: string;
      fee: number | null;
      feeType: "fixed" | "percentage";
      minimumAmount: number | null;
      maximumAmount: number | null;
      icon: string | null;
    }>
  ) => void;

  disabled?: boolean;
};

export default function BankMethodFields({
  name,
  symbol,
  placeholder,
  fee,
  feeType,
  minimumAmount,
  maximumAmount,
  icon,
  onChange,
  disabled = false,
}: BankMethodFieldsProps) {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-2
        md:grid-cols-2
        md:gap-5
      "
    >
      <InputField
        id="bank-name"
        label="Bank Name"
        value={name}
        placeholder="Bank Transfer"
        disabled={disabled}
        onChange={(value) =>
          onChange({
            name: value,
          })
        }
      />

      <InputField
        id="bank-symbol"
        label="Ticker"
        value={symbol}
        placeholder="BANK"
        disabled={disabled}
        onChange={(value) =>
          onChange({
            symbol: value.toUpperCase(),
          })
        }
      />

      <NumberField
        id="bank-fee"
        label="Withdrawal Fee"
        value={fee}
        placeholder="5"
        disabled={disabled}
        onChange={(value) =>
          onChange({
            fee: value,
          })
        }
      />

      <div
        className="
          space-y-0.5
          sm:space-y-2
        "
      >
        <label
          htmlFor="bank-fee-type"
          className="
            block
            text-[11px]
            font-medium
            text-[var(--admin-text)]
            sm:text-sm
          "
        >
          Fee Type
        </label>

        <select
          id="bank-fee-type"
          value={feeType}
          disabled={disabled}
          onChange={(event) =>
            onChange({
              feeType:
                event.target.value as
                  | "fixed"
                  | "percentage",
            })
          }
          className="
            h-7
            w-full
            rounded-md
            border
            border-[var(--admin-input-border)]
            bg-[var(--admin-input-bg)]
            px-2
            text-[11px]
            text-[var(--admin-input-text)]
            sm:h-11
            sm:rounded-[var(--admin-input-radius)]
            sm:px-3
            sm:text-sm
          "
        >
          <option value="fixed">
            Fixed
          </option>

          <option value="percentage">
            Percentage
          </option>
        </select>
      </div>

      <InputField
        id="bank-placeholder"
        label="Placeholder"
        value={placeholder}
        placeholder="Enter your bank account details"
        disabled={disabled}
        onChange={(value) =>
          onChange({
            placeholder: value,
          })
        }
      />

      <NumberField
        id="bank-minimum"
        label="Minimum Withdrawal"
        value={minimumAmount}
        placeholder="20"
        disabled={disabled}
        onChange={(value) =>
          onChange({
            minimumAmount: value,
          })
        }
      />

      <div
        className="
          md:col-span-2
          rounded-lg
          border-2
          border-dashed
          border-[var(--admin-input-border)]
          bg-[var(--admin-surface-bg)]
          p-2.5
          sm:rounded-[var(--admin-surface-radius)]
          sm:p-6
        "
      >
        <h3
          className="
            text-[11px]
            font-semibold
            text-[var(--admin-title)]
            sm:text-sm
          "
        >
          Bank Icon Upload
        </h3>

        <p
          className="
            mt-0.5
            text-[9px]
            leading-3.5
            text-[var(--admin-muted)]
            sm:mt-2
            sm:text-xs
            sm:leading-5
          "
        >
          Upload a bank logo. Supported formats are PNG, JPG, SVG, and WebP.
          The uploaded image will be stored in Cloudinary and automatically
          attached to this withdrawal method.
        </p>

        <div
          className="
            mt-2
            sm:mt-6
          "
        >
          <CloudinaryUploader
            folder="withdrawal-methods"
            value={icon}
            disabled={disabled}
            onChange={(publicId) =>
              onChange({
                icon: publicId,
              })
            }
          />
        </div>
      </div>

      <div
        className="
          md:col-span-2
          rounded-lg
          border
          border-[var(--admin-input-border)]
          bg-[var(--admin-surface-bg)]
          p-2.5
          sm:rounded-[var(--admin-surface-radius)]
          sm:p-4
        "
      >
        <h3
          className="
            text-[11px]
            font-semibold
            text-[var(--admin-title)]
            sm:text-sm
          "
        >
          User Bank Details
        </h3>

        <p
          className="
            mt-0.5
            text-[9px]
            leading-3.5
            text-[var(--admin-muted)]
            sm:mt-2
            sm:text-xs
            sm:leading-6
          "
        >
          When this withdrawal method is active,
          users will automatically be required to
          provide the following information before
          submitting a withdrawal request:
        </p>

        <ul
          className="
            mt-1.5
            grid
            grid-cols-1
            gap-0.5
            text-[9px]
            leading-4
            text-[var(--admin-text)]
            sm:mt-4
            sm:grid-cols-2
            sm:gap-2
            sm:text-xs
            sm:leading-normal
            lg:grid-cols-3
          "
        >
          <li>• Account Holder Name *</li>
          <li>• Bank Name *</li>
          <li>• Account Number *</li>
          <li>• Country *</li>
          <li>• Currency *</li>
          <li>• Bank Address *</li>
          <li>• SWIFT / BIC</li>
          <li>• IBAN</li>
          <li>• Routing Number</li>
          <li>• Sort Code</li>
          <li>• IFSC</li>
        </ul>
      </div>
    </div>
  );
}

type InputFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

type NumberFieldProps = {
  id: string;
  label: string;
  value: number | null;
  placeholder: string;
  nullable?: boolean;
  disabled?: boolean;
  onChange: (value: number | null) => void;
};

function NumberField({
  id,
  label,
  value,
  placeholder,
  nullable = false,
  disabled = false,
  onChange,
}: NumberFieldProps) {
  return (
    <div
      className="
        space-y-0.5
        sm:space-y-2
      "
    >
      <label
        htmlFor={id}
        className="
          block
          text-[11px]
          font-medium
          text-[var(--admin-text)]
          sm:text-sm
        "
      >
        {label}
      </label>

      <input
        id={id}
        type="number"
        value={value ?? ""}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => {
          const raw =
            event.target.value;

          if (raw === "") {
            onChange(
              nullable
                ? null
                : 0,
            );
            return;
          }

          const parsed =
            Number(raw);

          onChange(
            Number.isNaN(parsed)
              ? nullable
                ? null
                : 0
              : parsed,
          );
        }}
        className="
          h-7
          w-full
          rounded-md
          border
          border-[var(--admin-input-border)]
          bg-[var(--admin-input-bg)]
          px-2
          text-[11px]
          text-[var(--admin-input-text)]
          outline-none
          transition-all
          duration-300
          placeholder:text-[var(--admin-input-placeholder)]
          focus:border-[var(--admin-input-focus)]
          disabled:cursor-not-allowed
          disabled:opacity-60
          sm:h-11
          sm:rounded-[var(--admin-input-radius)]
          sm:px-3
          sm:text-sm
        "
      />
    </div>
  );
}

function InputField({
  id,
  label,
  value,
  placeholder,
  disabled = false,
  onChange,
}: InputFieldProps) {
  return (
    <div
      className="
        space-y-0.5
        sm:space-y-2
      "
    >
      <label
        htmlFor={id}
        className="
          block
          text-[11px]
          font-medium
          text-[var(--admin-text)]
          sm:text-sm
        "
      >
        {label}
      </label>

      <input
        id={id}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="
          h-7
          w-full
          rounded-md
          border
          border-[var(--admin-input-border)]
          bg-[var(--admin-input-bg)]
          px-2
          text-[11px]
          text-[var(--admin-input-text)]
          outline-none
          transition-all
          duration-300
          placeholder:text-[var(--admin-input-placeholder)]
          focus:border-[var(--admin-input-focus)]
          disabled:cursor-not-allowed
          disabled:opacity-60
          sm:h-11
          sm:rounded-[var(--admin-input-radius)]
          sm:px-3
          sm:text-sm
        "
      />
    </div>
  );
}