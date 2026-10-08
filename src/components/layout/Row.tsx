import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface RowProps {
  children: ReactNode;
  className?: string;
}

export default function Row({
  children,
  className,
}: RowProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap -mx-2.5 sm:-mx-3",
        className,
      )}
    >
      {children}
    </div>
  );
}