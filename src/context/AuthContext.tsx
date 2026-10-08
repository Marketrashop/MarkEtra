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

const HEARTBEAT_INTERVAL = 60_000;
const SESSION_VALIDATION_INTERVAL = 5 * 60_000;

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const router = useRouter();

  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  const lastHeartbeat =
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
        /*
         * Network failures should not log the user out.
         * The session may still be completely valid.
         */
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
        now - lastHeartbeat.current <
        HEARTBEAT_INTERVAL
      ) {
        return;
      }

      lastHeartbeat.current = now;

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

        if (response.status === 401) {
          handleSessionInvalid();
        }
      } catch {
        /*
         * Network failures should not log the user out.
         */
      }
    }, [
      user,
      handleSessionInvalid,
    ]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const interval = window.setInterval(
      () => {
        void validateSession();
      },
      SESSION_VALIDATION_INTERVAL,
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [
    user,
    validateSession,
  ]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          void validateSession();
          void sendHeartbeat();
        }
      };

    const handleFocus = () => {
      void validateSession();
      void sendHeartbeat();
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    window.addEventListener(
      "focus",
      handleFocus,
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );

      window.removeEventListener(
        "focus",
        handleFocus,
      );
    };
  }, [
    user,
    validateSession,
    sendHeartbeat,
  ]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const handleActivity = () => {
      void sendHeartbeat();
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
  }, [
    user,
    sendHeartbeat,
  ]);

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