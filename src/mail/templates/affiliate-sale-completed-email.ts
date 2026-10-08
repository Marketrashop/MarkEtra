import {
  buildBaseEmail,
} from "./base-email";

export type AffiliateSaleCompletedEmailInput = {
  affiliateFirstName: string;

  buyerName: string;

  productName: string;

  agreedPrice: number;

  commissionRate: number;

  commissionAmount: number;

  completedAt: string;

  transactionUrl: string;
};

export function buildAffiliateSaleCompletedEmail({
  affiliateFirstName,
  buyerName,
  productName,
  agreedPrice,
  commissionRate,
  commissionAmount,
  completedAt,
  transactionUrl,
}: AffiliateSaleCompletedEmailInput): {
  html: string;
  text: string;
} {
  return buildBaseEmail({
    subject:
      "Your affiliate sale is complete",

    preheader:
      `Your sale for ${productName} is complete and your commission has been recorded.`,

    title:
      "Sale completed",

    message:
      `Hi ${affiliateFirstName},\n\nYour affiliate sale for "${productName}" has been completed successfully. The transaction has been completed with ${buyerName}, and your affiliate commission has been recorded.`,

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
          "Commission Rate",

        value:
          `${commissionRate.toFixed(
            2,
          )}%`,
      },

      {
        label:
          "Commission Earned",

        value:
          `$${commissionAmount.toFixed(
            2,
          )}`,
      },

      {
        label:
          "Completed",

        value:
          completedAt,
      },
    ],

    button: {
      label:
        "View Affiliate Activity",

      url:
        transactionUrl,
    },

    footerMessage:
      "Your commission has been recorded as part of your affiliate earnings.",
  });
}