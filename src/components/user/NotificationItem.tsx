"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import type { Notification } from "./useNotifications";

type NotificationItemProps = {
  notification: Notification;

  onRead: (
    id: string,
  ) => void;
};

export default function NotificationItem({
  notification,
  onRead,
}: NotificationItemProps) {
  const content = (
    <div
      className={cn(
        `
          flex
          items-start
          justify-between
          gap-2
          rounded-md
          border
          border-[var(--border)]
          p-2
          transition-colors
          hover:bg-[var(--surface)]
          sm:gap-4
          sm:rounded-xl
          sm:p-4
        `,
        !notification.isRead &&
          "border-[var(--primary)]/20 bg-[var(--primary)]/5",
      )}
    >
      <div className="min-w-0 flex-1">
        <div
          className="
            flex
            items-center
            gap-1
            sm:gap-2
          "
        >
          {!notification.isRead && (
            <span
              className="
                h-1.5
                w-1.5
                shrink-0
                rounded-full
                bg-[var(--primary)]
                sm:h-2
                sm:w-2
              "
            />
          )}

<h4
  className="
    truncate
    text-[10px]
    font-semibold
    text-[var(--foreground)]
    sm:text-sm
  "
>
            {notification.title}
          </h4>
        </div>

        <p
          className="
            mt-1
            text-[9px]
            leading-3.5
            text-[var(--foreground-muted)]
            sm:mt-2
            sm:text-sm
            sm:leading-normal
          "
        >
          {notification.message}
        </p>

        <p
          className="
            mt-1.5
            text-[8px]
            text-[var(--foreground-muted)]
            sm:mt-3
            sm:text-xs
          "
        >
          {new Date(
            notification.createdAt,
          ).toLocaleString()}
        </p>
      </div>

      <ChevronRight
        size={13}
        className="
          mt-0.5
          shrink-0
          text-[var(--foreground-muted)]
          sm:mt-1
          sm:h-[18px]
          sm:w-[18px]
        "
      />
    </div>
  );

  if (notification.link) {
    return (
      <Link
        href={notification.link}
        onClick={() =>
          onRead(notification.id)
        }
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() =>
        onRead(notification.id)
      }
      className="
        block
        w-full
        text-left
      "
    >
      {content}
    </button>
  );
}