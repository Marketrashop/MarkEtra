
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { useNavigationLoader } from "@/components/ui/Preloader";

import {
  HERO_CTA_HEIGHT,
  HERO_CTA_RADIUS,
} from "./hero.constants";
import { heroData } from "./hero.data";
import HeroVideoButton from "./HeroVideoButton";

export default function HeroContent() {
  const router = useRouter();

  const { startNavigation } = useNavigationLoader();

  return (
    <div className="flex flex-col">
      {/* Badge */}
      <span
        className="
          mb-3
          inline-flex
          w-fit
          rounded-[7px]
          bg-[var(--hero-badge-bg)]
          px-3.5
          py-1
          text-sm
          font-bold
          text-[var(--hero-badge-text)]

          sm:mb-5
          sm:px-5
          sm:py-[5px]
          sm:text-[18px]

          lg:text-[19px]
        "
      >
        {heroData.badge}
      </span>

      {/* Heading */}
      <h1
        className="
          mb-3
          text-[25px]
          font-extrabold
          capitalize
          leading-[1.15]
          text-[var(--hero-heading)]

          sm:mb-5
          sm:text-[39px]

          md:text-[50px]

          xl:text-[52px]

          2xl:text-[60px]
        "
      >
        {heroData.title}
      </h1>

      {/* Description */}
      <p
        className="
          mb-5
          max-w-[640px]
          text-[14px]
          leading-[1.65]
          text-[var(--hero-text)]

          sm:mb-[35px]
          sm:text-base
          sm:leading-8

          lg:text-lg
        "
      >
        {heroData.description}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-5 sm:gap-5">
        <Link
          href={heroData.primaryButton.href}
          onClick={(event) => {
            event.preventDefault();

            startNavigation();

            router.push(heroData.primaryButton.href);
          }}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-5
            text-sm
            font-bold
            transition-colors
            duration-300
            hover:opacity-90

            sm:px-7
            sm:text-[17px]
          "
          style={{
            height: HERO_CTA_HEIGHT,
            borderRadius: HERO_CTA_RADIUS,
            backgroundColor: "var(--hero-cta-bg)",
            color: "var(--hero-cta-text)",
          }}
        >
          {heroData.primaryButton.label}

          <ArrowRight size={18} strokeWidth={2.2} />
        </Link>

        <HeroVideoButton />
      </div>
    </div>
  );
}
