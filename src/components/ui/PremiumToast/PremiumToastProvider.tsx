"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import PremiumToast from "./PremiumToast";
import PremiumToastContext from "./PremiumToastContext";

import {
  PREMIUM_TOAST_DURATION,
} from "./premium-toast.constants";

import {
  getPendingToast,
  savePendingToast,
  clearPendingToast,
} from "./premium-toast.utils";

import type {
  PremiumToastOptions,
  PremiumToastState,
} from "./premium-toast.types";

type PremiumToastProviderProps = {
  children: React.ReactNode;
};

export default function PremiumToastProvider({
  children,
}: PremiumToastProviderProps) {
  const [
    toast,
    setToast,
  ] = useState<
    PremiumToastState | null
  >(null);

  const timerRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const clearTimer =
    useCallback(() => {
      if (
        timerRef.current !==
        null
      ) {
        clearTimeout(
          timerRef.current,
        );

        timerRef.current =
          null;
      }
    }, []);

  const hideToast =
    useCallback(() => {
      clearTimer();

      setToast((current) => {
        if (!current) {
          return null;
        }

        return {
          ...current,
          open: false,
        };
      });
    }, [clearTimer]);

  const showToast =
    useCallback(
      (
        options: PremiumToastOptions,
      ) => {
        clearTimer();

        if (
          options.persistOnNavigation
        ) {
          savePendingToast(
            options,
          );
        }

        const duration =
          options.duration ??
          PREMIUM_TOAST_DURATION;

        setToast({
          id:
            crypto.randomUUID(),

          open: true,

          ...options,
        });

        timerRef.current =
          setTimeout(
            () => {
              hideToast();
            },
            duration,
          );
      },
      [
        clearTimer,
        hideToast,
      ],
    );

  useEffect(() => {
    const pendingToast =
      getPendingToast();

    if (
      pendingToast
    ) {
      showToast(
        pendingToast,
      );

      clearPendingToast();
    }
  }, [showToast]);

  useEffect(() => {
    if (
      toast &&
      !toast.open
    ) {
      const timer =
        setTimeout(() => {
          setToast(null);
        }, 250);

      return () =>
        clearTimeout(
          timer,
        );
    }
  }, [toast]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  const value =
    useMemo(
      () => ({
        toast,

        showToast,

        hideToast,
      }),
      [
        toast,
        showToast,
        hideToast,
      ],
    );

  return (
    <PremiumToastContext.Provider
      value={value}
    >
      {children}

      <PremiumToast />
    </PremiumToastContext.Provider>
  );
}