"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminContentProps = {
  children: ReactNode;
  className?: string;
};

export default function AdminContent({
  children,
  className,
}: AdminContentProps) {
  return (
    <main
      className={cn(
        `
          flex-1
          pb-20
          sm:pb-28
          lg:pb-32
        `,
        className,
      )}
    >
      {children}
    </main>
  );
}