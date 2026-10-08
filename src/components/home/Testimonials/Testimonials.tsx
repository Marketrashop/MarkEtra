"use client";

import { Container } from "@/components/layout";

import TestimonialsSlider from "./TestimonialsSlider";
import {
  TESTIMONIALS_HEADING_MAX_WIDTH,
  TESTIMONIALS_MAX_WIDTH,
  TESTIMONIALS_SECTION_PADDING,
} from "./testimonials.constants";

export default function Testimonials() {
  return (
<section
  className={TESTIMONIALS_SECTION_PADDING}
  style={{
    background: "var(--testimonials-bg)",
  }}
>
      <Container className={TESTIMONIALS_MAX_WIDTH}>
        {/* Section Heading */}
        <div
          className={`
            ${TESTIMONIALS_HEADING_MAX_WIDTH}

            mx-auto
            mb-12

            text-center
          `}
        >
          <span
            className="
              text-[18px]
              font-extrabold

              text-[#5658EC]

              sm:text-[20px]
            "
          >
            Testimonials
          </span>

<h2
  className="
    mt-3

    text-[26px]
    font-extrabold
    leading-[1.15]

    text-[var(--foreground)]

    sm:text-[34px]
    lg:text-[38px]
  "
>
  Success Stories From Our Community
</h2>

          <p
            className="
              mx-auto
              mt-5
              max-w-[720px]

              text-[15px]
              leading-7

              text-[var(--foreground-muted)]

              sm:text-[16px]
            "
          >
              Explore how our community of sellers, affiliates, and creators are using
              MarkEtra to achieve meaningful business growth.
          </p>
        </div>

        <TestimonialsSlider />
      </Container>
    </section>
  );
}