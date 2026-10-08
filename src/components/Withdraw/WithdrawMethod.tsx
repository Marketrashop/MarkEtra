"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";

import {
  Building2,
  Check,
  ChevronDown,
} from "lucide-react";

import type {
  WithdrawMethod as WithdrawMethodType,
} from "./withdraw.types";

type WithdrawMethodProps = {
  methods: WithdrawMethodType[];

  value: WithdrawMethodType | null;

  onChange: (
    method: WithdrawMethodType
  ) => void;
};

export default function WithdrawMethod({
  methods,
  value,
  onChange,
}: WithdrawMethodProps) {
  const [
    open,
    setOpen,
  ] = useState(false);

  const dropdownRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  function handleSelect(
    method: WithdrawMethodType
  ) {
    onChange(method);
    setOpen(false);
  }

  return (
    <section
      className="
        mt-5
        rounded-[var(--withdraw-method-radius)]
        border
        border-[var(--withdraw-method-border)]
        bg-[var(--withdraw-method-bg)]
        p-3
        shadow-[var(--withdraw-method-shadow)]
        transition-all
        duration-[var(--withdraw-method-transition)]
        sm:mt-6
        sm:p-[var(--withdraw-method-padding)]
      "
    >
      <div>
        <h2
          className="
            text-[15px]
            font-bold
            text-[var(--withdraw-method-title)]
            sm:text-[18px]
          "
        >
          Withdrawal Method
        </h2>

        <p
          className="
            mt-1
            text-[10px]
            leading-4
            text-[var(--withdraw-method-text)]
            sm:mt-1.5
            sm:text-[12px]
            sm:leading-5
          "
        >
          Choose where you want to withdraw
          your funds.
        </p>
      </div>

      <div
        ref={dropdownRef}
        className="
          relative
          mt-4
          sm:mt-5
        "
      >
        <button
          type="button"
          onClick={() =>
            setOpen(
              (current) =>
                !current
            )
          }
          aria-haspopup="listbox"
          aria-expanded={open}
          className="
            flex
            h-9
            w-full
            items-center
            justify-between
            gap-2
            rounded-lg
            border
            border-[var(--withdraw-method-select-border)]
            bg-[var(--withdraw-method-select-bg)]
            px-2.5
            text-left
            text-[var(--withdraw-method-select-text)]
            shadow-[var(--withdraw-method-select-shadow)]
            transition-all
            duration-[var(--withdraw-method-transition)]
            hover:border-[var(--withdraw-method-select-hover-border)]
            hover:bg-[var(--withdraw-method-select-hover-bg)]
            focus:outline-none
            focus:ring-2
            focus:ring-[var(--withdraw-method-select-focus)]
            focus:ring-offset-2
            focus:ring-offset-[var(--withdraw-method-select-focus-offset)]
            sm:h-auto
            sm:gap-3
            sm:rounded-[var(--withdraw-method-select-radius)]
            sm:px-[var(--withdraw-method-select-padding-x)]
            sm:py-[var(--withdraw-method-select-padding-y)]
          "
        >
          <MethodDisplay
            method={value}
            placeholder
          />

          <ChevronDown
            size={15}
            className={`
              shrink-0
              text-[var(--withdraw-method-select-icon)]
              transition-transform
              duration-[var(--withdraw-method-transition)]
              sm:h-[17px]
              sm:w-[17px]
              ${
                open
                  ? "rotate-180"
                  : ""
              }
            `}
          />
        </button>

        {open && (
          <div
            role="listbox"
            aria-label="Withdrawal methods"
            className="
              absolute
              left-0
              right-0
              top-full
              z-50
              mt-1.5
              max-h-64
              overflow-y-auto
              rounded-lg
              border
              border-[var(--withdraw-method-dropdown-border)]
              bg-[var(--withdraw-method-dropdown-bg)]
              p-1
              shadow-[var(--withdraw-method-dropdown-shadow)]
              scrollbar-none
              sm:mt-2
              sm:max-h-72
              sm:rounded-[var(--withdraw-method-dropdown-radius)]
              sm:p-[var(--withdraw-method-dropdown-padding)]
            "
          >
            <div
              className="
                space-y-0.5
                sm:space-y-1
              "
            >
              {methods.map(
                (method) => {
                  const selected =
                    value?.id ===
                    method.id;

                  return (
                    <button
                      key={
                        method.id
                      }
                      type="button"
                      role="option"
                      aria-selected={
                        selected
                      }
                      onClick={() =>
                        handleSelect(
                          method
                        )
                      }
                      className={`
                        flex
                        w-full
                        items-center
                        justify-between
                        gap-2
                        rounded-md
                        px-2
                        py-1.5
                        text-left
                        transition-all
                        duration-[var(--withdraw-method-transition)]
                        sm:gap-3
                        sm:rounded-[var(--withdraw-method-option-radius)]
                        sm:px-[var(--withdraw-method-option-padding-x)]
                        sm:py-[var(--withdraw-method-option-padding-y)]
                        ${
                          selected
                            ? `
                                bg-[var(--withdraw-method-option-active-bg)]
                                text-[var(--withdraw-method-option-active-text)]
                              `
                            : `
                                text-[var(--withdraw-method-option-text)]
                                hover:bg-[var(--withdraw-method-option-hover-bg)]
                                hover:text-[var(--withdraw-method-option-hover-text)]
                              `
                        }
                      `}
                    >
                      <MethodDisplay
                        method={method}
                      />

                      {selected && (
                        <Check
                          size={14}
                          strokeWidth={2.5}
                          className="
                            shrink-0
                            text-[var(--withdraw-method-option-check)]
                            sm:h-4
                            sm:w-4
                          "
                        />
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

type MethodDisplayProps = {
  method:
    | WithdrawMethodType
    | null;

  placeholder?: boolean;
};

function MethodDisplay({
  method,
  placeholder = false,
}: MethodDisplayProps) {
  if (!method && placeholder) {
    return (
      <span
        className="
          text-[10px]
          font-medium
          text-[var(--withdraw-method-select-placeholder)]
          sm:text-[12px]
        "
      >
        Select withdrawal method
      </span>
    );
  }

  if (!method) {
    return null;
  }

  return (
    <span
      className="
        flex
        min-w-0
        items-center
        gap-2
        sm:gap-3
      "
    >
      <span
        className="
          relative
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-md
          bg-[var(--withdraw-method-option-icon-bg)]
          sm:h-8
          sm:w-8
          sm:rounded-lg
        "
      >
        {method.type ===
        "bank" ? (
          <Building2
            size={15}
            strokeWidth={2}
            className="
              text-[var(--withdraw-method-option-icon-color)]
              sm:h-[17px]
              sm:w-[17px]
            "
          />
        ) : (
          <Image
            src={method.icon}
            alt=""
            fill
            sizes="32px"
            className="
              object-contain
              p-0.5
              sm:p-1
            "
          />
        )}
      </span>

      <span
        className="
          min-w-0
        "
      >
        <span
          className="
            block
            truncate
            text-[10px]
            font-semibold
            sm:text-[12px]
          "
        >
          {method.name}
        </span>

        <span
          className="
            mt-0.5
            block
            text-[8px]
            font-medium
            opacity-70
            sm:text-[10px]
          "
        >
          {method.symbol}
        </span>
      </span>
    </span>
  );
}