"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { Check } from "lucide-react";

type PasswordStrengthProps = {
  password: string;
};

export default function PasswordStrength({
  password,
}: PasswordStrengthProps) {
  const [visible, setVisible] =
    useState(false);

  const rules = [
    {
      label: "At least 6 characters",
      passed: password.length >= 6,
    },
    {
      label: "Uppercase letter",
      passed: /[A-Z]/.test(password),
    },
    {
      label: "Lowercase letter",
      passed: /[a-z]/.test(password),
    },
    {
      label: "Number",
      passed: /\d/.test(password),
    },
    {
      label: "Special character",
      passed:
        /[!@#$%^&*(),.?":{}|<>]/.test(
          password
        ),
    },
  ];

  const score = rules.filter(
    (rule) => rule.passed
  ).length;

  const allPassed =
    score === rules.length;

  useEffect(() => {
    if (!password) {
      setVisible(false);

      return;
    }

    if (allPassed) {
      const timeout =
        setTimeout(() => {
          setVisible(false);
        }, 600);

      return () =>
        clearTimeout(timeout);
    }

    setVisible(true);
  }, [password, allPassed]);

  const levels = [
    {
      label: "Very Weak",
      width: "20%",
      color: "bg-red-500",
    },
    {
      label: "Weak",
      width: "40%",
      color: "bg-orange-500",
    },
    {
      label: "Fair",
      width: "60%",
      color: "bg-yellow-500",
    },
    {
      label: "Good",
      width: "80%",
      color:
        "bg-[var(--primary)]",
    },
    {
      label: "Strong",
      width: "100%",
      color:
        "bg-emerald-500",
    },
  ];

  const current =
    levels[Math.max(score - 1, 0)];

  return (
    <AnimatePresence>
      {password &&
        visible && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              height: "auto",
              y: 0,
            }}
            exit={{
              opacity: 0,
              height: 0,
              y: -8,
            }}
            transition={{
              duration: 0.25,
            }}
            className="
              mt-2

              overflow-hidden

              rounded-xl

              border

              border-[var(--border)]

              bg-[var(--surface)]

              p-2.5

              transition-colors
              duration-300

              sm:mt-2.5

              sm:rounded-2xl

              sm:p-3
            "
          >
            <div
              className="
                mb-2

                flex

                items-center

                justify-between

                sm:mb-2.5
              "
            >
              <span
                className="
                  text-[10px]

                  font-semibold

                  uppercase

                  tracking-[0.06em]

                  text-[var(--foreground-muted)]

                  sm:text-[12px]

                  sm:tracking-[0.08em]
                "
              >
                Password Strength
              </span>

              <span
                className="
                  text-[11px]

                  font-semibold

                  text-[var(--foreground)]

                  sm:text-[13px]
                "
              >
                {current.label}
              </span>
            </div>

            <div
              className="
                h-1.5

                overflow-hidden

                rounded-full

                bg-[var(--border)]

                sm:h-2
              "
            >
              <div
                className={`
                  h-full

                  rounded-full

                  transition-all
                  duration-500

                  ${current.color}
                `}
                style={{
                  width:
                    current.width,
                }}
              />
            </div>

            <div
              className="
                mt-2.5

                grid

                gap-1.5

                sm:mt-3

                sm:gap-2
              "
            >
              {rules.map(
                (rule) => (
                  <div
                    key={rule.label}
                    className="
                      flex

                      items-center

                      gap-2

                      sm:gap-2.5
                    "
                  >
                    <div
                      className={`
                        flex

                        h-4

                        w-4

                        items-center

                        justify-center

                        rounded-full

                        border

                        transition-all
                        duration-300

                        sm:h-5

                        sm:w-5

                        ${
                          rule.passed
                            ? `
                                border-emerald-500

                                bg-emerald-500

                                text-white
                              `
                            : `
                                border-[var(--border)]

                                bg-[var(--surface)]

                                text-transparent
                              `
                        }
                      `}
                    >
                      <Check
                        size={10}
                        className="
                          sm:h-3
                          sm:w-3
                        "
                      />
                    </div>

                    <span
                      className={`
                        text-[11px]

                        transition-colors
                        duration-300

                        sm:text-[13px]

                        ${
                          rule.passed
                            ? "text-[var(--foreground)]"
                            : "text-[var(--foreground-muted)]"
                        }
                      `}
                    >
                      {rule.label}
                    </span>
                  </div>
                )
              )}
            </div>
          </motion.div>
        )}
    </AnimatePresence>
  );
}