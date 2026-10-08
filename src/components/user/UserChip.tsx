"use client";

import Image from "next/image";

import { User } from "lucide-react";

import { cn } from "@/lib/utils";

type AvatarMenuProps = {
  image?: string | null;

  firstName?: string;

  lastName?: string;

  onClick?: () => void;

  className?: string;
};

export default function AvatarMenu({
  image,

  firstName = "Walter",

  lastName = "Curtis",

  onClick,

  className,
}: AvatarMenuProps) {
  const fullName =
    `${firstName} ${lastName}`.trim();

  return (
    <button
      type="button"
      aria-label={fullName}
      title={fullName}
      onClick={onClick}
      className={cn(
        `
          group

          relative

          flex

          h-10

          w-10

          shrink-0

          items-center

          justify-center

          overflow-hidden

          rounded-full

          border-2

          border-[var(--border)]

          bg-[var(--surface-card)]

          transition-all
          duration-300

          hover:border-[#5b5cf0]

          hover:scale-105

          focus-visible:outline-none

          focus-visible:ring-2

          focus-visible:ring-[#5b5cf0]/30

          sm:h-11
          
          sm:w-11
        `,
        className
      )}
    >
      {image ? (
        <Image
          src={image}
          alt={fullName}
          fill
          className="
            object-cover
          "
        />
      ) : (
        <User
          size={20}
          className="
            text-[var(--foreground-muted)]
          "
        />
      )}
    </button>
  );
}