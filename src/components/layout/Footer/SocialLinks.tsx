"use client";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

const socials = [
  {
    label: "LinkedIn",
    icon: FaLinkedinIn,
  },
  {
    label: "X",
    icon: FaXTwitter,
  },
  {
    label: "Instagram",
    icon: FaInstagram,
  },
  {
    label: "Facebook",
    icon: FaFacebookF,
  },
];

export default function SocialLinks() {
  return (
    <div className="flex items-center gap-2.5">
      {socials.map(({ label, icon: Icon }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-md
            border
            border-[var(--foreground)]
            text-[var(--icon-color)]
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:border-[var(--foreground)]
            hover:bg-[var(--foreground)]
            hover:text-[var(--background)]
          "
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}