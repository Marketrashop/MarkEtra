import {
  buildBaseEmail,
} from "./base-email";

export type AffiliateNegotiationReplyEmailInput = {
  affiliateFirstName: string;

  buyerName: string;

  productName: string;

  message: string;

  offeredPrice: number | null;

  reviewUrl: string;
};

export function buildAffiliateNegotiationReplyEmail({
  affiliateFirstName,
  buyerName,
  productName,
  message,
  offeredPrice,
  reviewUrl,
}: AffiliateNegotiationReplyEmailInput): {
  html: string;
  text: string;
} {
  return buildBaseEmail({
    subject:
      "The buyer replied to your negotiation",

    preheader:
      `${buyerName} replied to your negotiation for ${productName}.`,

    title:
      "The buyer replied",

    message:
      `Hi ${affiliateFirstName},\n\n${buyerName} has replied to your negotiation regarding "${productName}".\n\nMessage from ${buyerName}:\n${message}`,

    details:
      offeredPrice !== null
        ? [
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
                "Buyer's Proposed Price",

              value:
                `$${offeredPrice.toFixed(
                  2,
                )}`,
            },
          ]
        : [
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
          ],

    button: {
      label:
        "View Negotiation",

      url:
        reviewUrl,
    },

    footerMessage:
      "You can return to your affiliate dashboard to review the buyer's message and continue the negotiation.",
  });
}