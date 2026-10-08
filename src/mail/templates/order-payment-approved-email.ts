import {
  buildBaseEmail,
} from "./base-email";

type OrderPaymentApprovedEmailInput = {
  firstName: string;

  orderNumber: string;

  total: string;

  orderUrl?: string;
};

export function buildOrderPaymentApprovedEmail({
  firstName,
  orderNumber,
  total,
  orderUrl,
}: OrderPaymentApprovedEmailInput) {
  const subject =
    `Payment approved for order ${orderNumber}`;

  const email =
    buildBaseEmail({
      subject,

      preheader:
        `Your payment for order ${orderNumber} has been approved.`,

      title:
        "Payment approved",

      message:
        `Hello ${firstName}, your payment of $${total} for order ${orderNumber} has been successfully verified. Your order is now being processed.`,

      details: [
        {
          label: "Order",
          value: orderNumber,
        },
        {
          label: "Payment",
          value: "Crypto payment approved",
        },
        {
          label: "Total",
          value: `$${total}`,
        },
      ],

      button: orderUrl
        ? {
            label: "View my order",
            url: orderUrl,
          }
        : undefined,

      footerMessage:
        "We will keep you updated as your order progresses.",
    });

  const text = [
    `Hi ${firstName},`,
    "",
    `Your payment of $${total} for order ${orderNumber} has been successfully verified.`,
    "",
    "Your order is now being processed.",
    "",
    "MarkEtra",
  ].join("\n");

  return {
    subject,
    html: email.html,
    text,
  };
}