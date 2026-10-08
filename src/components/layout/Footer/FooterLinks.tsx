"use client";

import { HiChevronDoubleRight } from "react-icons/hi2";

import {
  NavigationLink,
} from "@/components/ui/Preloader";

import { cn } from "@/lib/utils";

type FooterLink = {
  label: string;
  href: string;
};

type FooterLinksProps = {
  title: string;
  links: FooterLink[];
  underlineWidth?: string;
};

export default function FooterLinks({
  title,
  links,
  underlineWidth = "w-36",
}: FooterLinksProps) {
  return (
    <div>
      <h3 className="relative mb-6 inline-block pb-4 text-[22px] font-semibold tracking-tight text-[var(--foreground)]">
        {title}

        <span
          className={cn(
            "absolute bottom-0 left-0 h-[2px] rounded-full bg-[var(--accent-divider)]",
            underlineWidth,
          )}
        />
      </h3>

      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.href}>
            <NavigationLink
              href={link.href}
              className="group inline-flex items-center gap-2 text-[17px] font-medium text-[var(--foreground-muted)] transition-colors duration-200 hover:text-[var(--foreground)]"
            >
              <HiChevronDoubleRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />

              <span>{link.label}</span>
            </NavigationLink>
          </li>
        ))}
      </ul>
    </div>
  );
}