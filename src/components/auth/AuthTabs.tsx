"use client";

import { motion } from "framer-motion";

type AuthMode =
  | "login"
  | "register";

type AuthTabsProps = {
  value: AuthMode;

  onChange: (
    value: AuthMode,
  ) => void;
};

const tabs = [
  {
    label: "Sign In",
    value: "login",
  },
  {
    label: "Create Account",
    value: "register",
  },
] as const;

export default function AuthTabs({
  value,
  onChange,
}: AuthTabsProps) {
  return (
    <div
      className="
        relative

        flex

        h-11

        min-w-0

        rounded-[22px]

        border

        border-[var(--border)]

        bg-[var(--surface)]

        p-0.5

        sm:h-12

        sm:rounded-[26px]

        sm:p-1
      "
    >
      {tabs.map((tab) => {
        const active =
          value === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() =>
              onChange(tab.value)
            }
            className="
              relative

              z-10

              flex

              min-w-0

              flex-1

              items-center

              justify-center

              rounded-[18px]

              px-2

              text-[12px]

              font-semibold

              leading-none

              whitespace-nowrap

              transition-colors
              duration-300

              sm:rounded-[22px]

              sm:px-4

              sm:text-[14px]
            "
          >
            {active && (
              <motion.div
                layoutId="auth-tab"
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 34,
                }}
                className="
                  absolute

                  inset-0

                  rounded-[18px]

                  border

                  border-[var(--services-cta-primary-bg)]

                  bg-[var(--services-cta-primary-bg)]

                  shadow-md

                  sm:rounded-[22px]
                "
              />
            )}

            <span
              className={
                active
                  ? "relative whitespace-nowrap text-[var(--services-cta-primary-text)]"
                  : `
                      relative
                      whitespace-nowrap
                      text-[var(--foreground-muted)]
                      hover:text-[var(--foreground)]
                    `
              }
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}