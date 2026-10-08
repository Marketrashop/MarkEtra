"use client";

import { Bell } from "lucide-react";

import { cn } from "@/lib/utils";

type NotificationBellProps = {
  unreadCount?: number;

  onClick?: () => void;

  className?: string;

  renderAs?: "button" | "div";
};

export default function NotificationBell({
  unreadCount = 0,
  onClick,
  className,
  renderAs = "button",
}: NotificationBellProps) {
  const hasUnread = unreadCount > 0;

  if (renderAs === "div") {
    return (
      <div
        className={cn(
          `
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-[var(--border)]
            bg-[var(--surface)]
            text-[var(--foreground)]
            transition-all
            duration-300
            hover:border-[var(--primary)]
            hover:text-[var(--primary)]
          `,
          className,
        )}
      >
        <Bell
          size={18}
          className={hasUnread ? "animate-bounce" : ""}
        />

        {hasUnread && (
          <>
            <span
              className="
                absolute
                right-2.5
                top-2.5
                h-2.5
                w-2.5
                rounded-full
                bg-red-500
                ring-2
                ring-[var(--surface)]
              "
            />

            <span
              className="
                absolute
                -right-1
                -top-1
                flex
                h-5
                min-w-[20px]
                items-center
                justify-center
                rounded-full
                bg-red-500
                px-1
                text-[10px]
                font-bold
                leading-none
                text-white
              "
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label="Notifications"
      onClick={onClick}
      className={cn(
        `
          relative
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-[var(--border)]
          bg-[var(--surface)]
          text-[var(--foreground)]
          transition-all
          duration-300
          hover:border-[var(--primary)]
          hover:text-[var(--primary)]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--primary)]/20
        `,
        className,
      )}
    >
      <Bell
        size={18}
        className={hasUnread ? "animate-bounce" : ""}
      />

      {hasUnread && (
        <>
          <span
            className="
              absolute
              right-2.5
              top-2.5
              h-2.5
              w-2.5
              rounded-full
              bg-red-500
              ring-2
              ring-[var(--surface)]
            "
          />

          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              h-5
              min-w-[20px]
              items-center
              justify-center
              rounded-full
              bg-red-500
              px-1
              text-[10px]
              font-bold
              leading-none
              text-white
            "
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        </>
      )}
    </button>
  );
}