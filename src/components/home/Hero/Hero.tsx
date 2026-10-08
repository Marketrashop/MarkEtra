import {
  Globe2,
  Headphones,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  Col,
  Container,
  Row,
} from "@/components/layout";

import HeroContent from "./HeroContent";
import HeroMedia from "./HeroMedia";
import HeroDecoration from "./HeroDecoration";

export default function Hero() {
  return (
    <section
      className="
        relative
        overflow-hidden

        pt-[48px]
        pb-0

        md:pt-[60px]
        md:pb-0

        lg:pt-[78px]
        lg:pb-0

        xl:pt-[92px]
        xl:pb-0
      "
      style={{
        backgroundColor:
          "var(--surface-hero)",
      }}
    >
      {/* Hero Background Image */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          bg-cover
          bg-center
          bg-no-repeat
          opacity-[0.10]
        "
        style={{
          backgroundImage:
            "var(--surface-hero-background-image)",
        }}
      />

      {/* Background Overlay */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[1]
          bg-[var(--hero-overlay)]
        "
      />

      {/* Glow */}
      <div
        className="
          absolute
          left-[15%]
          top-85
          h-[440px]
          w-[440px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          opacity-80
          blur-[30px]
        "
        style={{
          background:
            "var(--hero-glow)",
        }}
      />

      {/* Hero Content */}
      <Container className="relative z-10">
        <Row className="items-center">
          <Col lg={6}>
            <HeroContent />
          </Col>

          <Col lg={6}>
            <HeroMedia />
          </Col>
        </Row>
      </Container>

      {/* Hero Features */}
      <div
        className="
          relative
          isolate
          mt-10
          overflow-hidden
          pt-6
          pb-3

          md:pb-4

          lg:mt-16
          lg:pt-8
          lg:pb-5
        "
      >
        {/* Full-width Features Background */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            -z-20
            bg-cover
            bg-center
            bg-no-repeat
            opacity-[0.18]
          "
          style={{
            backgroundImage:
              "var(--hero-features-background-image)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, transparent 12%, black 38%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, transparent 12%, black 38%, black 100%)",
          }}
        />

        {/* Features Background Overlay */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            -z-10
            bg-[var(--hero-features-overlay)]
          "
        />

        {/* Bottom Blend */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            -z-10
            h-1/2
            bg-gradient-to-t
            from-[var(--hero-fade-bg)]
            via-transparent
            to-transparent
          "
        />

        {/* Features Content */}
        <Container className="relative z-10">
          <div
            className="
              grid
              grid-cols-4
            "
          >
            {[
              {
                icon: Truck,
                title: "Fast & Reliable",
                subtitle: "Delivery",
              },
              {
                icon: ShieldCheck,
                title: "Secure",
                subtitle: "Payments",
              },
              {
                icon: Headphones,
                title: "24/7",
                subtitle: "Support",
              },
              {
                icon: Globe2,
                title: "Global",
                subtitle: "Marketplace",
              },
            ].map(
              ({
                icon: Icon,
                title,
                subtitle,
              }, index) => (
                <div
                  key={title}
                  className={`
                    flex
                    flex-col
                    items-center
                    px-1
                    text-center

                    ${
                      index !== 3
                        ? "border-r border-white/10"
                        : ""
                    }

                    lg:px-2
                    lg:border-r-0
                  `}
                >
                  <Icon
                    className="
                      h-5
                      w-5
                      text-[color:var(--hero-badge-bg)]

                      md:h-6
                      md:w-6

                      lg:h-9
                      lg:w-9
                    "
                  />

                  <p
                    className="
                      mt-2
                      text-[11px]
                      font-semibold
                      leading-tight
                      tracking-tight
                      text-[var(--foreground)]

                      md:text-xs

                      lg:mt-3
                      lg:text-lg
                    "
                  >
                    {title}
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[9px]
                      leading-tight
                      text-[var(--foreground-muted)]

                      md:text-[10px]

                      lg:mt-1
                      lg:text-base
                    "
                  >
                    {subtitle}
                  </p>
                </div>
              ),
            )}
          </div>
        </Container>
      </div>

{/* Soft Bottom Blend */}
<div
  className="
    pointer-events-none
    absolute
    inset-x-0
    bottom-0
    z-[2]
    h-10

    sm:h-12

    md:h-14

    lg:h-16
  "
  style={{
    background:
      "linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--home-category-bg) 35%, transparent) 55%, var(--home-category-bg) 100%)",
  }}
/>

      <HeroDecoration />
    </section>
  );
}