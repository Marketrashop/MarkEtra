"use client";

import PageBreadcrumb from "@/components/common/PageBreadcrumb";

import { CONTACT_HERO } from "./contact.constants";

export default function ContactHero() {
  return (
    <section
      className="
        bg-[var(--services-hero-bg)]
        py-6
        transition-colors
        duration-300
        sm:py-8
        md:py-10
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
        <PageBreadcrumb
          items={[
            {
              label: "Contact",
            },
          ]}
        />

        <h1
          className="
            mt-2.5
            text-center
            text-[22px]
            font-extrabold
            leading-tight
            text-[var(--services-hero-title)]
            transition-colors
            duration-300
            sm:mt-3
            sm:text-[26px]
            md:text-[36px]
            lg:text-[40px]
          "
        >
          {CONTACT_HERO.title}
        </h1>

        <p
          className="
            mx-auto
            mt-2
            max-w-2xl
            text-[12px]
            leading-5
            text-[var(--services-hero-text)]
            transition-colors
            duration-300
            sm:mt-3
            sm:text-[14px]
            sm:leading-6
            lg:text-[15px]
            lg:leading-7
          "
        >
          {CONTACT_HERO.description}
        </p>
      </div>
    </section>
  );
}