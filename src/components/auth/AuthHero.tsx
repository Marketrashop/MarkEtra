"use client";

import {
  BadgeCheck,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function AuthHero() {
  const highlights = [
    {
      icon: TrendingUp,
      title: "Grow Your Income",
      description:
        "Promote products people already love and earn commissions with confidence.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Platform",
      description:
        "Your account and personal information are protected with modern security standards.",
    },
    {
      icon: BadgeCheck,
      title: "Trusted Marketplace",
      description:
        "Access carefully selected products from verified merchants and trusted brands.",
    },
  ];

  return (
    <aside
      className="
        relative

        hidden

        w-full

        max-w-[560px]

        xl:flex

        xl:flex-col

        xl:justify-center
      "
    >
      <div
        className="
          relative

          z-10
        "
      >
        <h2
          className="
            max-w-[520px]

            text-[48px]

            font-extrabold

            leading-[1.05]

            tracking-[-0.04em]

            text-[var(--foreground)]

            transition-colors
            duration-300
          "
        >
          Build an online business people trust.
        </h2>

        <p
          className="
            mt-6

            max-w-[500px]

            text-[17px]

            leading-8

            text-[var(--foreground-muted)]

            transition-colors
            duration-300
          "
        >
          Discover winning products, grow your affiliate business, and manage
          everything from one beautifully designed platform.
        </p>
      </div>

      <div
        className="
          relative

          z-10

          mt-14

          space-y-8
        "
      >
        {highlights.map(
          ({
            icon: Icon,
            title,
            description,
          }) => (
            <div
              key={title}
              className="
                flex

                items-start

                gap-4
              "
            >
              <div
                className="
                  flex

                  h-12

                  w-12

                  shrink-0

                  items-center

                  justify-center

                  rounded-2xl

                  bg-[var(--surface)]

                  text-[var(--primary)]

                  transition-colors
                  duration-300
                "
              >
                <Icon
                  size={20}
                />
              </div>

              <div>
                <h3
                  className="
                    text-[16px]

                    font-semibold

                    text-[var(--foreground)]

                    transition-colors
                    duration-300
                  "
                >
                  {title}
                </h3>

                <p
                  className="
                    mt-1.5

                    max-w-[430px]

                    text-[14px]

                    leading-7

                    text-[var(--foreground-muted)]

                    transition-colors
                    duration-300
                  "
                >
                  {description}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </aside>
  );
}