"use client";

import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type UserContainerProps = {
  children: ReactNode;

  className?: string;
};

export default function UserContainer({
  children,
  className,
}: UserContainerProps) {
  return (
    <div
      className={cn(
        `
          mx-auto
          w-full
          max-w-[1440px]
          px-4
          sm:px-5
          lg:px-8
          xl:px-10
        `,
        className,
      )}
    >
      {children}
    </div>
  );
}