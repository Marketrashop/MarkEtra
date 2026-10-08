"use client";

import {
  useState,
} from "react";

import {
  Check,
  Copy,
} from "lucide-react";

type WithdrawAddressInputProps = {
  value: string;

  onChange: (
    value: string
  ) => void;

  placeholder: string;

  disabled?: boolean;
};

export default function WithdrawAddressInput({
  value,
  onChange,
  placeholder,
  disabled = false,
}: WithdrawAddressInputProps) {
  const [copied, setCopied] =
    useState(false);

  async function handleCopy() {
    if (!value) {
      return;
    }

    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(
          value
        );
      } else {
        const textarea =
          document.createElement(
            "textarea"
          );

        textarea.value = value;

        textarea.style.position =
          "fixed";

        textarea.style.opacity = "0";

        textarea.style.pointerEvents =
          "none";

        document.body.appendChild(
          textarea
        );

        textarea.focus();

        textarea.select();

        const success =
          document.execCommand(
            "copy"
          );

        document.body.removeChild(
          textarea
        );

        if (!success) {
          throw new Error(
            "Copy command failed"
          );
        }
      }

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy withdrawal address:",
        error
      );
    }
  }

  return (
    <div>
      <label
        htmlFor="withdrawal-address"
        className="
          mb-1.5
          block
          text-[10px]
          font-medium
          text-[var(--withdraw-address-label)]
          sm:mb-2
          sm:text-[12px]
        "
      >
        Destination Address
      </label>

      <div
        className="
          flex
          min-w-0
          items-stretch
        "
      >
        <input
          id="withdrawal-address"
          type="text"
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          spellCheck={false}
          className="
            min-w-0
            flex-1
            h-8
            rounded-l-lg
            border
            border-r-0
            border-[var(--withdraw-address-border)]
            bg-[var(--withdraw-address-bg)]
            px-2.5
            text-[10px]
            text-[var(--withdraw-address-text)]
            outline-none
            transition-all
            duration-[var(--withdraw-address-transition)]
            placeholder:text-[var(--withdraw-address-placeholder)]
            focus:border-[var(--withdraw-address-focus)]
            disabled:cursor-not-allowed
            disabled:opacity-60
            sm:h-auto
            sm:rounded-l-xl
            sm:px-3
            sm:py-2.5
            sm:text-[12px]
          "
        />

        <button
          type="button"
          onClick={handleCopy}
          disabled={
            !value || disabled
          }
          aria-label={
            copied
              ? "Address copied"
              : "Copy destination address"
          }
          title={
            copied
              ? "Copied"
              : "Copy address"
          }
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-r-lg
            border
            border-[var(--withdraw-address-copy-border)]
            bg-[var(--withdraw-address-copy-bg)]
            text-[var(--withdraw-address-copy-text)]
            transition-all
            duration-[var(--withdraw-address-transition)]
            hover:bg-[var(--withdraw-address-copy-hover)]
            disabled:cursor-not-allowed
            disabled:opacity-50
            sm:h-auto
            sm:w-11
            sm:rounded-r-xl
          "
        >
          {copied ? (
            <Check
              size={14}
              strokeWidth={2.5}
              className="
                sm:h-4
                sm:w-4
              "
            />
          ) : (
            <Copy
              size={14}
              className="
                sm:h-4
                sm:w-4
              "
            />
          )}
        </button>
      </div>
    </div>
  );
}