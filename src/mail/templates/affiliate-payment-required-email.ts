import {
  buildBaseEmail,
} from "./base-email";

export type AffiliatePaymentRequiredEmailInput = {
  buyerName: string;

  affiliateName: string;

  productName: string;

  agreedPrice: number;

  paymentUrl: string;
};

export function buildAffiliatePaymentRequiredEmail({
  buyerName,
  affiliateName,
  productName,
  agreedPrice,
  paymentUrl,
}: AffiliatePaymentRequiredEmailInput): {
  html: string;
  text: string;
} {
  return buildBaseEmail({
    subject:
      "Payment required for your affiliate purchase",

    preheader:
      `Your offer for ${productName} has been accepted and is ready for payment.`,

    title:
      "Payment required",

    message:
      `Hi ${buyerName},\n\nYour offer for "${productName}" has been accepted by ${affiliateName}. The agreed terms are confirmed, and payment is now required to move the transaction forward.\n\nOnce your payment is confirmed, the transaction will move into escrow.`,

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

      {
        label:
          "Payment Status",

        value:
          "Payment required",
      },
    ],

    button: {
      label:
        "Make Payment",

      url:
        paymentUrl,
    },

    footerMessage:
      "Please complete your payment through the MarkEtra platform. Your transaction will move into escrow after payment is confirmed.",
  });
}