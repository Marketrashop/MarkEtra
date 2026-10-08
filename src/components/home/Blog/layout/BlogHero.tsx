"use client";

import PageBreadcrumb from "@/components/common/PageBreadcrumb";

import {
  CalendarDays,
  Clock3,
  User2,
} from "lucide-react";

import { BLOG_HERO_MAX_WIDTH } from "./blog.constants";
import { BlogHeroProps } from "./blog.types";

export default function BlogHero({
  category,
  title,
  author,
  publishedAt,
  readingTime,
}: BlogHeroProps) {
  return (
    <header
      className={`
        ${BLOG_HERO_MAX_WIDTH}

        mx-auto

        text-center
      `}
    >
<PageBreadcrumb
  items={[
    {
      label: "Blog",
    },
  ]}
/>

      {/* Title */}

      <h1
        className="
          mx-auto

          mt-3

          max-w-[900px]

          text-[26px]

          font-extrabold

          leading-tight

          text-[var(--foreground)]

          md:text-[36px]

          lg:text-[40px]
        "
      >
        {title}
      </h1>

      {/* Category */}

{category && (
  <p
    className="
      mt-3

      text-[14px]

      font-semibold

      text-[var(--primary)]
    "
  >
    {category}
  </p>
)}

      {/* Meta */}

      <div
        className="
          mt-4

          flex

          flex-wrap

          items-center

          justify-center

          gap-x-4

          gap-y-2

          text-[13px]

          font-medium

          text-[var(--foreground-muted)]

          lg:text-[14px]
        "
      >
        <div
          className="
            flex

            items-center

            gap-1.5
          "
        >
          <User2
            size={15}
            className="
              text-[var(--primary)]
            "
          />

          <span>{author}</span>
        </div>

        <span
          className="
            text-[var(--border)]
          "
        >
          •
        </span>

        <div
          className="
            flex

            items-center

            gap-1.5
          "
        >
          <CalendarDays
            size={15}
            className="
              text-[var(--primary)]
            "
          />

          <span>{publishedAt}</span>
        </div>

        <span
          className="
            text-[var(--border)]
          "
        >
          •
        </span>

        <div
          className="
            flex

            items-center

            gap-1.5
          "
        >
          <Clock3
            size={15}
            className="
              text-[var(--primary)]
            "
          />

          <span>{readingTime}</span>
        </div>
      </div>
    </header>
  );
}