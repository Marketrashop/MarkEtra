import { FAQItem } from "./faq.types";

import Link from "next/link";

export const faqItems: FAQItem[] = [
{
  id: "return-policy",

  question: "What is your return policy?",

  answer: (
    <>
      Our return policy varies depending on the product and seller. For
      complete details on eligibility, return conditions, and timelines,
      please see our{" "}
<Link
  href="/return-policy"
  className="
    !text-[#5b5ef7]
    !underline
    underline-offset-2
    decoration-[#5b5ef7]
    decoration-2
    transition-colors
    duration-200
    hover:!text-[#7477ff]
    hover:decoration-[#7477ff]
  "
>
  Return Policy
</Link>
      .
    </>
  ),

  defaultOpen: true,
},

  {
    id: "cancel-order",
    question: "Can I cancel or modify my order?",
    answer:
      "Yes, you can cancel or modify an order before it has been processed or shipped. Once an order has been dispatched, changes may no longer be possible.",
  },

  {
    id: "payment-info",
    question: "Can I save my payment information?",
    answer:
      "Yes. Depending on your selected payment method, you may securely save your payment information for a faster checkout experience on future purchases.",
  },

  {
    id: "receipt",
    question: "How can I get a copy of my payment receipt?",
    answer:
      "A payment receipt is automatically sent to your registered email after every successful order. You can also view your order details from your Orders page.",
  },

  {
    id: "track-order",
    question: "How can I track my order?",
    answer:
      "Once your order has been confirmed, you can track its status from your Orders page. You'll receive updates as your order is processed, shipped, and delivered.",
  },

  {
    id: "place-order",
    question: "How can I place an order?",
    answer:
      "Browse the marketplace, select the products you want, add them to your cart, then complete checkout by providing your shipping details and choosing a supported payment method.",
  },

  {
    id: "affiliate-products",
    question: "What are affiliate products?",
    answer:
      "Affiliate products allow eligible subscribers to earn commissions by promoting and selling products listed by other sellers on the marketplace. Commission rates depend on your active subscription plan.",
  },

  {
    id: "payment-methods",
    question: "What payment methods do you accept?",
    answer:
      "We support debit cards, credit cards, bank transfers, and any additional payment methods made available during checkout, depending on your region.",
  },
];