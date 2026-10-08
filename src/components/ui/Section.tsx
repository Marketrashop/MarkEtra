import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import Container from "./Container";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  containerClassName?: string;
}

export default function Section({
  children,
  className,
  containerClassName,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "py-16 md:py-20 lg:py-24",
        className
      )}
      {...props}
    >
      <Container className={containerClassName}>
        {children}
      </Container>
    </section>
  );
}