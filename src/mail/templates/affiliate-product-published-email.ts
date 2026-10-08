import {
  buildBaseEmail,
} from "./base-email";

export type AffiliateProductPublishedEmailInput = {
  affiliateFirstName: string;

  productName: string;

  publishedUrl: string;
};

export function buildAffiliateProductPublishedEmail({
  affiliateFirstName,
  productName,
  publishedUrl,
}: AffiliateProductPublishedEmailInput): {
  html: string;

  text: string;
} {
  return buildBaseEmail({
    subject:
      "Your affiliate product has been approved and published",

    preheader:
      `${productName} has been approved and is now available on the MarkEtra Marketplace.`,

    title:
      "Your product is live",

    message:
      `Hi ${affiliateFirstName},\n\nGood news. Your affiliate product submission has been approved and is now published on the MarkEtra Marketplace.\n\nYour product is now available to buyers, and eligible buyers can begin registering interest in it.`,

    details: [
      {
        label:
          "Product",

        value:
          productName,
      },

      {
        label:
          "Approval Status",

        value:
          "Approved",
      },

      {
        label:
          "Marketplace Status",

        value:
          "Published",
      },
    ],

    button: {
      label:
        "View Your Published Product",

      url:
        publishedUrl,
    },

    footerMessage:
      "You can manage your affiliate product and monitor buyer activity from your affiliate dashboard.",
  });
}