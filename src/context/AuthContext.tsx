"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { AUTH_CONSTANTS } from "@/lib/auth/constants";

type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  emailVerifiedAt: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext =
  createContext<AuthContextValue | null>(
    null,
  );

type AuthProviderProps = {
  children: React.ReactNode;
};

const HEARTBEAT_INTERVAL =
  AUTH_CONSTANTS.SESSION_ACTIVITY_REFRESH_INTERVAL_MS;

const SESSION_VALIDATION_INTERVAL =
  AUTH_CONSTANTS.SESSION_ACTIVITY_REFRESH_INTERVAL_MS;

const INACTIVITY_TIMEOUT =
  AUTH_CONSTANTS.SESSION_IDLE_TIMEOUT_MS;

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const router = useRouter();

  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [loading, setLoading] =
    useState(true);

const lastActivityAt =
  useRef(Date.now());

const lastHeartbeatAt =
  useRef(0);

const validatingSession =
  useRef(false);

  const handleSessionInvalid = useCallback(() => {
    setUser(null);
    router.replace("/Auth");
  }, [router]);

  const refresh = useCallback(
    async () => {
      try {
        const response = await fetch(
          "/api/auth/me",
          {
            credentials: "include",
            cache: "no-store",
          },
        );

        if (response.status === 401) {
          setUser(null);
          return;
        }

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data =
          await response.json();

        if (!data.success) {
          setUser(null);
          return;
        }

        setUser(data.user);
      } catch {
        setUser(null);
      }
    },
    [],
  );

  const validateSession =
    useCallback(async () => {
      if (
        !user ||
        validatingSession.current
      ) {
        return;
      }

      validatingSession.current = true;

      try {
        const response = await fetch(
          "/api/auth/me",
          {
            credentials: "include",
            cache: "no-store",
          },
        );

        if (response.status === 401) {
          handleSessionInvalid();
          return;
        }

        if (!response.ok) {
          return;
        }

        const data =
          await response.json();

        if (!data.success) {
          handleSessionInvalid();
          return;
        }

        setUser(data.user);
      } catch {

      } finally {
        validatingSession.current = false;
      }
    }, [
      user,
      handleSessionInvalid,
    ]);

const logout = useCallback(
  async () => {
    try {
      await fetch(
        "/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        },
      );
    } finally {
      lastActivityAt.current = 0;
      lastHeartbeatAt.current = 0;
      setUser(null);
    }
  },
  [],
);

  useEffect(() => {
    async function initializeAuth() {
      try {
        await refresh();
      } finally {
        setLoading(false);
      }
    }

    void initializeAuth();
  }, [refresh]);

const sendHeartbeat =
  useCallback(async () => {
    if (!user) {
      return;
    }

    const now = Date.now();

    if (
      now - lastHeartbeatAt.current <
      HEARTBEAT_INTERVAL
    ) {
      return;
    }

    if (
      now - lastActivityAt.current >=
      INACTIVITY_TIMEOUT
    ) {
      return;
    }

    lastHeartbeatAt.current = now;

    try {
      const response =
        await fetch(
          "/api/auth/activity",
          {
            method: "POST",
            credentials: "include",
            keepalive: true,
          },
        );

      if (
        response.status === 401
      ) {
        handleSessionInvalid();
      }
    } catch {

    }
  }, [
    user,
    handleSessionInvalid,
  ]);

useEffect(() => {
  if (!user) {
    return;
  }

  const interval =
    window.setInterval(() => {
      const now = Date.now();

      if (
        now - lastActivityAt.current >=
        INACTIVITY_TIMEOUT
      ) {
        return;
      }

      void validateSession();
    }, SESSION_VALIDATION_INTERVAL);

  return () => {
    window.clearInterval(
      interval,
    );
  };
}, [
  user,
  validateSession,
]);

useEffect(() => {
  if (!user) {
    return;
  }

  const markActivity =
    () => {
      lastActivityAt.current =
        Date.now();
    };

  document.addEventListener(
    "visibilitychange",
    markActivity,
  );

  window.addEventListener(
    "focus",
    markActivity,
  );

  return () => {
    document.removeEventListener(
      "visibilitychange",
      markActivity,
    );

    window.removeEventListener(
      "focus",
      markActivity,
    );
  };
}, [user]);

useEffect(() => {
  if (!user) {
    return;
  }

  const handleActivity = () => {
    lastActivityAt.current =
      Date.now();
  };

  const events = [
    "mousemove",
    "mousedown",
    "keydown",
    "touchstart",
    "scroll",
    "click",
    "pointerdown",
  ] as const;

  events.forEach((event) => {
    window.addEventListener(
      event,
      handleActivity,
      {
        passive:
          event === "mousemove" ||
          event === "touchstart" ||
          event === "scroll",
      },
    );
  });

  return () => {
    events.forEach((event) => {
      window.removeEventListener(
        event,
        handleActivity,
      );
    });
  };
}, [user]);

useEffect(() => {
  if (!user) {
    return;
  }

  const checkInactivity =
    () => {
      const now = Date.now();

      if (
        now - lastActivityAt.current >=
        INACTIVITY_TIMEOUT
      ) {
        void logout();
      }
    };

  const interval =
    window.setInterval(
      checkInactivity,
      60_000,
    );

  return () => {
    window.clearInterval(
      interval,
    );
  };
}, [user, logout]);

  const value = useMemo(
    () => ({
      user,
      loading,
      refresh,
      logout,
      isAuthenticated:
        user !== null,
    }),
    [
      user,
      loading,
      refresh,
      logout,
    ],
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider.",
    );
  }

  return context;
}