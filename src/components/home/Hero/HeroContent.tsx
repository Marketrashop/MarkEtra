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
  const router =
    useRouter();

  const {
    startNavigation,
  } = useNavigationLoader();

  return (
    <div className="flex flex-col">
      {/* Badge */}
      <span
        className="
          mb-5
          inline-flex
          w-fit
          rounded-[7px]
          bg-[var(--hero-badge-bg)]
          px-5
          py-[5px]
          text-base
          font-bold
          text-[var(--hero-badge-text)]
          sm:text-[18px]
          lg:text-[19px]
        "
      >
        {heroData.badge}
      </span>

      {/* Heading */}
      <h1
        className="
          mb-5
          text-[28px]
          font-extrabold
          capitalize
          leading-[1.2]
          text-[var(--hero-heading)]

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
          mb-[35px]
          max-w-[640px]
          text-base
          leading-8
          text-[var(--hero-text)]

          lg:text-lg
        "
      >
        {heroData.description}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-5">
        <Link
          href={heroData.primaryButton.href}
          onClick={(event) => {
            event.preventDefault();

            startNavigation();

            router.push(
              heroData.primaryButton.href,
            );
          }}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-7
            text-[17px]
            font-bold
            transition-colors
            duration-300
            hover:opacity-90
          "
          style={{
            height: HERO_CTA_HEIGHT,
            borderRadius: HERO_CTA_RADIUS,
            backgroundColor: "var(--hero-cta-bg)",
            color: "var(--hero-cta-text)",
          }}
        >
          {heroData.primaryButton.label}

          <ArrowRight
            size={18}
            strokeWidth={2.2}
          />
        </Link>

        <HeroVideoButton />
      </div>
    </div>
  );
}