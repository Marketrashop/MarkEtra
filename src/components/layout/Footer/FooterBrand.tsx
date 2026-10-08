import Logo from "../Header/Logo";
import SocialLinks from "./SocialLinks";

export default function FooterBrand() {
  return (
    <div className="max-w-[340px] self-start">
      <Logo size="sm" />

      <p className="mt-5 text-[15px] leading-7 text-[var(--foreground-muted)]">
        Let's make something great together. We are trusted by
        over 5000+ clients. Join them by using our services and
        grow your business.
      </p>

      <div className="mt-6">
        <SocialLinks />
      </div>
    </div>
  );
}