import {
  buildBaseEmail,
} from "./base-email";

export type AffiliateNegotiationMessageEmailInput = {
  buyerName: string;

  affiliateName: string;

  productName: string;

  message: string;

  offeredPrice: number | null;
};

export function buildAffiliateNegotiationMessageEmail({
  buyerName,
  affiliateName,
  productName,
  message,
  offeredPrice,
}: AffiliateNegotiationMessageEmailInput): {
  html: string;
  text: string;
} {
  return buildBaseEmail({
    subject:
      "New message about your affiliate offer",

    preheader:
      `${affiliateName} sent you a new message about ${productName}.`,

    title:
      "New negotiation message",

    message:
      `Hi ${buyerName},\n\n${affiliateName} has sent you a new message regarding your affiliate offer for "${productName}".\n\nMessage from ${affiliateName}:\n${message}`,

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
                "From",

              value:
                affiliateName,
            },

            {
              label:
                "Proposed Price",

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
                "From",

              value:
                affiliateName,
            },
          ],

    footerMessage:
      "Please return to the MarkEtra platform to continue the negotiation.",
  });
}