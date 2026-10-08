"use client";

import { ReactNode } from "react";

type NewsletterBackdropProps = {
  onClick: () => void;

  children: ReactNode;
};

export default function NewsletterBackdrop({
  onClick,
  children,
}: NewsletterBackdropProps) {
  return (
    <div
      className="
        fixed
        inset-0
        z-[150]
        flex
        items-center
        justify-center
        bg-[var(--newsletter-backdrop)]
        p-5
        backdrop-blur-[var(--newsletter-blur)]
      "
      onClick={onClick}
    >
      {children}
    </div>
  );
}