"use client";

import {
  MonitorOff,
} from "lucide-react";

export default function EmptySessions() {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-lg
        border
        border-dashed
        border-[var(--user-card-border)]
        py-7
        text-center
        sm:rounded-[var(--user-radius-md)]
        sm:py-10
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          bg-[var(--user-button-bg)]/10
          text-[var(--user-button-bg)]
          sm:h-11
          sm:w-11
        "
      >
        <MonitorOff
          size={18}
          className="sm:hidden"
        />
        <MonitorOff
          size={22}
          className="hidden sm:block"
        />
      </div>

      <h3
        className="
          mt-2.5
          text-[12px]
          font-semibold
          text-[var(--user-title)]
          sm:mt-3
          sm:text-sm
        "
      >
        No Active Sessions
      </h3>

      <p
        className="
          mt-0.5
          max-w-sm
          px-3
          text-[10px]
          leading-4
          text-[var(--user-text-muted)]
          sm:mt-1
          sm:px-0
          sm:text-xs
          sm:leading-5
        "
      >
        There are no other active sessions associated
        with this account.
      </p>
    </div>
  );
}