"use client";

import Link from "next/link";

import {
  TABLE_OF_CONTENTS,
  PRIVACY_SECTIONS,
} from "./privacy.constants";

export default function PrivacyPolicyContent() {
  return (
    <section
      className="
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

          max-w-5xl

          px-5

          lg:px-8
        "
      >
        {/* Table of Contents */}

        <div
          className="
            rounded-3xl

            border

            border-[var(--border)]

            bg-[var(--surface)]

            p-6

            transition-colors
            duration-300

            sm:p-8
          "
        >
          <h2
            className="
              text-2xl

              font-bold

              text-[var(--foreground)]
            "
          >
            Table of Contents
          </h2>

          <nav
            className="
              mt-6

              grid

              gap-4

              sm:grid-cols-2
            "
          >
            {TABLE_OF_CONTENTS.map(
              (item, index) => (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  className="
                    flex

                    items-center

                    gap-3

                    rounded-xl

                    px-4
                    py-3

                    text-[var(--foreground)]

                    transition-all
                    duration-300

                    hover:bg-[var(--muted)]

                    hover:text-[var(--primary)]
                  "
                >
                  <span
                    className="
                      flex

                      h-8
                      w-8

                      items-center
                      justify-center

                      rounded-full

                      bg-[var(--primary)]

                      text-sm

                      font-semibold

                      text-[var(--button-text)]
                    "
                  >
                    {index + 1}
                  </span>

                  <span
                    className="
                      font-medium
                    "
                  >
                    {item.title}
                  </span>
                </Link>
              )
            )}
          </nav>
        </div>

        {/* Privacy Policy */}

        <div
          className="
            mt-16

            space-y-14
          "
        >
          {PRIVACY_SECTIONS.map(
            (section) => (
              <section
                key={section.id}
                id={section.id}
                className="
                  scroll-mt-32
                "
              >
                <h2
                  className="
                    text-2xl

                    font-bold

                    text-[var(--foreground)]

                    sm:text-3xl
                  "
                >
                  {section.title}
                </h2>

                <div
                  className="
                    mt-6

                    space-y-5
                  "
                >
                  {section.content.map(
                    (paragraph) => (
                      <p
                        key={paragraph}
                        className="
                          text-base

                          leading-8

                          text-[var(--foreground-muted)]

                          sm:text-lg
                        "
                      >
                        {paragraph}
                      </p>
                    )
                  )}
                </div>

                <div
                  className="
                    mt-10

                    border-b

                    border-[var(--border)]
                  "
                />
              </section>
            )
          )}
        </div>
      </div>
    </section>
  );
}