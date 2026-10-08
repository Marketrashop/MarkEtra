"use client";

import { Container } from "@/components/layout";

import FAQAccordion from "./FAQAccordion";
import {
  FAQ_GRID,
  FAQ_HEADING_MAX_WIDTH,
  FAQ_MAX_WIDTH,
  FAQ_SECTION_PADDING,
} from "./faq.constants";
import { faqItems } from "./faq.data";

export default function FAQ() {
  const leftColumn = faqItems.slice(0, 4);
  const rightColumn = faqItems.slice(4);

  return (
<section
  className={`
    ${FAQ_SECTION_PADDING}

    bg-[var(--faq-bg)]
  `}
>
      <Container className={FAQ_MAX_WIDTH}>
        {/* Section Heading */}
        <div
          className={`
            ${FAQ_HEADING_MAX_WIDTH}

            mx-auto
            mb-12

            text-center
          `}
        >
<span
  className="
    text-[19px]
    font-extrabold

    text-[#5658EC]

    sm:text-[21px]
  "
>
  FAQ
</span>

<h2
  className="
    mt-3

    text-[26px]
    font-black
    leading-[1.15]

    text-[var(--foreground)]

    sm:text-[36px]
    lg:text-[40px]
  "
>
  Frequently Asked Questions
</h2>

<p
  className="
    mx-auto
    mt-5
    max-w-[720px]

    text-[16px]
    leading-7

    text-[var(--foreground-muted)]

    sm:text-[17px]
  "
>
  Get instant answers to common e commerce questions and find
  helpful information about ordering, payments, shipping, and
  more in our comprehensive FAQ section.
</p>
        </div>

        {/* Accordion Grid */}
        <div className={FAQ_GRID}>
          <FAQAccordion items={leftColumn} />

          <FAQAccordion items={rightColumn} />
        </div>
      </Container>
    </section>
  );
}