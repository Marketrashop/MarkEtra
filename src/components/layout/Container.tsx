import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface ContainerProps
  extends HTMLAttributes<HTMLDivElement> {}

export default function Container({
  children,
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-2.5 sm:max-w-[540px] sm:px-3 md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}