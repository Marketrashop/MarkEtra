import {
  buildBaseEmail,
} from "./base-email";

type OrderPaymentRejectedEmailInput = {
  firstName: string;

  orderNumber: string;

  reason: string;

  orderUrl?: string;
};

export function buildOrderPaymentRejectedEmail({
  firstName,
  orderNumber,
  reason,
  orderUrl,
}: OrderPaymentRejectedEmailInput) {
  const subject =
    `Payment rejected for order ${orderNumber}`;

  const email =
    buildBaseEmail({
      subject,

      preheader:
        `Your payment for order ${orderNumber} could not be approved.`,

      title:
        "Payment could not be approved",

      message:
        `Hello ${firstName}, we could not approve the payment submitted for order ${orderNumber}. The order has not been processed.`,

      details: [
        {
          label: "Order",
          value: orderNumber,
        },
        {
          label: "Status",
          value: "Payment rejected",
        },
        {
          label: "Reason",
          value: reason,
        },
      ],

      button: orderUrl
        ? {
            label: "View my order",
            url: orderUrl,
          }
        : undefined,

      footerMessage:
        "Please review the payment details and contact support if you need assistance.",
    });

  const text = [
    `Hi ${firstName},`,
    "",
    `We could not approve the payment submitted for order ${orderNumber}.`,
    "",
    `Reason: ${reason}`,
    "",
    "The order has not been processed.",
    "",
    "MarkEtra",
  ].join("\n");

  return {
    subject,
    html: email.html,
    text,
  };
}