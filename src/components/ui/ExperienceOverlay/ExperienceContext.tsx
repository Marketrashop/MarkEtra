"use client";

import { createContext } from "react";

import type {
  ExperienceContextValue,
} from "./experience.types";

const ExperienceContext =
  createContext<
    ExperienceContextValue | undefined
  >(undefined);

export default ExperienceContext;