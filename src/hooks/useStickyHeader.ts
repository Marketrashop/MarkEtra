"use client";

import { useEffect, useState } from "react";

const STICKY_THRESHOLD = 80;

export function useStickyHeader() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsSticky(window.scrollY > STICKY_THRESHOLD);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () =>
      window.removeEventListener("scroll", onScroll);
  }, []);

  return {
    isSticky,
  };
}