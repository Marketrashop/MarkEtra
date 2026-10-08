"use client";

import NewsletterImage from "./NewsletterImage";

export default function NewsletterArtwork() {
  return (
    <div
      className="
        relative
        hidden
        w-[42%]
        overflow-hidden
        lg:block
      "
    >
      <NewsletterImage />

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-tr
          from-[var(--newsletter-image-overlay)]
          via-transparent
          to-transparent
        "
      />
    </div>
  );
}