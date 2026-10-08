"use client";

import {
  ShieldCheck,
} from "lucide-react";

export default function SecurityHeader() {
  return (
    <header
      className="
        flex
        items-center
        justify-center
        py-3
        sm:py-4
      "
    >
      <div
        className="
          flex
          items-center
          gap-2.5
          sm:gap-3
        "
      >
        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-[var(--user-button-bg)]
            text-[var(--user-button-text)]
            sm:h-10
            sm:w-10
            sm:rounded-xl
          "
        >
          <ShieldCheck
            size={16}
            className="sm:hidden"
          />

          <ShieldCheck
            size={20}
            className="hidden sm:block"
          />
        </div>

        <h1
          className="
            text-[15px]
            font-semibold
            text-[var(--user-text)]
            sm:text-lg
          "
        >
          Security
        </h1>
      </div>
    </header>
  );
}