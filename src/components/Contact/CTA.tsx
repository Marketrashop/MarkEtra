"use client";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { CONTACT_CTA } from "./contact.constants";

export default function CTA() {
  return (
    <section
      className="
        border-t
        border-[var(--border)]
        bg-[var(--background)]
        py-10
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
          px-4
          text-center
          sm:px-5
          lg:px-8
        "
      >
        <h2
          className="
            text-2xl
            font-bold
            leading-tight
            text-[var(--foreground)]
            sm:text-4xl
            lg:text-5xl
          "
        >
          {CONTACT_CTA.title}
        </h2>

        <p
          className="
            mx-auto
            mt-3
            max-w-2xl
            text-sm
            leading-6
            text-[var(--foreground-muted)]
            sm:mt-6
            sm:text-lg
            sm:leading-8
          "
        >
          {CONTACT_CTA.description}
        </p>

        <div
          className="
            mt-6
            flex
            justify-center
            sm:mt-10
          "
        >
          <Link
            href="#contact-form"
            style={{
              backgroundColor:
                "var(--services-cta-primary-bg)",
              color:
                "var(--services-cta-primary-text)",
            }}
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-lg
              px-5
              text-sm
              font-semibold
              transition-all
              duration-300
              hover:scale-[1.02]
              hover:opacity-90
              sm:h-auto
              sm:gap-3
              sm:rounded-xl
              sm:px-8
              sm:py-4
            "
          >
            {CONTACT_CTA.button}

            <ArrowRight
              className="
                h-4
                w-4
                sm:h-5
                sm:w-5
              "
            />
          </Link>
        </div>
      </div>
    </section>
  );
}