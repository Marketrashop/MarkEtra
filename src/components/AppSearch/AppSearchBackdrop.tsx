"use client";

import {
  motion,
} from "framer-motion";

import type {
  AppSearchBackdropProps,
} from "./app-search.types";

import {
  APP_SEARCH_BACKDROP_BLUR,
  APP_SEARCH_TRANSITION,
  APP_SEARCH_Z_INDEX,
} from "./app-search.constants";

export default function AppSearchBackdrop({
  onClose,
}: AppSearchBackdropProps) {
  return (
    <motion.button
      type="button"
      aria-label="Close search"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        duration:
          APP_SEARCH_TRANSITION,
      }}
      onClick={onClose}
      className="
        fixed
        inset-0
        border-0
        bg-black/35
        p-0
        sm:bg-black/45
      "
      style={{
        zIndex:
          APP_SEARCH_Z_INDEX,
        backdropFilter:
          APP_SEARCH_BACKDROP_BLUR,
      }}
    />
  );
}