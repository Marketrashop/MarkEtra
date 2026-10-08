"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { AnimatePresence } from "framer-motion";

import {
  usePathname,
  useSearchParams,
} from "next/navigation";

import NavigationLoader from "./NavigationLoader";

type NavigationLoaderContextValue = {
  loading: boolean;
  startNavigation: () => void;
};

const NavigationLoaderContext =
  createContext<NavigationLoaderContextValue | null>(
    null,
  );

type NavigationLoaderProviderProps = {
  children: ReactNode;
};

function NavigationLoaderWatcher({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: (value: boolean) => void;
}) {
  const pathname = usePathname();

  const searchParams =
    useSearchParams();

  const currentUrl =
    `${pathname}?${searchParams.toString()}`;

  const previousUrl =
    useRef(currentUrl);

  useEffect(() => {
    if (
      !loading ||
      currentUrl === previousUrl.current
    ) {
      return;
    }

    previousUrl.current =
      currentUrl;

    const timer = setTimeout(() => {
      setLoading(false);
    }, 250);

    return () =>
      clearTimeout(timer);
  }, [
    currentUrl,
    loading,
    setLoading,
  ]);

  return null;
}

export default function NavigationLoaderProvider({
  children,
}: NavigationLoaderProviderProps) {
  const [loading, setLoading] =
    useState(false);

  const startNavigation =
    useCallback(() => {
      setLoading(true);
    }, []);

  const value = useMemo(
    () => ({
      loading,
      startNavigation,
    }),
    [loading, startNavigation],
  );

  return (
    <NavigationLoaderContext.Provider
      value={value}
    >
      {children}

      <Suspense fallback={null}>
        <NavigationLoaderWatcher
          loading={loading}
          setLoading={setLoading}
        />
      </Suspense>

      <AnimatePresence mode="wait">
        {loading && (
          <NavigationLoader />
        )}
      </AnimatePresence>
    </NavigationLoaderContext.Provider>
  );
}

export function useNavigationLoader() {
  const context = useContext(
    NavigationLoaderContext,
  );

  if (!context) {
    throw new Error(
      "useNavigationLoader must be used within NavigationLoaderProvider.",
    );
  }

  return context;
}