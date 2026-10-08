"use client";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { TERMS_CTA } from "./terms.constants";

export default function CTA() {
  return (
    <section
      className="
        border-t

        border-[var(--border)]

        bg-[var(--background)]

        py-16

        transition-colors
        duration-300

        sm:py-20

        lg:py-24
      "
    >
      <div
        className="
          mx-auto

          w-full

          max-w-4xl

          px-5

          text-center

          lg:px-8
        "
      >
        <h2
          className="
            text-3xl

            font-bold

            leading-tight

            text-[var(--foreground)]

            sm:text-4xl

            lg:text-5xl
          "
        >
          {TERMS_CTA.title}
        </h2>

        <p
          className="
            mx-auto

            mt-6

            max-w-2xl

            text-base

            leading-8

            text-[var(--foreground-muted)]

            sm:text-lg
          "
        >
          {TERMS_CTA.description}
        </p>

        <div
          className="
            mt-10

            flex

            justify-center
          "
        >
          <Link
            href="/Contact"
            style={{
              backgroundColor:
                "var(--services-cta-primary-bg)",
              color:
                "var(--services-cta-primary-text)",
            }}
            className="
              inline-flex

              items-center

              justify-center

              gap-3

              rounded-xl

              px-8

              py-4

              font-semibold

              transition-all

              duration-300

              hover:opacity-90

              hover:scale-[1.02]
            "
          >
            {TERMS_CTA.button}

            <ArrowRight
              className="
                h-5

                w-5
              "
            />
          </Link>
        </div>
      </div>
    </section>
  );
}