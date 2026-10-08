"use client";

import { motion } from "framer-motion";

import { useRouter } from "next/navigation";
import { useNavigationLoader } from "@/components/ui/Preloader/NavigationLoaderProvider";

import ThemeToggle from "@/components/ui/ThemeToggle";
import { Container } from "@/components/layout";
import { cn } from "@/lib/utils";

import HeaderIcons from "./HeaderIcons";
import Logo from "./Logo";
import NavLinks from "./NavLinks";

type NavbarProps = {
  sticky?: boolean;
};

export default function Navbar({
  sticky = false,
}: NavbarProps) {
const router = useRouter();

const { startNavigation } =
  useNavigationLoader();

  const content = (
    <nav
      className={cn(
        "hidden h-20 lg:block",
        sticky
          ? "h-[88px] border-b border-[var(--border)] bg-[var(--surface-navbar-sticky)]"
          : "h-20 bg-[var(--surface-navbar)]"
      )}
    >
      <Container className="grid h-full grid-cols-12 items-center">
        {/* Logo */}
        <div className="col-span-2 flex items-center">
          <Logo />
        </div>

        {/* Navigation */}
        <div className="col-span-6 flex justify-end pr-8">
<NavLinks
  onNavigate={startNavigation}
/>
        </div>

        {/* Actions */}
        <div className="col-span-4 flex items-center justify-end gap-2">
          <ThemeToggle />

          <HeaderIcons />

          <button
            type="button"
onClick={() => {
  startNavigation();

  router.push("/Auth");
}}
            className="rounded-full border-[1.5px] border-[var(--foreground)] bg-transparent px-4 py-1 text-[14px] font-extrabold text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--foreground)] hover:text-[var(--background)]"
          >
            Register/Login
          </button>
        </div>
      </Container>
    </nav>
  );

  if (!sticky) {
    return content;
  }

  return (
    <motion.div
      initial={{
        y: -80,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      exit={{
        y: -80,
        opacity: 0,
      }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed inset-x-0 top-0 z-50 hidden lg:block"
    >
      {content}
    </motion.div>
  );
}