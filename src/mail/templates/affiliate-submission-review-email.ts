import {
  buildBaseEmail,
} from "./base-email";

export type AffiliateSubmissionReviewEmailInput = {
  affiliateFirstName: string;

  productName: string;

  reviewUrl: string;
};

export function buildAffiliateSubmissionReviewEmail({
  affiliateFirstName,
  productName,
  reviewUrl,
}: AffiliateSubmissionReviewEmailInput): {
  html: string;

  text: string;
} {
  return buildBaseEmail({
    subject:
      "Your affiliate product submission is under review",

    preheader:
      `${productName} is currently being reviewed for affiliate eligibility.`,

    title:
      "Your submission is under review",

    message:
      `Hi ${affiliateFirstName},\n\nYour affiliate product submission is currently being reviewed by our administrators for eligibility.\n\nOur team is reviewing your submission and will update you once a decision has been made.`,

    details: [
      {
        label:
          "Product",

        value:
          productName,
      },

      {
        label:
          "Submission Status",

        value:
          "Under Review",
      },
    ],

    button: {
      label:
        "View Affiliate Products",

      url:
        reviewUrl,
    },

    footerMessage:
      "We'll notify you by email when your submission progresses to the next stage.",
  });
}