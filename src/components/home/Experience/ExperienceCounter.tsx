"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type ExperienceCounterProps = {
  value: number;
  suffix?: string;
};

export default function ExperienceCounter({
  value,
  suffix = "",
}: ExperienceCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const isInView = useInView(ref, {
    once: true,
    amount: 0.6,
  });

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate(latest) {
        setCount(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}