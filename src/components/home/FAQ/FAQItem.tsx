"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import {
  FAQ_BODY_BACKGROUND,
  FAQ_BORDER_COLOR,
  FAQ_HEADER_BACKGROUND,
  FAQ_HEADER_HEIGHT,
  FAQ_ICON_SIZE,
  FAQ_ITEM_RADIUS,
  FAQ_OPEN_HEADER_BACKGROUND,
  FAQ_TRANSITION_DURATION,
} from "./faq.constants";
import { FAQItem as FAQItemType } from "./faq.types";

type FAQItemProps = {
  item: FAQItemType;
};

export default function FAQItem({
  item,
}: FAQItemProps) {
  const [open, setOpen] = useState(item.defaultOpen ?? false);

  return (
    <div
      className="overflow-hidden border"
      style={{
        borderRadius: FAQ_ITEM_RADIUS,
        borderColor: FAQ_BORDER_COLOR,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="
          flex
          w-full
          items-center
          justify-between

          px-5

          text-left
          transition-colors
        "
        style={{
          minHeight: FAQ_HEADER_HEIGHT,
          background: open
            ? FAQ_OPEN_HEADER_BACKGROUND
            : FAQ_HEADER_BACKGROUND,
        }}
      >
<span
  className="
    pr-6

    text-[18px]
    font-[500]

    text-[var(--foreground)]

    sm:font-[600]
  "
>
  {item.question}
</span>

        {open ? (
          <Minus
            size={FAQ_ICON_SIZE}
            className="shrink-0 text-[#5658EC]"
          />
        ) : (
          <Plus
            size={FAQ_ICON_SIZE}
            className="shrink-0 text-[#5658EC]"
          />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: FAQ_TRANSITION_DURATION,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="overflow-hidden"
          >
            <div
              className="
                border-t

                px-5
                pt-4
                pb-4
              "
              style={{
                borderColor: FAQ_BORDER_COLOR,
                background: FAQ_BODY_BACKGROUND,
              }}
            >
              <p
                className="
                  text-[16px]
                  leading-6

                  text-[var(--foreground-muted)]
                "
              >
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}