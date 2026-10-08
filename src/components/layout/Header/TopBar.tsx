"use client";

import { CircleHelp, ChevronDown, Mail, Phone } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

import { Container } from "@/components/layout";

import { useCartContext } from "@/context/CartContext";

const socialClass =
  "flex h-6 w-6 items-center justify-center rounded-md border border-white/20 text-[var(--icon-color)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#5b5ef7]/40 hover:bg-[#5b5ef7]/12 hover:text-[#b8baff]";

const languages = [
  { code: "en", label: "🇬🇧 English" },
  { code: "es", label: "🇪🇸 Español" },
  { code: "fr", label: "🇫🇷 Français" },
  { code: "de", label: "🇩🇪 Deutsch" },
  { code: "zh", label: "🇨🇳 中文" },
];

type TopBarProps = {
  environment?: "guest" | "user" | "admin";
};

export default function TopBar({
  environment = "guest",
}: TopBarProps) {
const { cartOpen } = useCartContext();
const router = useRouter();
const pathname = usePathname();
  return (
<div
  className={[
    "pb-6 pt-6 hidden h-[50px] bg-[var(--surface-topbar)] shadow-sm lg:block transition-all duration-300",
    cartOpen &&
      "pointer-events-none -translate-y-full opacity-0",
  ]
    .filter(Boolean)
    .join(" ")}
>
      <Container className="flex h-full items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="#" aria-label="Facebook" className={socialClass}>
            <FaFacebookF size={12} />
          </a>

          <a href="#" aria-label="Twitter" className={socialClass}>
            <FaXTwitter size={12} />
          </a>

          <a href="#" aria-label="Instagram" className={socialClass}>
            <FaInstagram size={12} />
          </a>

          <a href="#" aria-label="LinkedIn" className={socialClass}>
            <FaLinkedinIn size={12} />
          </a>
        </div>

        <div className="flex items-center gap-5 text-[13px] text-[var(--foreground)]">
{/*
<div className="relative">
  <select
    defaultValue="en"
    className="cursor-pointer appearance-none bg-transparent pr-5 text-[13px] font-medium text-[var(--foreground)] outline-none transition-colors duration-200 hover:text-[var(--primary)]"
  >
    {languages.map((language) => (
      <option
        key={language.code}
        value={language.code}
      >
        {language.label}
      </option>
    ))}
  </select>

  <ChevronDown
    size={13}
    strokeWidth={2.2}
    className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[var(--foreground)]"
  />
</div>
*/}

<button
  type="button"
  onClick={() => {
    const href =
      environment === "guest"
        ? "/Contact"
        : "/help-center";

    if (pathname === href) {
      return;
    }

    router.push(href);
  }}
  className="
    flex
    items-center
    gap-2
    transition-colors
    duration-200
    hover:text-[var(--primary)]
  "
>
  <CircleHelp size={14} />
  <span>Need Help?</span>
</button>

<a
  href="tel:+2348000000000"
  className="
    flex
    items-center
    gap-2
    transition-colors
    duration-200
    hover:text-[var(--primary)]
  "
>
  <Phone size={14} />
  <span>+1 (000) 000 0000</span>
</a>

<a
  href="mailto:contact@marketra.shop"
  className="
    flex
    items-center
    gap-2
    transition-colors
    duration-200
    hover:text-[var(--primary)]
  "
>
  <Mail size={14} />
  <span>contact@marketra.shop</span>
</a>
        </div>
      </Container>
    </div>
  );
}