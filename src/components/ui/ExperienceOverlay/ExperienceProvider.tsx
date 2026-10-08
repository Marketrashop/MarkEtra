"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import ExperienceOverlay from "./ExperienceOverlay";
import ExperienceContext from "./ExperienceContext";

import {
  getPendingExperience,
} from "./experience.utils";

import type {
  ExperienceOptions,
  ExperienceState,
} from "./experience.types";

type ExperienceProviderProps = {
  children: React.ReactNode;
};

export default function ExperienceProvider({
  children,
}: ExperienceProviderProps) {
  const [
    experience,
    setExperience,
  ] = useState<
    ExperienceState | null
  >(null);

  const hideExperience =
    useCallback(() => {
      setExperience(null);
    }, []);

  const showExperience =
    useCallback(
      (
        options: ExperienceOptions,
      ) => {
        setExperience({
          id:
            crypto.randomUUID(),
          open: true,
          ...options,
        });
      },
      [],
    );

  useEffect(() => {
    const pendingExperience =
      getPendingExperience();

    if (
      pendingExperience
    ) {
      showExperience(
        pendingExperience,
      );
    }
  }, [showExperience]);

  const value = useMemo(
    () => ({
      experience,
      showExperience,
      hideExperience,
    }),
    [
      experience,
      showExperience,
      hideExperience,
    ],
  );

  return (
    <ExperienceContext.Provider
      value={value}
    >
      {children}

      <ExperienceOverlay />
    </ExperienceContext.Provider>
  );
}