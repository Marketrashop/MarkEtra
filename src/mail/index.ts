export {
  sendMail,
} from "./send-mail";

export {
  buildBaseEmail,
} from "./templates/base-email";

export {
  buildVerificationEmail,
} from "./templates/verification-email";

export {
  buildPasswordResetEmail,
} from "./templates/password-reset-email";

export {
  buildDepositApprovedEmail,
} from "./templates/deposit-approved-email";

export {
  buildOrderConfirmationEmail,
} from "./templates/order-confirmation-email";

export {
  buildOrderPaymentApprovedEmail,
} from "./templates/order-payment-approved-email";

export {
  buildOrderPaymentRejectedEmail,
} from "./templates/order-payment-rejected-email";

export {
  buildOrderStatusUpdatedEmail,
} from "./templates/order-status-updated-email";

export {
  buildAffiliateInterestEmail,
} from "./templates/affiliate-interest-email";

export {
  buildAffiliateNegotiationMessageEmail,
} from "./templates/affiliate-negotiation-message-email";

export {
  buildAffiliateNegotiationReplyEmail,
} from "./templates/affiliate-negotiation-reply-email";

export {
  buildAffiliateNegotiationAcceptedEmail,
} from "./templates/affiliate-negotiation-accepted-email";

export {
  buildAffiliatePaymentRequiredEmail,
} from "./templates/affiliate-payment-required-email";

export {
  buildAffiliatePaymentReceivedEmail,
} from "./templates/affiliate-payment-received-email";

export {
  buildAffiliateEscrowStartedEmail,
} from "./templates/affiliate-escrow-started-email";

export {
  buildAffiliateSaleCompletedEmail,
} from "./templates/affiliate-sale-completed-email";

export {
  buildAffiliateSubmissionReviewEmail,
} from "./templates/affiliate-submission-review-email";

export {
  buildAffiliateProductPublishedEmail,
} from "./templates/affiliate-product-published-email";

export {
  buildOrderCancellationEmail,
} from "./templates/order-cancellation-email";

export {
  buildOrderRefundEmail,
} from "./templates/order-refund-email";

export {
  buildItemsHtml,
  formatAmount,
  resolveImageUrl,
} from "./templates/item-list";

export type {
  EmailItem,
} from "./templates/item-list";

export type {
  BaseEmailInput,
  EmailButton,
  EmailDetail,
  SendMailInput,
  SendMailResult,
} from "./types";
