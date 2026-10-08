"use client";

import CloudinaryUploader from "@/components/shared/CloudinaryUploader";

type CryptoMethodFieldsProps = {
  name: string;

  symbol: string;

  network: string;

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
      network: string;
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

export default function CryptoMethodFields({
  name,
  symbol,
  network,
  placeholder,
  fee,
  feeType,
  minimumAmount,
  maximumAmount,
  icon,
  onChange,
  disabled = false,
}: CryptoMethodFieldsProps) {
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
        id="crypto-name"
        label="Coin Name"
        value={name}
        placeholder="Bitcoin"
        disabled={disabled}
        onChange={(value) =>
          onChange({
            name: value,
          })
        }
      />

      <InputField
        id="crypto-symbol"
        label="Ticker"
        value={symbol}
        placeholder="BTC"
        disabled={disabled}
        onChange={(value) =>
          onChange({
            symbol: value.toUpperCase(),
          })
        }
      />

      <InputField
        id="crypto-network"
        label="Network"
        value={network}
        placeholder="Bitcoin"
        disabled={disabled}
        onChange={(value) =>
          onChange({
            network: value,
          })
        }
      />

      <InputField
        id="crypto-placeholder"
        label="Address Placeholder"
        value={placeholder}
        placeholder="Enter BTC Wallet Address"
        disabled={disabled}
        onChange={(value) =>
          onChange({
            placeholder: value,
          })
        }
      />

      <NumberField
        id="crypto-fee"
        label="Withdrawal Fee"
        value={fee}
        placeholder="0"
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
          htmlFor="crypto-fee-type"
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
          id="crypto-fee-type"
          value={feeType}
          disabled={disabled}
          onChange={(e) =>
            onChange({
              feeType:
                e.target.value as
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

      <NumberField
        id="crypto-minimum"
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
          Crypto Icon Upload
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

  onChange: (
    value: number | null
  ) => void;
};

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
        onChange={(e) =>
          onChange(
            e.target.value,
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
          placeholder:text-[var(--admin-input-placeholder)]
          focus:border-[var(--admin-input-focus)]
          outline-none
          sm:h-11
          sm:rounded-[var(--admin-input-radius)]
          sm:px-3
          sm:text-sm
        "
      />
    </div>
  );
}

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