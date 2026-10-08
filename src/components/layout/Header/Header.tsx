"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";

import { useStickyHeader } from "@/hooks/useStickyHeader";

import MobileDrawer from "./MobileDrawer";
import MobileHeader from "./MobileHeader";
import Navbar from "./Navbar";
import TopBar from "./TopBar";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const { isSticky } = useStickyHeader();

  return (
    <>
      <TopBar />

      {/* Normal desktop navbar */}
      <Navbar />

      {/* Normal mobile header */}
<MobileHeader
  isOpen={isMobileMenuOpen}
  onMenuClick={() =>
    setIsMobileMenuOpen(
      (current) => !current,
    )
  }
/>

      {/* Sticky desktop + mobile headers */}
      <AnimatePresence>
        {isSticky && (
          <>
            <Navbar sticky />

<MobileHeader
  sticky
  isOpen={isMobileMenuOpen}
  onMenuClick={() =>
    setIsMobileMenuOpen(
      (current) => !current,
    )
  }
/>
          </>
        )}
      </AnimatePresence>

      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() =>
          setIsMobileMenuOpen(false)
        }
      />
    </>
  );
}