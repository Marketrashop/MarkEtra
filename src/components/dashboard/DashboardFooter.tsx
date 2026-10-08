"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useNavigationLoader } from "@/components/ui/Preloader";

import { cn } from "@/lib/utils";

import UserContainer from "./DashboardContainer";

type UserFooterProps = {
  className?: string;
};

export default function UserFooter({
  className,
}: UserFooterProps) {
  const year =
    new Date().getFullYear();

  const router =
    useRouter();

  const { startNavigation } =
    useNavigationLoader();

  const navigate = (
    href: string,
  ) => {
    startNavigation();

    router.push(href);
  };

  return (
    <footer
      className={cn(
        `
          border-t
          border-[var(--border)]
          bg-[var(--background)]
          transition-colors
          duration-300
        `,
        className,
      )}
    >
      <UserContainer>
        <div
          className="
            flex
            flex-col
            items-center
            justify-between
            gap-0.5
            py-1.5
            text-center
            text-[10px]
            text-[var(--foreground-muted)]
            sm:flex-row
            sm:gap-1
            sm:py-2
            sm:text-left
            sm:text-[13px]
            lg:gap-3
            lg:py-5
          "
        >
          <p>
            © {year} MarkEtra
          </p>

          <nav
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-1.5
              sm:justify-end
              sm:gap-2
            "
          >
            <Link
              href="/terms"
              onClick={(event) => {
                event.preventDefault();

                navigate("/terms");
              }}
              className="
                transition-colors
                duration-300
                hover:text-[var(--foreground)]
              "
            >
              Terms
            </Link>

            <span>•</span>

            <Link
              href="/Privacy"
              onClick={(event) => {
                event.preventDefault();

                navigate("/Privacy");
              }}
              className="
                transition-colors
                duration-300
                hover:text-[var(--foreground)]
              "
            >
              Privacy
            </Link>

            <span>•</span>

            <Link
              href="/support"
              onClick={(event) => {
                event.preventDefault();

                navigate("/support");
              }}
              className="
                transition-colors
                duration-300
                hover:text-[var(--foreground)]
              "
            >
              Support
            </Link>

            <span>•</span>

            <span>
              Version 1.0.0
            </span>
          </nav>
        </div>
      </UserContainer>
    </footer>
  );
}