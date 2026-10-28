
"use client";

import PageBreadcrumb from "@/components/common/PageBreadcrumb";

import { SHOP_HERO } from "./Shop.constants";

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

        py-5

        transition-colors
        duration-300

        md:py-7
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
            mt-2

            text-center

            text-[18px]

            font-extrabold

            leading-tight

            text-[var(--services-hero-title)]

            transition-colors
            duration-300

            md:text-[25px]

            lg:text-[28px]
          "
        >
          {SHOP_HERO.title}
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

            lg:text-[13px]

            lg:leading-6
          "
        >
          {SHOP_HERO.description}
        </p>
      </div>
    </section>
  );
}
