import {
  buildBaseEmail,
} from "./base-email";

type OrderRefundEmailInput = {
  firstName: string;

  orderNumber: string;

  total: string;

  orderUrl?: string;
};

export function buildOrderRefundEmail({
  firstName,
  orderNumber,
  total,
  orderUrl,
}: OrderRefundEmailInput) {
  const subject =
    `Refund processed for order ${orderNumber}`;

  const email =
    buildBaseEmail({
      subject,

      preheader:
        `Your refund for order ${orderNumber} has been processed.`,

      title:
        "Your refund has been processed",

      message:
        `Hello ${firstName}, your refund of $${total} for order ${orderNumber} has been successfully processed. The full amount has been returned to your MarkEtra wallet.`,

      details: [
        {
          label: "Order",
          value: orderNumber,
        },
        {
          label: "Status",
          value: "Refunded",
        },
        {
          label: "Refund amount",
          value: `$${total}`,
        },
        {
          label: "Credit",
          value: "Returned to wallet",
        },
      ],

      button: orderUrl
        ? {
            label: "View my order",
            url: orderUrl,
          }
        : undefined,

      footerMessage:
        "The refunded amount is now available in your MarkEtra wallet.",
    });

  const text = [
    `Hi ${firstName},`,
    "",
    `Your refund of $${total} for order ${orderNumber} has been successfully processed.`,
    "",
    "The full amount has been returned to your MarkEtra wallet.",
    "",
    `Order: ${orderNumber}`,
    "Status: Refunded",
    `Refund amount: $${total}`,
    "Credit: Returned to wallet",
    "",
    "MarkEtra",
  ].join("\n");

  return {
    subject,
    html: email.html,
    text,
  };
}