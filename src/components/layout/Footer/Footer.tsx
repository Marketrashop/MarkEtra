import { Container } from "@/components/layout";

import FooterBottom from "./FooterBottom";
import FooterBrand from "./FooterBrand";
import FooterLinks from "./FooterLinks";
import FooterNewsletter from "./FooterNewsletter";

const companyLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Blog",
    href: "/Blog",
  },
  {
    label: "Terms of Service",
    href: "/Terms",
  },
  {
    label: "Privacy Policy",
    href: "/Privacy",
  },
  {
    label: "Refund Policy",
    href: "/Refund",
  },
];

const importantLinks = [
  {
    label: "Shop",
    href: "/Shop",
  },
  {
    label: "Plans",
    href: "/Plans",
  },
  {
    label: "Contact",
    href: "/Contact",
  },
];

export default function Footer() {
  return (
    <footer>
      {/* Main Footer */}
      <div className="bg-[var(--surface-footer)]">
        <Container className="pt-15 pb-17 lg:pt-17 lg:pb-30">
          <div className="grid gap-y-10 gap-x-8 md:grid-cols-2 xl:grid-cols-[1.45fr_0.9fr_0.9fr_1.15fr]">
            <FooterBrand />

<FooterLinks
  title="Company Links"
  links={companyLinks}
  underlineWidth="w-40"
/>

<FooterLinks
  title="Important Link"
  links={importantLinks}
  underlineWidth="w-36"
/>

            <FooterNewsletter />
          </div>
        </Container>
      </div>

      <FooterBottom />
    </footer>
  );
}