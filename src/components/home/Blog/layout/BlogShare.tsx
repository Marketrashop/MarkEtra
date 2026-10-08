"use client";

import Link from "next/link";
import { appToast } from "@/lib/toast";
import {
  FaFacebookF,
  FaLink,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

import {
  BLOG_SHARE_BUTTON_SIZE,
  BLOG_SHARE_ICON_SIZE,
  BLOG_SHARE_SPACING,
} from "./blog.constants";
import { BlogShareProps } from "./blog.types";

export default function BlogShare({
  title,
  url,
}: BlogShareProps) {
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${url}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);

      appToast.success("Link copied to clipboard.");
    } catch {
      appToast.error("Failed to copy link.");
    }
  };

  return (
    <section
      className={`
        ${BLOG_SHARE_SPACING}

        mt-16

        border-t
        border-[var(--border)]

        pt-8
      `}
    >
      <div
        className="
          flex
          flex-col
          items-center
          gap-5

          sm:flex-row
          sm:justify-between
        "
      >
        <div>
          <h3
            className="
              text-[18px]
              font-bold

              text-[var(--foreground)]
            "
          >
            Share this article
          </h3>

          <p
            className="
              mt-1

              text-[14px]

              text-[var(--foreground-muted)]
            "
          >
            Help others discover this guide.
          </p>
        </div>

        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <ShareButton
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl
            )}`}
            label="Share on Facebook"
          >
            <FaFacebookF
              size={BLOG_SHARE_ICON_SIZE}
            />
          </ShareButton>

          <ShareButton
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              title
            )}&url=${encodeURIComponent(
              shareUrl
            )}`}
            label="Share on X"
          >
            <FaXTwitter
              size={BLOG_SHARE_ICON_SIZE}
            />
          </ShareButton>

          <ShareButton
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              shareUrl
            )}`}
            label="Share on LinkedIn"
          >
            <FaLinkedinIn
              size={BLOG_SHARE_ICON_SIZE}
            />
          </ShareButton>

          <button
            type="button"
            onClick={copyLink}
            aria-label="Copy article link"
            className="
              flex
              items-center
              justify-center

              rounded-full

              border
              border-[var(--border)]

              bg-[var(--testimonial-card-bg)]

              text-[var(--foreground)]

              transition-all
              duration-300

              hover:-translate-y-0.5
              hover:border-[#5B5EF7]
              hover:bg-[#5B5EF7]/8
              hover:text-[#5B5EF7]

              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#5B5EF7]/20
            "
            style={{
              width: BLOG_SHARE_BUTTON_SIZE,
              height: BLOG_SHARE_BUTTON_SIZE,
            }}
          >
            <FaLink
              size={BLOG_SHARE_ICON_SIZE}
            />
          </button>
        </div>
      </div>
    </section>
  );
}

type ShareButtonProps = {
  href: string;
  label: string;
  children: React.ReactNode;
};

function ShareButton({
  href,
  label,
  children,
}: ShareButtonProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="
        flex
        items-center
        justify-center

        rounded-full

        border
        border-[var(--border)]

        bg-[var(--testimonial-card-bg)]

        text-[var(--foreground)]

        transition-all
        duration-300

        hover:-translate-y-0.5
        hover:border-[#5B5EF7]
        hover:bg-[#5B5EF7]/8
        hover:text-[#5B5EF7]

        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#5B5EF7]/20
      "
      style={{
        width: BLOG_SHARE_BUTTON_SIZE,
        height: BLOG_SHARE_BUTTON_SIZE,
      }}
    >
      {children}
    </Link>
  );
}