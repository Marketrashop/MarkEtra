"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/context/AuthContext";

import type {
  CurrentSubscriptionResponse,
  UserSubscription,
} from "@/types/subscription.types";

type SubscriptionContextValue = {
  subscription: UserSubscription | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<UserSubscription | null>;
  hasActiveSubscription: boolean;
};

const SubscriptionContext =
  createContext<
    SubscriptionContextValue | undefined
  >(undefined);

type SubscriptionProviderProps = {
  children: ReactNode;
};

export function SubscriptionProvider({
  children,
}: SubscriptionProviderProps) {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [
    subscription,
    setSubscription,
  ] = useState<UserSubscription | null>(
    null,
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const refresh =
    useCallback(
      async (): Promise<UserSubscription | null> => {
        if (authLoading) {
          return null;
        }

        if (!user) {
          setSubscription(null);
          setError(null);
          setLoading(false);

          return null;
        }

        try {
          setLoading(true);
          setError(null);

          const response =
            await fetch(
              "/api/subscriptions/current",
              {
                credentials:
                  "include",

                cache:
                  "no-store",
              },
            );

          const data =
            (await response.json()) as
              | CurrentSubscriptionResponse
              | {
                  success: false;
                  error?: string;
                };

          if (!response.ok) {
            throw new Error(
              "error" in data &&
                typeof data.error ===
                  "string"
                ? data.error
                : "Failed to load subscription.",
            );
          }

          const currentSubscription =
            "subscription" in data
              ? data.subscription
              : null;

          setSubscription(
            currentSubscription,
          );

          return currentSubscription;
        } catch (error) {
          setSubscription(null);

          setError(
            error instanceof Error
              ? error.message
              : "Something went wrong.",
          );

          return null;
        } finally {
          setLoading(false);
        }
      },
      [
        authLoading,
        user,
      ],
    );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value =
    useMemo(
      () => ({
        subscription,
        loading:
          authLoading || loading,
        error,
        refresh,
        hasActiveSubscription:
          subscription?.status ===
          "ACTIVE",
      }),
      [
        subscription,
        loading,
        authLoading,
        error,
        refresh,
      ],
    );

  return (
    <SubscriptionContext.Provider
      value={value}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context =
    useContext(
      SubscriptionContext,
    );

  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider.",
    );
  }

  return context;
}