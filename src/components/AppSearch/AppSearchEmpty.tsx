"use client";

import {
  SearchX,
} from "lucide-react";

import type {
  AppSearchEmptyProps,
} from "./app-search.types";

export default function AppSearchEmpty({
  query,
}: AppSearchEmptyProps) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        py-8
        text-center
        sm:py-14
      "
    >
      <div
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-[var(--surface-card)]
          sm:h-14
          sm:w-14
        "
      >
        <SearchX
          size={19}
          className="
            text-[var(--foreground-muted)]
            sm:h-6
            sm:w-6
          "
        />
      </div>

      <h3
        className="
          mt-3
          text-[14px]
          font-semibold
          text-[var(--foreground)]
          sm:mt-5
          sm:text-[17px]
        "
      >
        No products found
      </h3>

      <p
        className="
          mt-1.5
          max-w-sm
          text-[10px]
          leading-4
          text-[var(--foreground-muted)]
          sm:mt-2
          sm:text-[14px]
          sm:leading-6
        "
      >
        We couldn't find any products matching{" "}
        <span
          className="
            font-semibold
            text-[var(--foreground)]
          "
        >
          "{query}"
        </span>
        . Try another keyword or browse one of our popular searches below.
      </p>
    </div>
  );
}