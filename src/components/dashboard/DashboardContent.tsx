"use client";

import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type UserContentProps = {
  children: ReactNode;

  className?: string;
};

export default function UserContent({
  children,
  className,
}: UserContentProps) {
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