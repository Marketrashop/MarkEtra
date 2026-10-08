"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  link: string | null;
};

type UnreadResponse = {
  success: boolean;
  count: number;
};

type NotificationsResponse = {
  success: boolean;
  data: Notification[];
};

export default function useNotifications() {
  const [
    notifications,
    setNotifications,
  ] = useState<
    Notification[]
  >([]);

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    open,
    setOpen,
  ] = useState(false);

  const loadUnreadCount =
    useCallback(async () => {
      try {
        const response =
          await fetch(
            "/api/notifications/unread-count",
            {
              cache: "no-store",
            },
          );

        if (!response.ok) {
          return;
        }

        const result: UnreadResponse =
          await response.json();

        if (result.success) {
          setUnreadCount(
            result.count,
          );
        }
      } catch (error) {
        console.error(error);
      }
    }, []);

  const loadNotifications =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await fetch(
            "/api/notifications",
            {
              cache: "no-store",
            },
          );

        if (!response.ok) {
          return;
        }

        const result: NotificationsResponse =
          await response.json();

        if (result.success) {
          setNotifications(
            result.data,
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

const toggle = useCallback(
  async (next: boolean) => {
    setOpen(next);

    if (next) {
      await loadNotifications();
      await loadUnreadCount();
    }
  },
  [
    loadNotifications,
    loadUnreadCount,
  ],
);

  async function markRead(
    id: string,
  ) {
    try {
      setNotifications(
        (previous) =>
          previous.map(
            (
              notification,
            ) =>
              notification.id ===
              id
                ? {
                    ...notification,
                    isRead: true,
                  }
                : notification,
          ),
      );

      setUnreadCount(
        (count) =>
          Math.max(
            count - 1,
            0,
          ),
      );

      await fetch(
        "/api/notifications/mark-read",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            notificationId: id,
          }),
        },
      );

await loadUnreadCount();

    } catch (error) {
      console.error(error);

      loadNotifications();

      loadUnreadCount();
    }
  }

  async function markAllRead() {
    try {
      setNotifications(
        (previous) =>
          previous.map(
            (
              notification,
            ) => ({
              ...notification,
              isRead: true,
            }),
          ),
      );

      setUnreadCount(0);

      await fetch(
        "/api/notifications/mark-all-read",
        {
          method: "POST",
        },
      );

await loadUnreadCount();

    } catch (error) {
      console.error(error);

      loadNotifications();

      loadUnreadCount();
    }
  }

  return {
    open,
    toggle,
    loading,
    unreadCount,
    notifications,
    loadNotifications,
    loadUnreadCount,
    markRead,
    markAllRead,
  };
}