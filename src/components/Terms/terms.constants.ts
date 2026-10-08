import type {
  LegalSection,
  TableOfContentsItem,
} from "./terms.types";

export const TERMS_HERO = {
  title: "Terms of Service",

  description:
    "Please read these Terms of Service carefully before using MarkEtra, our website, and any of our digital products or services.",
};

export const LAST_UPDATED =
  "August 4, 2026";

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "acceptance",

    title: "Acceptance of Terms",

    content: [
      "By accessing or using MarkEtra, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should discontinue using our website and services immediately.",
    ],
  },

  {
    id: "services",

    title: "Use of Our Services",

    content: [
      "MarkEtra provides digital resources, educational content, and online business solutions intended for lawful personal and business use.",

      "You agree not to misuse our services, interfere with the operation of the platform, or engage in activities that violate applicable laws or regulations.",
    ],
  },

  {
    id: "accounts",

    title: "Accounts and Purchases",

    content: [
      "Some features or products may require you to provide accurate personal information during checkout or account creation.",

      "You are responsible for ensuring that the information you provide is complete, accurate, and up to date.",
    ],
  },

  {
    id: "payments",

    title: "Payments",

    content: [
      "All payments are processed securely through trusted third party payment providers. By completing a purchase, you authorize the applicable payment provider to process your transaction.",
    ],
  },

  {
    id: "intellectual-property",

    title: "Intellectual Property",

    content: [
      "Unless otherwise stated, all content, branding, digital products, graphics, text, and materials available on MarkEtra remain the intellectual property of MarkEtra and may not be copied, redistributed, or reproduced without prior written permission.",
    ],
  },

  {
    id: "limitations",

    title: "Limitation of Liability",

    content: [
      "MarkEtra provides educational resources and digital products without guaranteeing specific business or financial outcomes. Your use of our platform is at your own discretion and risk.",
    ],
  },

  {
    id: "changes",

    title: "Changes to These Terms",

    content: [
      "We reserve the right to modify these Terms of Service at any time. Updated versions will become effective immediately upon publication on this page.",
    ],
  },
];

export const TABLE_OF_CONTENTS: TableOfContentsItem[] =
  TERMS_SECTIONS.map(
    ({ id, title }) => ({
      id,
      title,
    })
  );

export const TERMS_CTA = {
  title:
    "Questions About These Terms?",

  description:
    "If you need clarification regarding any part of these Terms of Service, our team will be happy to help.",

  button: "Contact Us",
};