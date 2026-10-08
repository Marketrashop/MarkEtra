"use client";

import {
  ArrowRight,
  Compass,
  GraduationCap,
  Rocket,
  TrendingUp,
} from "lucide-react";

import { HOW_WE_HELP } from "./services.constants";

const icons = [
  Compass,
  GraduationCap,
  Rocket,
  TrendingUp,
];

export default function HowWeHelp() {
  return (
    <section
      className="
        bg-[var(--background)]

        py-16

        sm:py-20

        lg:py-24
      "
    >
      <div
        className="
          mx-auto

          w-full

          max-w-7xl

          px-5

          lg:px-8
        "
      >
        <div
          className="
            max-w-3xl
          "
        >
          <p
            className="
              text-xs

              font-semibold

              uppercase

              tracking-[0.2em]

              text-[var(--primary)]

              sm:text-sm
            "
          >
            How We Help
          </p>

          <h2
            className="
              mt-4

              text-3xl

              font-bold

              leading-tight

              text-[var(--foreground)]

              sm:text-4xl

              lg:text-5xl
            "
          >
            A simple path from learning to
            lasting growth.
          </h2>
        </div>

        <div
          className="
            mt-14

            grid

            gap-10

            lg:grid-cols-4

            lg:gap-8
          "
        >
          {HOW_WE_HELP.map(
            (step, index) => {
              const Icon =
                icons[index];

              return (
                <div
                  key={step.title}
                  className="relative"
                >
                  {index <
                    HOW_WE_HELP.length -
                      1 && (
                    <div
                      className="
                        absolute

                        left-8
                        top-8

                        hidden

                        h-px

                        w-full

                        bg-[var(--border)]

                        lg:block
                      "
                    />
                  )}

                  <div
                    className="
                      relative

                      flex

                      h-16
                      w-16

                      items-center
                      justify-center

                      rounded-2xl

                      bg-[var(--primary)]/10
                    "
                  >
                    <Icon
                      className="
                        h-7

                        w-7

                        text-[var(--primary)]
                      "
                    />
                  </div>

                  <p
                    className="
                      mt-6

                      text-sm

                      font-semibold

                      uppercase

                      tracking-[0.15em]

                      text-[var(--primary)]
                    "
                  >
                    Step 0{index + 1}
                  </p>

                  <h3
                    className="
                      mt-3

                      text-2xl

                      font-semibold

                      text-[var(--foreground)]
                    "
                  >
                    {step.title}
                  </h3>

                  <p
                    className="
                      mt-4

                      text-base

                      leading-8

                      text-[var(--foreground-muted)]
                    "
                  >
                    {step.description}
                  </p>

                  {index <
                    HOW_WE_HELP.length -
                      1 && (
                    <ArrowRight
                      className="
                        mt-8

                        h-5

                        w-5

                        text-[var(--primary)]

                        lg:hidden
                      "
                    />
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}