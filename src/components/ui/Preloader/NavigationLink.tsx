"use client";

import Link from "next/link";

import type {
  ComponentProps,
  MouseEvent,
} from "react";

import {
  usePathname,
} from "next/navigation";

import {
  useNavigationLoader,
} from "./NavigationLoaderProvider";

type NavigationLinkProps =
  ComponentProps<typeof Link>;

export default function NavigationLink({
  href,
  onClick,
  ...props
}: NavigationLinkProps) {
  const pathname =
    usePathname();

  const {
    startNavigation,
  } = useNavigationLoader();

  return (
    <Link
      {...props}
      href={href}
      onClick={(
        event: MouseEvent<HTMLAnchorElement>,
      ) => {
        onClick?.(event);

        if (
          event.defaultPrevented
        ) {
          return;
        }

        const currentPath =
          typeof href === "string"
            ? href
                .split("?")[0]
                .split("#")[0]
            : href.pathname ?? "";

        if (
          currentPath === pathname
        ) {
          event.preventDefault();

          return;
        }

        startNavigation();
      }}
    />
  );
}