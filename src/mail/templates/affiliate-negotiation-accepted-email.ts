import {
  buildBaseEmail,
} from "./base-email";

export type AffiliateNegotiationAcceptedEmailInput = {
  buyerName: string;

  affiliateName: string;

  productName: string;

  agreedPrice: number;

  reviewUrl: string;
};

export function buildAffiliateNegotiationAcceptedEmail({
  buyerName,
  affiliateName,
  productName,
  agreedPrice,
  reviewUrl,
}: AffiliateNegotiationAcceptedEmailInput): {
  html: string;
  text: string;
} {
  return buildBaseEmail({
    subject:
      "Your affiliate offer has been accepted",

    preheader:
      `${affiliateName} accepted your offer for ${productName}.`,

    title:
      "Offer accepted",

    message:
      `Hi ${buyerName},\n\n${affiliateName} has accepted your offer for "${productName}". The negotiated terms are now confirmed, and the transaction can proceed to the payment stage.`,

    details: [
      {
        label:
          "Product",

        value:
          productName,
      },

      {
        label:
          "Affiliate",

        value:
          affiliateName,
      },

      {
        label:
          "Agreed Price",

        value:
          `$${agreedPrice.toFixed(
            2,
          )}`,
      },
    ],

    button: {
      label:
        "View Your Offer",

      url:
        reviewUrl,
    },

    footerMessage:
      "Please return to MarkEtra to continue with the next step of your transaction.",
  });
}