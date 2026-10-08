"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { X } from "lucide-react";

import CartBody from "./CartBody";
import CartFooter from "./CartFooter";
import CartHeader from "./CartHeader";

import type {
  AppEnvironment,
} from "@/types/environment";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  environment?: AppEnvironment;
};

export default function CartDrawer({
  open,
  onClose,
  environment = "public",
}: CartDrawerProps) {
  const drawerRef =
    useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow =
        "";

      return;
    }

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            onClick={onClose}
            className="fixed inset-0 z-[90]"
            style={{
              background:
                "var(--cart-backdrop)",
              backdropFilter:
                "blur(var(--cart-blur))",
            }}
          />

          <motion.aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Cart"
            initial={{
              x: "100%",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "100%",
            }}
            transition={{
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
            className="fixed right-0 top-0 z-[100] flex h-screen w-full max-w-md flex-col border-l"
            style={{
              background:
                "var(--cart-bg)",
              borderColor:
                "var(--cart-border)",
              boxShadow:
                "var(--cart-shadow)",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-105"
              style={{
                background:
                  "var(--cart-button-secondary-bg)",
                border:
                  "1px solid var(--cart-border)",
              }}
            >
              <X size={18} />
            </button>

            <CartHeader />

            <div className="flex min-h-0 flex-1 flex-col">
              <CartBody
                environment={
                  environment
                }
                onClose={onClose}
              />

              <CartFooter
                onClose={onClose}
              />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}