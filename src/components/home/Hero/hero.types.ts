export interface HeroData {
  badge: string;
  title: string;
  description: string;
  primaryButton: {
    label: string;
    href: string;
  };
  videoButton: {
    url: string;
    ariaLabel: string;
  };
  image: {
    src: string;
    alt: string;
  };
}