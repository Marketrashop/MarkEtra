"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  ReactNode,
  useEffect,
} from "react";

import NewsletterBackdrop from "./NewsletterBackdrop";

type NewsletterPopupProps = {
  open: boolean;

  onClose: () => void;

  children: ReactNode;
};

export default function NewsletterPopup({
  open,
  onClose,
  children,
}: NewsletterPopupProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow =
      "hidden";

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
        <NewsletterBackdrop
          onClick={onClose}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            transition={{
              duration: 0.25,
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              mx-4
              flex
              w-full
              max-w-[820px]
              overflow-hidden
              rounded-[var(--newsletter-radius)]
              border
              border-[var(--newsletter-border)]
              bg-[var(--newsletter-bg)]
              shadow-[var(--newsletter-shadow)]

              md:max-h-[480px]
              lg:max-h-[460px]
            "
          >
            {children}
          </motion.div>
        </NewsletterBackdrop>
      )}
    </AnimatePresence>
  );
}