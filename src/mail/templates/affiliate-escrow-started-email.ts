import {
  buildBaseEmail,
} from "./base-email";

export type AffiliateEscrowStartedEmailInput = {
  affiliateFirstName: string;

  buyerName: string;

  productName: string;

  agreedPrice: number;

  transactionUrl: string;
};

export function buildAffiliateEscrowStartedEmail({
  affiliateFirstName,
  buyerName,
  productName,
  agreedPrice,
  transactionUrl,
}: AffiliateEscrowStartedEmailInput): {
  html: string;
  text: string;
} {
  return buildBaseEmail({
    subject:
      "Your affiliate transaction is now in escrow",

    preheader:
      `The payment for ${productName} has been secured in escrow.`,

    title:
      "Transaction in escrow",

    message:
      `Hi ${affiliateFirstName},\n\nThe payment for "${productName}" has been confirmed and your affiliate transaction is now in escrow. ${buyerName} has completed payment for the agreed transaction, and the order can now proceed toward completion.`,

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
          "Agreed Price",

        value:
          `$${agreedPrice.toFixed(
            2,
          )}`,
      },

      {
        label:
          "Transaction Status",

        value:
          "In escrow",
      },
    ],

    button: {
      label:
        "View Transaction",

      url:
        transactionUrl,
    },

    footerMessage:
      "The transaction will remain in escrow until the order is completed through the MarkEtra platform.",
  });
}