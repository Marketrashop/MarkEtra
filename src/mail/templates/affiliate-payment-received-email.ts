import {
  buildBaseEmail,
} from "./base-email";

export type AffiliatePaymentReceivedEmailInput = {
  affiliateFirstName: string;

  buyerName: string;

  productName: string;

  agreedPrice: number;

  escrowUrl: string;
};

export function buildAffiliatePaymentReceivedEmail({
  affiliateFirstName,
  buyerName,
  productName,
  agreedPrice,
  escrowUrl,
}: AffiliatePaymentReceivedEmailInput): {
  html: string;
  text: string;
} {
  return buildBaseEmail({
    subject:
      "Payment received for your affiliate sale",

    preheader:
      `Payment has been confirmed for ${productName}.`,

    title:
      "Payment received",

    message:
      `Hi ${affiliateFirstName},\n\nPayment has been confirmed for "${productName}". ${buyerName} has completed the payment for the agreed transaction, and the transaction has now moved into escrow.`,

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
        escrowUrl,
    },

    footerMessage:
      "The transaction will remain in escrow until the order is completed through the MarkEtra platform.",
  });
}