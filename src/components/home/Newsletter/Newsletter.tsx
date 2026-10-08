"use client";

import { Container } from "@/components/layout";

import NewsletterForm from "./NewsletterForm";
import {
  NEWSLETTER_BACKGROUND,
  NEWSLETTER_GRID,
  NEWSLETTER_OVERLAY,
  NEWSLETTER_SECTION_PADDING,
} from "./newsletter.constants";

export default function Newsletter() {
  return (
    <section
      className={`relative overflow-hidden ${NEWSLETTER_SECTION_PADDING}`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${NEWSLETTER_BACKGROUND})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          filter: "brightness(0.58) saturate(1.08)",
        }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: NEWSLETTER_OVERLAY,
        }}
      />

      <Container className="relative z-10">
        <div
          className={`
            ${NEWSLETTER_GRID}
            gap-12
            lg:gap-16
            items-center
          `}
        >
          {/* Left */}
          <div className="max-w-[620px] text-center lg:text-left">
            <span
              className="
                text-[18px]
                font-extrabold
                text-[#5658EC]
                sm:text-[20px]
              "
            >
              News Letter
            </span>

            <h2
              className="
                mt-3
                text-[28px]
                font-extrabold
                leading-[1.15]
                text-white
                sm:text-[34px]
                lg:text-[40px]
              "
            >
              Subscribe Our Newsletter
            </h2>

            <p
              className="
                mt-4
                text-[16px]
                leading-[1.8]
                text-white/75
                sm:text-[17px]
                lg:leading-[1.9]
              "
            >
              Subscribe to our newsletter and stay updated! Get the latest
              news, updates, and exclusive offers delivered straight to your
              inbox. Join our community of informed subscribers and never miss
              out on exciting content, helpful tips, and valuable insights.
              Don't wait any longer, subscribe now and be part of our growing
              network of knowledge and inspiration!
            </p>
          </div>

          {/* Right */}
          <div className="w-full max-w-[520px] mx-auto lg:mx-0">
            <NewsletterForm />
          </div>
        </div>
      </Container>
    </section>
  );
}