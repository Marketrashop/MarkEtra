import {
  buildBaseEmail,
} from "./base-email";

export type AffiliateInterestEmailInput = {
  affiliateFirstName: string;

  buyerName: string;

  productName: string;

  offeredPrice: number;

  reviewUrl: string;
};

export function buildAffiliateInterestEmail({
  affiliateFirstName,
  buyerName,
  productName,
  offeredPrice,
  reviewUrl,
}: AffiliateInterestEmailInput): {
  html: string;

  text: string;
} {
  return buildBaseEmail({
    subject:
      "New buyer interest in your affiliate product",

    preheader:
      `${buyerName} is interested in ${productName}.`,

    title:
      "New buyer interest",

    message:
      `Hi ${affiliateFirstName},\n\n${buyerName} has expressed interest in one of your affiliate products.\n\nThe buyer is waiting for you to review their offer. You can open your affiliate dashboard to review the interest, continue the conversation, negotiate the terms, or accept or close the negotiation.`,

    details: [
      {
        label:
          "Product",

        value:
          productName,
      },

      {
        label:
          "Buyer",

        value:
          buyerName,
      },

      {
        label:
          "Offer",

        value:
          `$${offeredPrice.toFixed(
            2,
          )}`,
      },
    ],

    button: {
      label:
        "Review Buyer Interest",

      url:
        reviewUrl,
    },

    footerMessage:
      "You can return to your affiliate dashboard at any time to continue the conversation.",
  });
}