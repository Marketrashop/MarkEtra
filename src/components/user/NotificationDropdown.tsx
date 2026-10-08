"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ScrollArea } from "@/components/ui/scroll-area";

import NotificationBell from "./NotificationBell";
import NotificationItem from "./NotificationItem";
import NotificationSkeleton from "./NotificationSkeleton";
import useNotifications from "./useNotifications";

export default function NotificationDropdown() {
  const {
    open,
    toggle,
    loading,
    unreadCount,
    notifications,
    markRead,
    markAllRead,
  } = useNotifications();

  return (
    <DropdownMenu
      open={open}
      onOpenChange={toggle}
    >
      <DropdownMenuTrigger>
        <NotificationBell
          unreadCount={unreadCount}
          renderAs="div"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="
          w-[calc(100vw-1rem)]
          max-w-[380px]
          rounded-xl
          border
          border-[var(--border)]
          bg-[var(--background)]
          p-0
          shadow-xl
          sm:w-[380px]
          sm:rounded-2xl
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-2
            border-b
            border-[var(--border)]
            px-3
            py-2.5
            sm:p-4
          "
        >
          <h3
            className="
              text-[13px]
              font-semibold
              text-[var(--foreground)]
              sm:text-base
            "
          >
            Notifications
          </h3>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="
                shrink-0
                text-[10px]
                font-medium
                text-[var(--primary)]
                hover:underline
                sm:text-sm
              "
            >
              Mark all as read
            </button>
          )}
        </div>

        <ScrollArea className="max-h-[360px] sm:max-h-[420px]">
          {loading ? (
            <NotificationSkeleton />
          ) : notifications.length === 0 ? (
            <div
              className="
                p-6
                text-center
                text-[11px]
                text-[var(--foreground-muted)]
                sm:p-8
                sm:text-sm
              "
            >
              No notifications yet.
            </div>
          ) : (
            <div
              className="
                space-y-2
                p-2
                sm:space-y-3
                sm:p-3
              "
            >
              {notifications.map(
                (notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={
                      notification
                    }
                    onRead={markRead}
                  />
                ),
              )}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}