"use client";

import PageBreadcrumb from "@/components/common/PageBreadcrumb";

import { SERVICES_HERO } from "./services.constants";

export default function ServicesHero() {
  return (
    <section
      className="
        relative

        overflow-hidden

        bg-[var(--services-hero-bg)]

        py-8

        transition-colors
        duration-300

        md:py-10
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
        <PageBreadcrumb
          items={[
            {
              label: "Services",
            },
          ]}
        />

        <h1
          className="
            mt-3

            text-center

            text-[26px]

            font-extrabold

            leading-tight

            text-[var(--services-hero-title)]

            transition-colors
            duration-300

            md:text-[36px]

            lg:text-[40px]
          "
        >
          {SERVICES_HERO.title}
        </h1>

        <p
          className="
            mx-auto

            mt-3

            max-w-2xl

            text-[14px]

            leading-6

            text-[var(--services-hero-text)]

            transition-colors
            duration-300

            lg:text-[15px]

            lg:leading-7
          "
        >
          {SERVICES_HERO.description}
        </p>
      </div>
    </section>
  );
}