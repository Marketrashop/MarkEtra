"use client";

import { useRouter } from "next/navigation";

import {
  Search,
  User,
  X,
} from "lucide-react";

import ThemeToggle from "@/components/ui/ThemeToggle";

import {
  useSearchContext,
} from "@/context/AppSearchContext";

import Logo from "./Logo";
import NavLinks from "./NavLinks";
import { useNavigationLoader } from "@/components/ui/Preloader/NavigationLoaderProvider";

type MobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileDrawer({
  isOpen,
  onClose,
}: MobileDrawerProps) {
  const router =
    useRouter();

const {
  startNavigation,
} = useNavigationLoader();

  const {
    openSearch,
  } =
    useSearchContext();

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[85%] max-w-sm flex-col bg-[var(--background)] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] pl-4 pr-5 pt-6 pb-4">
          <Logo className="-ml-1" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              text-[var(--foreground)]
              transition-all
              duration-200
              hover:bg-[color-mix(in_srgb,var(--primary)_12%,transparent)]
              hover:text-[var(--primary)]
              active:scale-95
            "
          >
            <X
              size={22}
              strokeWidth={2.3}
            />
          </button>
        </div>

        <div className="border-b border-[var(--border)] px-5 py-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              openSearch();
            }}
            className="
              flex
              h-11
              w-full
              items-center
              gap-3
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--surface)]
              px-4
              text-sm
              text-[var(--foreground-muted)]
              transition-all
              duration-200
              hover:border-[var(--primary)]
              hover:bg-[var(--muted)]
              hover:text-[var(--primary)]
            "
          >
            <Search
              size={18}
            />

            <span>
              Search products...
            </span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-4">
<NavLinks
  orientation="vertical"
  onNavigate={() => {
    startNavigation();
    onClose();
  }}
/>

          <div className="mt-6">
            <button
              type="button"
onClick={() => {
  startNavigation();
  onClose();
  router.push("/Auth");
}}
              className="
                flex
                h-9
                w-full
                items-center
                justify-center
                gap-3
                rounded-full
                bg-gradient-to-r
                from-[#6366F1]
                via-[#6D63FF]
                to-[#7C5CFF]
                text-[14px]
                font-semibold
                text-white
                transition-all
                duration-200
                hover:scale-[1.01]
                hover:brightness-110
                active:scale-[0.98]
              "
            >
              <User
                size={17}
                strokeWidth={2.2}
              />

              <span>
                Register / Login
              </span>
            </button>
          </div>
        </nav>

        <div className="border-t border-[var(--border)] px-5 pt-5 pb-16">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] font-medium">
                Appearance
              </p>

              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                Switch between light and dark mode
              </p>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}