import type {
  PrivacySection,
  TableOfContentsItem,
} from "./privacy.types";

export const PRIVACY_HERO = {
  title: "Privacy Policy",

  description:
    "This Privacy Policy explains how MarkEtra collects, uses, stores, and protects your personal information when you use our website, products, and services.",
};

export const LAST_UPDATED =
  "August 4, 2026";

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: "information-we-collect",

    title: "Information We Collect",

    content: [
      "We may collect personal information that you voluntarily provide when creating an account, making a purchase, subscribing to updates, or contacting us.",

      "We may also collect certain technical information automatically, including your device information, browser type, IP address, and usage data.",
    ],
  },

  {
    id: "how-we-use-information",

    title: "How We Use Your Information",

    content: [
      "We use the information we collect to provide our services, process purchases, improve user experience, communicate with you, and maintain the security of our platform.",
    ],
  },

  {
    id: "sharing-information",

    title: "Sharing Your Information",

    content: [
      "We do not sell your personal information. We may share information only with trusted service providers that help us operate our platform or where required by applicable law.",
    ],
  },

  {
    id: "data-security",

    title: "Data Security",

    content: [
      "We implement appropriate technical and organizational measures to help protect your personal information against unauthorized access, disclosure, alteration, or destruction.",
    ],
  },

  {
    id: "cookies",

    title: "Cookies and Analytics",

    content: [
      "Our website may use cookies and similar technologies to improve functionality, remember your preferences, and better understand how visitors interact with our platform.",
    ],
  },

  {
    id: "your-rights",

    title: "Your Rights",

    content: [
      "Depending on your location, you may have the right to access, update, or request deletion of your personal information, subject to applicable laws.",
    ],
  },

  {
    id: "policy-changes",

    title: "Changes to This Privacy Policy",

    content: [
      "We may update this Privacy Policy from time to time. Any changes become effective immediately upon publication on this page.",
    ],
  },
];

export const TABLE_OF_CONTENTS: TableOfContentsItem[] =
  PRIVACY_SECTIONS.map(
    ({ id, title }) => ({
      id,
      title,
    })
  );

export const PRIVACY_CTA = {
  title:
    "Questions About Your Privacy?",

  description:
    "If you have any questions about how we collect, use, or protect your information, our team will be happy to assist you.",

  button: "Contact Us",
};