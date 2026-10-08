"use client";

import {
  CheckCircle2,
} from "lucide-react";

import {
  WHY_CHOOSE_MARKETRA,
} from "./services.constants";

export default function WhyChooseMarkEtra() {
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
            grid

            gap-14

            lg:grid-cols-2

            lg:items-start

            lg:gap-20
          "
        >
          <div>
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
              Why MarkEtra
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
              Built with clarity,
              practicality, and long term
              business growth in mind.
            </h2>

            <p
              className="
                mt-6

                max-w-xl

                text-base

                leading-8

                text-[var(--foreground-muted)]

                sm:text-lg
              "
            >
              Every resource on
              MarkEtra is created to help
              entrepreneurs make better
              decisions, save valuable time,
              and build sustainable online
              businesses with confidence.
            </p>
          </div>

          <div
            className="
              grid

              gap-6

              sm:grid-cols-2
            "
          >
            {WHY_CHOOSE_MARKETRA.map(
              (item) => (
                <div
                  key={item}
                  className="
                    flex

                    items-start

                    gap-4
                  "
                >
                  <CheckCircle2
                    className="
                      mt-1

                      h-5

                      w-5

                      flex-shrink-0

                      text-[var(--primary)]
                    "
                  />

                  <p
                    className="
                      text-base

                      leading-8

                      text-[var(--foreground)]
                    "
                  >
                    {item}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}