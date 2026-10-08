"use client";

import type {
  AppSearchLoadingProps,
} from "./app-search.types";

export default function AppSearchLoading({
  rows = 5,
}: AppSearchLoadingProps) {
  return (
    <div
      className="
        py-1
        sm:py-2
      "
    >
      {Array.from({
        length: rows,
      }).map((_, index) => (
        <div
          key={index}
          className="
            relative
            flex
            items-center
            gap-2
            py-2
            animate-pulse
            sm:gap-3
            sm:py-3
          "
        >
          <div
            className="
              h-10
              w-10
              flex-shrink-0
              rounded-lg
              bg-[var(--surface-card)]
              sm:h-14
              sm:w-14
              sm:rounded-xl
            "
          />

          <div
            className="
              flex-1
              space-y-1.5
              sm:space-y-2
            "
          >
            <div
              className="
                h-3
                w-3/5
                rounded-full
                bg-[var(--surface-card)]
                sm:h-4
              "
            />

            <div
              className="
                h-2.5
                w-20
                rounded-full
                bg-[var(--surface-card)]
                sm:h-3
                sm:w-24
              "
            />
          </div>

          {index <
            rows - 1 && (
            <div
              className="
                absolute
                bottom-0
                left-[52px]
                right-0
                h-px
                bg-[var(--border)]
                sm:left-[72px]
              "
            />
          )}
        </div>
      ))}
    </div>
  );
}