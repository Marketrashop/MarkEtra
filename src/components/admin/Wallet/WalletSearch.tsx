"use client";

import type {
  ChangeEvent,
} from "react";

import type {
  WalletSearchProps,
} from "./wallet.types";

export default function WalletSearch({
  value,
  onChange,
}: WalletSearchProps) {
  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    onChange(
      event.target.value,
    );
  }

  return (
    <input
      type="search"
      value={value}
      onChange={handleChange}
      placeholder="Search by name or email..."
      autoComplete="off"
      spellCheck={false}
      className="
        h-8
        w-full
        rounded-md
        border
        px-2.5
        text-[10px]
        outline-none
        transition
        sm:h-9
        sm:rounded-lg
        sm:px-3
        sm:text-xs
        lg:max-w-md
      "
      style={{
        background:
          "var(--admin-input-bg)",
        borderColor:
          "var(--admin-input-border)",
        color:
          "var(--admin-input-text)",
      }}
    />
  );
}