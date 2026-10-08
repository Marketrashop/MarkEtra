"use client";

import type {
  DepositMethod as DepositMethodType,
} from "./deposit.types";

type DepositMethodProps = {
  methods: DepositMethodType[];

  loading: boolean;

  value: DepositMethodType | null;

  onChange: (
    method: DepositMethodType,
  ) => void;
};

export default function DepositMethod({
  methods,
  loading,
  value,
  onChange,
}: DepositMethodProps) {
  return (
    <section
      className="
        mt-5
        rounded-[var(--deposit-method-radius)]
        border
        border-[var(--deposit-method-border)]
        bg-[var(--deposit-method-bg)]
        p-3
        shadow-[var(--deposit-method-shadow)]
        transition-all
        duration-300
        sm:mt-8
        sm:p-[var(--deposit-method-padding)]
      "
    >
      <h2
        className="
          text-[16px]
          font-bold
          text-[var(--deposit-method-title)]
          sm:text-[20px]
        "
      >
        Payment Method
      </h2>

      <p
        className="
          mt-1
          text-[11px]
          leading-5
          text-[var(--deposit-method-text)]
          sm:mt-2
          sm:text-[14px]
          sm:leading-6
        "
      >
        Select the cryptocurrency you want to use for your deposit.
      </p>

      <select
        value={value?.id ?? ""}
        disabled={loading}
        onChange={(event) => {
          const method = methods.find(
            (item) =>
              item.id === event.target.value,
          );

          if (method) {
            onChange(method);
          }
        }}
        className="
          mt-4
          h-9
          w-full
          rounded-lg
          border
          border-[var(--deposit-method-select-border)]
          bg-[var(--deposit-method-select-bg)]
          px-2.5
          text-[11px]
          text-[var(--deposit-method-select-text)]
          outline-none
          transition-all
          duration-300
          focus:border-[var(--deposit-method-select-focus)]
          sm:mt-6
          sm:h-auto
          sm:rounded-2xl
          sm:px-4
          sm:py-3
          sm:text-[15px]
        "
      >
        <option value="">
          {loading
            ? "Loading payment methods..."
            : "Select a payment method"}
        </option>

        {methods.map((method) => (
          <option
            key={method.id}
            value={method.id}
          >
            {method.name}
          </option>
        ))}
      </select>
    </section>
  );
}