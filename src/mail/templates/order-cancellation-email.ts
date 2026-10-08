import { buildBaseEmail } from "./base-email";
import { buildItemsHtml, formatAmount, type EmailItem } from "./item-list";

type OrderCancellationEmailInput = {
  firstName: string;
  orderNumber: string;
  total: string;
  walletCredited: boolean;
  items?: EmailItem[];
  orderUrl?: string;
  cancelledAt?: Date;
};

function formatDateTime(date: Date) {
  return (
    date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    }) + " UTC"
  );
}

export function buildOrderCancellationEmail({
  firstName,
  orderNumber,
  total,
  walletCredited,
  items = [],
  orderUrl,
  cancelledAt,
}: OrderCancellationEmailInput) {
  const name = firstName.trim() || "there";
  const amount = formatAmount(total);

  const subject = `Order ${orderNumber} has been cancelled`;

  const refundMessage = walletCredited
    ? `We've returned ${amount} to your MarkEtra wallet. It's available right away to use on a new order or to withdraw.`
    : "No payment was collected for this order, so there's nothing to refund.";

  const details = [
    { label: "Order number", value: orderNumber },
    { label: "Status", value: "Cancelled" },
    ...(cancelledAt
      ? [{ label: "Cancelled on", value: formatDateTime(cancelledAt) }]
      : []),
    { label: "Order total", value: amount },
    {
      label: "Refund",
      value: walletCredited
        ? `${amount} to MarkEtra wallet`
        : "None (no payment collected)",
    },
  ];

  const footerMessage = walletCredited
    ? "Changed your mind? You can browse MarkEtra and place a new order anytime. If you didn't request this cancellation, please contact our support team right away."
    : "If you didn't request this cancellation or need help with this order, please contact our support team.";

  const email = buildBaseEmail({
    subject,
    preheader: walletCredited
      ? `Order ${orderNumber} is cancelled and ${amount} is back in your wallet.`
      : `Order ${orderNumber} has been cancelled.`,
    title: "Your order has been cancelled",
    message: `Hi ${name}, your order ${orderNumber} has been cancelled. ${refundMessage}`,
    htmlSection: buildItemsHtml(items, "Cancelled items"),
    details,
    button: orderUrl
      ? { label: "View order details", url: orderUrl }
      : undefined,
    footerMessage,
  });

  const itemLines = items.map(
    (item) =>
      `- ${item.name} × ${item.quantity}: ${formatAmount(item.totalPrice)}`,
  );

  const text = [
    `Hi ${name},`,
    "",
    `Your order ${orderNumber} has been cancelled.`,
    refundMessage,
    "",
    ...details.map(({ label, value }) => `${label}: ${value}`),
    ...(itemLines.length > 0 ? ["", "Cancelled items:", ...itemLines] : []),
    ...(orderUrl ? ["", `View order details: ${orderUrl}`] : []),
    "",
    footerMessage,
    "",
    "The MarkEtra Team",
  ].join("\n");

  return {
    subject,
    html: email.html,
    text,
  };
}