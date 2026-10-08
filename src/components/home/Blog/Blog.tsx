"use client";

import { Container } from "@/components/layout";

import BlogGrid from "./BlogGrid";
import {
  BLOG_HEADING_MAX_WIDTH,
  BLOG_MAX_WIDTH,
  BLOG_SECTION_PADDING,
} from "./blog.constants";

export default function Blog() {
  return (
<section
  className={BLOG_SECTION_PADDING}
  style={{
    background: "var(--blog-section-bg)",
  }}
>
      <Container className={BLOG_MAX_WIDTH}>
        {/* Section Heading */}

        <div
          className={`
            ${BLOG_HEADING_MAX_WIDTH}

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
            Blog
          </span>

<h2
  className="
    mt-3

    text-[28px]
    font-extrabold
    leading-[1.15]

    text-[var(--foreground)]

    sm:text-[36px]
    lg:text-[40px]
  "
>
  Latest Insights
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
            Stay informed with expert articles, practical selling tips,
            affiliate marketing strategies, and the latest updates from
            the MarkEtra ecosystem.
          </p>
        </div>

        {/* Blog Grid */}

        <BlogGrid />
      </Container>
    </section>
  );
}