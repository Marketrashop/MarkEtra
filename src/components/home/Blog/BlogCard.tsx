"use client";

import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  ArrowRight,
  CalendarDays,
  User,
} from "lucide-react";

import { useNavigationLoader } from "@/components/ui/Preloader";

import {
  BLOG_ARROW_SIZE,
  BLOG_CARD_CONTENT_PADDING,
  BLOG_CARD_HOVER_BORDER,
  BLOG_CARD_RADIUS,
  BLOG_ICON_SIZE,
  BLOG_IMAGE_ASPECT_RATIO,
} from "./blog.constants";
import { BlogPost } from "./blog.types";

type BlogCardProps = {
  post: BlogPost;
};

export default function BlogCard({
  post,
}: BlogCardProps) {
  const router =
    useRouter();

  const {
    startNavigation,
  } = useNavigationLoader();

  const href = `/Blog/${post.slug}`;

  return (
    <Link
      href={href}
      onClick={(event) => {
        event.preventDefault();

        startNavigation();

        router.push(href);
      }}
      className="
        group
        block
        h-full

        overflow-hidden

        border

        transition-all
        duration-300

        hover:-translate-y-2

        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#5658EC]/20
      "
      style={{
        borderRadius: BLOG_CARD_RADIUS,
        border: `1px solid ${BLOG_CARD_HOVER_BORDER}`,
        background:
          "rgb(255 255 255 / 0.06)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow:
          "0 18px 40px rgba(0,0,0,0.12)",
      }}
    >
      {/* Image */}
      <div
        className={`
          relative
          overflow-hidden

          ${BLOG_IMAGE_ASPECT_RATIO}
        `}
      >
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="
            object-cover

            scale-110

            transition-transform
            duration-700

            group-hover:scale-[1.15]
          "
        />
      </div>

      {/* Content */}
      <div className={BLOG_CARD_CONTENT_PADDING}>
        {/* Meta */}
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-x-5
            gap-y-2

            text-sm

            text-[var(--foreground-muted)]
            opacity-80
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <User
              size={BLOG_ICON_SIZE}
              className="text-[#5658EC]"
            />

            <span>{post.author}</span>
          </div>

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <CalendarDays
              size={BLOG_ICON_SIZE}
              className="text-[#5658EC]"
            />

            <span>{post.publishedAt}</span>
          </div>
        </div>

        {/* Divider */}
        <div
          className="
            my-5
            h-px

            bg-white/10
          "
        />

        {/* Title */}
        <h3
          className="
            text-[17px]
            font-bold
            leading-[1.45]

            text-[var(--foreground)]

            transition-colors
            duration-300

            group-hover:text-[#5658EC]

            lg:text-[19px]
          "
        >
          {post.title}
        </h3>

        {/* Read More */}
        <div
          className="
            mt-6

            inline-flex
            items-center
            gap-2

            text-[15px]
            font-medium

            text-[var(--foreground-muted)]

            transition-colors
            duration-300

            group-hover:text-[#5658EC]
          "
        >
          <span>Read More</span>

          <ArrowRight
            size={BLOG_ARROW_SIZE}
            className="
              transition-transform
              duration-300

              group-hover:translate-x-1
            "
          />
        </div>
      </div>
    </Link>
  );
}