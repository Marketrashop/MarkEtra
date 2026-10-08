"use client";

import PageBreadcrumb from "@/components/common/PageBreadcrumb";

import { SHOP_HERO } from "./shop.constants";

type ShopHeroProps = {
  environment?: "public" | "user";
};

export default function ShopHero({
  environment = "public",
}: ShopHeroProps) {
  return (
    <section
      className="
        bg-[var(--services-hero-bg)]

        py-8

        transition-colors
        duration-300

        md:py-10
      "
    >
      <div
        className={
          environment === "user"
            ? `
                w-full

                px-5

                text-center

                lg:px-8
              `
            : `
                mx-auto

                w-full

                max-w-4xl

                px-5

                text-center

                lg:px-8
              `
        }
      >
        <PageBreadcrumb
          homeHref={
            environment === "user"
              ? "/Dashboard"
              : "/"
          }
          items={[
            {
              label: "Shop",
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
          {SHOP_HERO.title}
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
          {SHOP_HERO.description}
        </p>
      </div>
    </section>
  );
}