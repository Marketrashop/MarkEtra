"use client";

import { useState } from "react";

import {
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
} from "react-icons/fa6";

import {
  Link2,
  Check,
} from "lucide-react";

import { toast } from "sonner";

type ProductShareProps = {
  productUrl: string;
};

export default function ProductShare({
  productUrl,
}: ProductShareProps) {
  const [copied, setCopied] =
    useState(false);

async function copyLink() {
  try {
    await navigator.clipboard.writeText(
      productUrl,
    );

    setCopied(true);

    toast.success(
      "Product link copied.",
    );

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  } catch {
    toast.error(
      "Failed to copy link.",
    );
  }
}

  const shareLinks = [
    {
      label: "Facebook",
      icon: FaFacebookF,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        productUrl,
      )}`,
    },
    {
      label: "Twitter",
      icon: FaXTwitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        productUrl,
      )}`,
    },
    {
      label: "LinkedIn",
      icon: FaLinkedinIn,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        productUrl,
      )}`,
    },
  ];

  return (
    <div
      className="
        mt-4
        flex
        flex-wrap
        items-center
        gap-1.5
        lg:mt-5
        lg:gap-2
      "
    >
      <span
        className="
          mr-1
          text-[12px]
          font-semibold
          text-[var(--foreground)]
          lg:text-[13px]
        "
      >
        Share:
      </span>

      {shareLinks.map(
        ({
          href,
          icon: Icon,
          label,
        }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-md
              border
              border-[var(--border)]
              bg-[var(--surface)]
              text-[var(--foreground-muted)]
              transition-all
              duration-300
              hover:border-[var(--primary)]
              hover:bg-[var(--primary)]/10
              hover:text-[var(--primary)]
              lg:h-9
              lg:w-9
            "
          >
            <Icon
              size={14}
            />
          </a>
        ),
      )}

      <button
        type="button"
        onClick={copyLink}
        className="
          flex
          h-8
          items-center
          gap-1
          rounded-md
          border
          border-[var(--border)]
          bg-[var(--surface)]
          px-3
          text-[12px]
          font-medium
          text-[var(--foreground)]
          transition-all
          duration-300
          hover:border-[var(--primary)]
          hover:bg-[var(--primary)]/10
          hover:text-[var(--primary)]
          lg:h-9
          lg:gap-1.5
          lg:px-3.5
          lg:text-[13px]
        "
      >
        {copied ? (
          <>
            <Check
              size={13}
              strokeWidth={2.3}
            />
            Copied
          </>
        ) : (
          <>
            <Link2
              size={13}
              strokeWidth={2.3}
            />
            Copy Link
          </>
        )}
      </button>
    </div>
  );
}