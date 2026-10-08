"use client";

import Image from "next/image";

type NewsletterImageProps = {
  alt?: string;
};

export default function NewsletterImage({
  alt = "Newsletter",
}: NewsletterImageProps) {
  return (
    <div
      className="
        relative
        h-full
        min-h-[560px]
        w-full
      "
    >
      <Image
        src="/assets/images/newsteller-popup-thumb.png"
        alt={alt}
        fill
        priority
        className="object-cover"
        sizes="40vw"
      />
    </div>
  );
}