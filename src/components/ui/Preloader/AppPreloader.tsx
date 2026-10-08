"use client";

import { useEffect, useState } from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import PremiumLoader from "./PremiumLoader";

import {
  PRELOADER_OVERLAY_FADE_DURATION,
  PRELOADER_Z_INDEX,
} from "./preloader.constants";

import {
  AppPreloaderProps,
} from "./preloader.types";

export default function AppPreloader({
  children,
}: AppPreloaderProps) {
  const [
    done,
    setDone,
  ] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDone(true);
    }, 1000);

    return () =>
      clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!done) {
      return;
    }

    const timer = setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent(
          "marketra:preloader-complete",
        ),
      );
    }, 0);

    return () =>
      clearTimeout(timer);
  }, [done]);

  return (
    <>
      <AnimatePresence>
        {!done && (
          <motion.div
            initial={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration:
                PRELOADER_OVERLAY_FADE_DURATION,
            }}
            className="
              fixed
              inset-0
              overflow-hidden
            "
            style={{
              zIndex:
                PRELOADER_Z_INDEX,
            }}
          >
            <PremiumLoader />
          </motion.div>
        )}
      </AnimatePresence>

      {done &&
        children}
    </>
  );
}