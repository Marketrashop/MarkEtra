"use client";

import { ReactNode } from "react";

import Logo from "@/components/layout/Header/Logo";

import AuthHero from "./AuthHero";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <main
      className="
        relative

        min-h-screen

        overflow-hidden

        bg-[var(--services-hero-bg)]

        transition-colors
        duration-300
      "
    >
      {/* Background Glow */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          absolute

          inset-0

          overflow-hidden
        "
      >
        <div
          className="
            absolute

            left-[-32rem]

            top-1/2

            h-[72rem]

            w-[72rem]

            -translate-y-1/2

            rounded-full

            blur-[200px]

            opacity-90
          "
          style={{
            background:
              "radial-gradient(circle, rgba(92,122,255,0.22) 0%, rgba(92,122,255,0.12) 34%, rgba(92,122,255,0.05) 58%, transparent 82%)",
          }}
        />

        <div
          className="
            absolute

            bottom-[-14rem]

            left-[-10rem]

            h-[28rem]

            w-[28rem]

            rounded-full

            blur-[150px]

            opacity-20
          "
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 75%)",
          }}
        />
      </div>

      <div
        className="
          relative

          mx-auto

          grid

          min-h-screen

          max-w-[1440px]

          items-center

          gap-10

          px-4

          py-5

          sm:gap-14
          sm:px-5
          sm:py-8

          lg:px-8

          xl:grid-cols-[1.05fr_0.95fr]

          xl:gap-28
        "
      >
        {/* Hero */}

        <section
          className="
            hidden

            xl:flex

            xl:flex-col

            xl:justify-center
          "
        >
          <div className="mb-14">
            <Logo />
          </div>

          <AuthHero />
        </section>

        {/* Form */}

        <section
          className="
            flex

            w-full

            items-center

            justify-center

            xl:justify-end
          "
        >
          <div
            className="
              w-full

              max-w-[360px]

              sm:max-w-[420px]

              lg:max-w-[460px]
            "
          >
            {/* Mobile Logo */}

            <div
              className="
                mb-5

                flex

                justify-center

                sm:mb-8

                xl:hidden
              "
            >
              <Logo />
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}