"use client";

import BlogCard from "../BlogCard";
import { blogPosts } from "../blog.data";

import {
  BLOG_RELATED_HEADING_MAX_WIDTH,
  BLOG_RELATED_SPACING,
} from "./blog.constants";
import { RelatedArticlesProps } from "./blog.types";

export default function RelatedArticles({
  currentSlug,
}: RelatedArticlesProps) {
const relatedPosts = blogPosts.filter(
  (post) => post.slug !== currentSlug
);

  return (
    <section
      className={BLOG_RELATED_SPACING}
    >
      {/* Heading */}

      <div
        className={`
          ${BLOG_RELATED_HEADING_MAX_WIDTH}

          mx-auto
          mb-12

          text-center
        `}
      >
        <span
          className="
            text-[16px]
            font-bold

            uppercase
            tracking-[0.14em]

            text-[#5B5EF7]
          "
        >
          More Insights
        </span>

        <h2
          className="
            mt-4

            text-[30px]
            font-extrabold
            leading-[1.15]

            text-[var(--foreground)]

            sm:text-[38px]
          "
        >
          Explore More Articles
        </h2>

        <p
          className="
            mx-auto
            mt-5
            max-w-[620px]

            text-[16px]
            leading-7

            text-[var(--foreground-muted)]
          "
        >
          Explore practical guides, expert tips, and actionable
          strategies to help you grow your online business with
          confidence.
        </p>
      </div>

      {/* Grid */}

      <div
        className="
          grid
          gap-6

          md:grid-cols-2

          xl:grid-cols-3
        "
      >
        {relatedPosts.map((post) => (
          <BlogCard
            key={post.slug}
            post={post}
          />
        ))}
      </div>
    </section>
  );
}