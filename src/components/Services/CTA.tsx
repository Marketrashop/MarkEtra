"use client";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { SERVICES_CTA } from "./services.constants";

export default function CTA() {
  return (
    <section
      className="
        border-t

        border-[var(--services-cta-border)]

        bg-[var(--services-cta-bg)]

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

            text-[var(--services-cta-heading)]

            transition-colors
            duration-300

            sm:text-4xl

            lg:text-5xl
          "
        >
          {SERVICES_CTA.title}
        </h2>

        <p
          className="
            mx-auto

            mt-6

            max-w-2xl

            text-base

            leading-8

            text-[var(--services-cta-text)]

            transition-colors
            duration-300

            sm:text-lg
          "
        >
          {SERVICES_CTA.description}
        </p>

        <div
          className="
            mt-10

            flex

            flex-col

            items-center

            gap-4

            sm:flex-row

            sm:justify-center
          "
        >
          <Link
            href="/shop"
            style={{
              backgroundColor:
                "var(--services-cta-primary-bg)",
              color:
                "var(--services-cta-primary-text)",
            }}
            className="
              inline-flex

              w-full

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

              sm:w-auto
            "
          >
            {SERVICES_CTA.primaryButton}

            <ArrowRight className="h-5 w-5" />
          </Link>

          <Link
            href="/Contact"
            className="
              inline-flex

              w-full

              items-center

              justify-center

              rounded-xl

              border

              border-[var(--services-cta-secondary-border)]

              bg-[var(--services-cta-secondary-bg)]

              px-8

              py-4

              font-semibold

              text-[var(--services-cta-secondary-text)]

              transition-all

              duration-300

              hover:border-[var(--primary)]

              hover:text-[var(--primary)]

              sm:w-auto
            "
          >
            {SERVICES_CTA.secondaryButton}
          </Link>
        </div>
      </div>
    </section>
  );
}