"use client";

import BlogCard from "../BlogCard";

import { BlogGridProps } from "./blog-page.types";

export default function BlogGrid({
  posts,
}: BlogGridProps) {
  return (
    <section>
      {/* Heading */}

      <div
        className="
          flex
          flex-col
          gap-4

          md:flex-row
          md:items-end
          md:justify-between
        "
      >
        <div>
          <span
            className="
              text-[13px]
              font-bold

              uppercase
              tracking-[0.14em]

              text-[#5B5EF7]
            "
          >
            Latest Insights
          </span>

          <h2
            className="
              mt-4

              text-[34px]
              font-extrabold
              leading-tight

              text-[var(--foreground)]
            "
          >
            Explore More Articles
          </h2>
        </div>

        <p
          className="
            max-w-[420px]

            text-[16px]
            leading-7

            text-[var(--foreground-muted)]
          "
        >
          Browse practical guides, proven
          marketing strategies, and expert
          insights to help grow your online
          business.
        </p>
      </div>

      {/* Articles */}

      <div
        className="
          mt-12

          grid
          gap-8

          md:grid-cols-2

          xl:grid-cols-3
        "
      >
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            post={post}
          />
        ))}
      </div>
    </section>
  );
}