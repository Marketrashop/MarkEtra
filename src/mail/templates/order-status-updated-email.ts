import {
  buildBaseEmail,
} from "./base-email";

type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "NEAR_DESTINATION"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

type OrderStatusUpdatedEmailInput = {
  firstName: string;

  orderNumber: string;

  status: OrderStatus;

  orderUrl?: string;
};

export function buildOrderStatusUpdatedEmail({
  firstName,
  orderNumber,
  status,
  orderUrl,
}: OrderStatusUpdatedEmailInput) {
  const statusLabel =
    formatStatusLabel(
      status,
    );

  const subject =
    `Order ${orderNumber} is ${statusLabel}`;

  const message =
    getStatusMessage(
      firstName,
      orderNumber,
      statusLabel,
    );

  const email =
    buildBaseEmail({
      subject,

      preheader:
        `Your order ${orderNumber} is now ${statusLabel}.`,

      title:
        `Order update: ${statusLabel}`,

      message,

      details: [
        {
          label: "Order",
          value: orderNumber,
        },
        {
          label: "Status",
          value: statusLabel,
        },
      ],

      button: orderUrl
        ? {
            label: "View my order",
            url: orderUrl,
          }
        : undefined,

      footerMessage:
        status === "DELIVERED"
          ? "Thank you for shopping with MarkEtra."
          : status === "CANCELLED"
            ? "Please contact support if you need help with this order."
            : "We will keep you updated as your order progresses.",
    });

  const text = [
    `Hi ${firstName},`,
    "",
    message,
    "",
    `Order: ${orderNumber}`,
    `Status: ${statusLabel}`,
    "",
    "MarkEtra",
  ].join("\n");

  return {
    subject,
    html: email.html,
    text,
  };
}

function formatStatusLabel(
  status: OrderStatus,
) {
  return status
    .replaceAll(
      "_",
      " ",
    )
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

function getStatusMessage(
  firstName: string,
  orderNumber: string,
  statusLabel: string,
) {
  return `Hello ${firstName}, your order ${orderNumber} is now ${statusLabel.toLowerCase()}.`;
}