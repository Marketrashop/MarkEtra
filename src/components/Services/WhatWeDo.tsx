"use client";

import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { SERVICES } from "./services.constants";

export default function WhatWeDo() {
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
            Our Services
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
            Practical services designed to help
            entrepreneurs build and grow online.
          </h2>
        </div>

        <div
          className="
            mt-12

            lg:mt-16
          "
        >
          {SERVICES.map(
            (service, index) => (
              <Link
                key={service.title}
                href={service.href}
                className="
                  group

                  flex

                  flex-col

                  gap-5

                  border-t

                  border-[var(--border)]

                  py-7

                  transition-all

                  duration-300

                  hover:bg-[var(--surface)]

                  lg:flex-row

                  lg:items-start

                  lg:gap-8

                  lg:py-8
                "
              >
                <span
                  className="
                    text-sm

                    font-semibold

                    text-[var(--foreground-muted)]

                    lg:w-16

                    lg:pt-1
                  "
                >
                  {(index + 1)
                    .toString()
                    .padStart(2, "0")}
                </span>

                <div
                  className="
                    flex-1
                  "
                >
                  <h3
                    className="
                      text-xl

                      font-semibold

                      leading-tight

                      text-[var(--foreground)]

                      sm:text-2xl
                    "
                  >
                    {service.title}
                  </h3>

                  <p
                    className="
                      mt-3

                      max-w-2xl

                      text-base

                      leading-8

                      text-[var(--foreground-muted)]

                      sm:text-lg
                    "
                  >
                    {service.description}
                  </p>
                </div>

                <div
                  className="
                    flex

                    justify-end

                    lg:justify-start
                  "
                >
                  <ArrowUpRight
                    className="
                      h-6

                      w-6

                      text-[var(--foreground-muted)]

                      transition-all

                      duration-300

                      group-hover:-translate-y-1

                      group-hover:translate-x-1

                      group-hover:text-[var(--primary)]
                    "
                  />
                </div>
              </Link>
            )
          )}

          <div
            className="
              border-t

              border-[var(--border)]
            "
          />
        </div>
      </div>
    </section>
  );
}