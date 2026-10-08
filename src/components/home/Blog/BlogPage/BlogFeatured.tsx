"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  BLOG_PAGE_FEATURED_RADIUS,
} from "./blog-page.constants";
import { BlogFeaturedProps } from "./blog-page.types";

export default function BlogFeatured({
  post,
}: BlogFeaturedProps) {
  return (
    <section>
      <Link
        href={`/Blog/${post.slug}`}
        className="
          group
          grid
          overflow-hidden

          border
          border-[var(--border)]

          bg-[var(--testimonial-card-bg)]

          shadow-lg
          transition-all
          duration-300

          hover:-translate-y-1
          hover:shadow-xl

          lg:grid-cols-2
        "
        style={{
          borderRadius:
            BLOG_PAGE_FEATURED_RADIUS,
        }}
      >
        {/* Image */}

        <div
          className="
            relative
            aspect-[16/10]
            overflow-hidden

            lg:aspect-auto
            lg:min-h-[480px]
          "
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="
              object-cover
              transition-transform
              duration-500

              group-hover:scale-105
            "
          />
        </div>

        {/* Content */}

        <div
          className="
            flex
            flex-col
            justify-center

            p-8

            sm:p-10

            lg:p-14
          "
        >
          <span
            className="
              text-[13px]
              font-bold

              uppercase
              tracking-[0.14em]

              text-[#5B5EF7]
            "
          >
            Featured Article
          </span>

          <h2
            className="
              mt-5

              text-[32px]
              font-extrabold
              leading-[1.15]

              text-[var(--foreground)]

              lg:text-[42px]
            "
          >
            {post.title}
          </h2>

          <p
            className="
              mt-6

              text-[17px]
              leading-8

              text-[var(--foreground-muted)]
            "
          >
            {post.excerpt}
          </p>

          <div
            className="
              mt-8

              flex
              items-center
              gap-4

              text-[14px]

              text-[var(--foreground-muted)]
            "
          >
            <span>{post.author}</span>

            <span>•</span>

            <span>{post.publishedAt}</span>
          </div>

          <div
            className="
              mt-10

              inline-flex
              items-center
              gap-3

              font-semibold

              text-[#5B5EF7]
            "
          >
            Read Article

            <ArrowRight
              size={18}
              className="
                transition-transform
                duration-300

                group-hover:translate-x-1
              "
            />
          </div>
        </div>
      </Link>
    </section>
  );
}