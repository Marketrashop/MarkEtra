import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface ColProps {
  children: ReactNode;
  className?: string;

  sm?: ColSpan;
  md?: ColSpan;
  lg?: ColSpan;
  xl?: ColSpan;
  xxl?: ColSpan;
}

const smClasses: Record<ColSpan, string> = {
  1: "sm:basis-1/12 sm:max-w-[8.333333%]",
  2: "sm:basis-2/12 sm:max-w-[16.666667%]",
  3: "sm:basis-3/12 sm:max-w-[25%]",
  4: "sm:basis-4/12 sm:max-w-[33.333333%]",
  5: "sm:basis-5/12 sm:max-w-[41.666667%]",
  6: "sm:basis-1/2 sm:max-w-[50%]",
  7: "sm:basis-7/12 sm:max-w-[58.333333%]",
  8: "sm:basis-8/12 sm:max-w-[66.666667%]",
  9: "sm:basis-9/12 sm:max-w-[75%]",
  10: "sm:basis-10/12 sm:max-w-[83.333333%]",
  11: "sm:basis-11/12 sm:max-w-[91.666667%]",
  12: "sm:basis-full sm:max-w-full",
};

const mdClasses: Record<ColSpan, string> = {
  1: "md:basis-1/12 md:max-w-[8.333333%]",
  2: "md:basis-2/12 md:max-w-[16.666667%]",
  3: "md:basis-3/12 md:max-w-[25%]",
  4: "md:basis-4/12 md:max-w-[33.333333%]",
  5: "md:basis-5/12 md:max-w-[41.666667%]",
  6: "md:basis-1/2 md:max-w-[50%]",
  7: "md:basis-7/12 md:max-w-[58.333333%]",
  8: "md:basis-8/12 md:max-w-[66.666667%]",
  9: "md:basis-9/12 md:max-w-[75%]",
  10: "md:basis-10/12 md:max-w-[83.333333%]",
  11: "md:basis-11/12 md:max-w-[91.666667%]",
  12: "md:basis-full md:max-w-full",
};

const lgClasses: Record<ColSpan, string> = {
  1: "lg:basis-1/12 lg:max-w-[8.333333%]",
  2: "lg:basis-2/12 lg:max-w-[16.666667%]",
  3: "lg:basis-3/12 lg:max-w-[25%]",
  4: "lg:basis-4/12 lg:max-w-[33.333333%]",
  5: "lg:basis-5/12 lg:max-w-[41.666667%]",
  6: "lg:basis-1/2 lg:max-w-[50%]",
  7: "lg:basis-7/12 lg:max-w-[58.333333%]",
  8: "lg:basis-8/12 lg:max-w-[66.666667%]",
  9: "lg:basis-9/12 lg:max-w-[75%]",
  10: "lg:basis-10/12 lg:max-w-[83.333333%]",
  11: "lg:basis-11/12 lg:max-w-[91.666667%]",
  12: "lg:basis-full lg:max-w-full",
};

const xlClasses: Record<ColSpan, string> = {
  1: "xl:basis-1/12 xl:max-w-[8.333333%]",
  2: "xl:basis-2/12 xl:max-w-[16.666667%]",
  3: "xl:basis-3/12 xl:max-w-[25%]",
  4: "xl:basis-4/12 xl:max-w-[33.333333%]",
  5: "xl:basis-5/12 xl:max-w-[41.666667%]",
  6: "xl:basis-1/2 xl:max-w-[50%]",
  7: "xl:basis-7/12 xl:max-w-[58.333333%]",
  8: "xl:basis-8/12 xl:max-w-[66.666667%]",
  9: "xl:basis-9/12 xl:max-w-[75%]",
  10: "xl:basis-10/12 xl:max-w-[83.333333%]",
  11: "xl:basis-11/12 xl:max-w-[91.666667%]",
  12: "xl:basis-full xl:max-w-full",
};

const xxlClasses: Record<ColSpan, string> = {
  1: "2xl:basis-1/12 2xl:max-w-[8.333333%]",
  2: "2xl:basis-2/12 2xl:max-w-[16.666667%]",
  3: "2xl:basis-3/12 2xl:max-w-[25%]",
  4: "2xl:basis-4/12 2xl:max-w-[33.333333%]",
  5: "2xl:basis-5/12 2xl:max-w-[41.666667%]",
  6: "2xl:basis-1/2 2xl:max-w-[50%]",
  7: "2xl:basis-7/12 2xl:max-w-[58.333333%]",
  8: "2xl:basis-8/12 2xl:max-w-[66.666667%]",
  9: "2xl:basis-9/12 2xl:max-w-[75%]",
  10: "2xl:basis-10/12 2xl:max-w-[83.333333%]",
  11: "2xl:basis-11/12 2xl:max-w-[91.666667%]",
  12: "2xl:basis-full 2xl:max-w-full",
};

export default function Col({
  children,
  className,
  sm,
  md,
  lg,
  xl,
  xxl,
}: ColProps) {
  return (
    <div
      className={cn(
        "w-full shrink-0 px-3",

        sm && smClasses[sm],
        md && mdClasses[md],
        lg && lgClasses[lg],
        xl && xlClasses[xl],
        xxl && xxlClasses[xxl],

        className
      )}
    >
      {children}
    </div>
  );
}