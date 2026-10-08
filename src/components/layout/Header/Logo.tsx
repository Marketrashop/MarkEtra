"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  NavigationLink,
} from "@/components/ui/Preloader";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

export default function Logo({
  className,
  size = "md",
}: LogoProps) {
  const pathname = usePathname();

  const sizeClasses = {
    sm: "w-[120px] h-auto",
    md: "w-[120px] h-auto lg:w-[160px]",
    lg: "w-[140px] h-auto lg:w-[180px]",
  };

  return (
    <NavigationLink
      href="/"
      aria-label="Marketra"
      onClick={(event) => {
        if (pathname === "/") {
          event.preventDefault();
        }
      }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        className,
      )}
    >
      <Image
        src="/assets/images/general/logo.png"
        alt="Marketra"
        width={160}
        height={48}
        priority
        draggable={false}
        className={cn(
          "object-contain",
          sizeClasses[size],
        )}
      />
    </NavigationLink>
  );
}