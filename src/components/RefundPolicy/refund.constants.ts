import type {
  RefundSection,
  TableOfContentsItem,
} from "./refund.types";

export const REFUND_HERO = {
  title: "Refund Policy",

  description:
    "Please review our Refund Policy carefully before purchasing any digital products or services from MarkEtra.",
};

export const LAST_UPDATED =
  "August 4, 2026";

export const REFUND_SECTIONS: RefundSection[] = [
  {
    id: "eligibility",

    title: "Refund Eligibility",

    content: [
      "Due to the nature of digital products, all sales are generally considered final once access has been granted or the product has been delivered.",

      "Refund requests may only be considered in exceptional circumstances, such as duplicate payments or technical issues that prevent product delivery.",
    ],
  },

  {
    id: "digital-products",

    title: "Digital Products",

    content: [
      "Once a digital product has been successfully delivered or made available for download, it is not eligible for a refund unless otherwise required by applicable law.",
    ],
  },

  {
    id: "technical-issues",

    title: "Technical Issues",

    content: [
      "If you experience problems accessing a purchased product, please contact our support team. We will make every reasonable effort to resolve the issue before considering a refund.",
    ],
  },

  {
    id: "refund-process",

    title: "Refund Process",

    content: [
      "If a refund is approved, it will be processed using the original payment method whenever possible. Processing times may vary depending on your payment provider.",
    ],
  },

  {
    id: "non-refundable-items",

    title: "Non Refundable Items",

    content: [
      "Downloaded digital products, completed services, and any products explicitly marked as non refundable are not eligible for refunds except where required by law.",
    ],
  },

  {
    id: "policy-changes",

    title: "Changes to This Refund Policy",

    content: [
      "We reserve the right to update or modify this Refund Policy at any time. Changes become effective immediately upon publication on this page.",
    ],
  },
];

export const TABLE_OF_CONTENTS: TableOfContentsItem[] =
  REFUND_SECTIONS.map(
    ({ id, title }) => ({
      id,
      title,
    })
  );

export const REFUND_CTA = {
  title:
    "Questions About Refunds?",

  description:
    "If you have questions about this Refund Policy or a recent purchase, our team will be happy to assist you.",

  button: "Contact Us",
};