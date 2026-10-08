import { buildBaseEmail } from "./base-email";
import { buildItemsHtml, formatAmount, type EmailItem } from "./item-list";

type OrderConfirmationEmailInput = {
  firstName: string;
  orderNumber: string;
  total: string;
  paymentMethod: string;
  deliveryAddress: string;
  items: EmailItem[];
  orderUrl?: string;
  placedAt?: Date;
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

export function buildOrderConfirmationEmail({
  firstName,
  orderNumber,
  total,
  paymentMethod,
  deliveryAddress,
  items,
  orderUrl,
  placedAt,
}: OrderConfirmationEmailInput) {
  const name = firstName.trim() || "there";
  const amount = formatAmount(total);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subject = `Order ${orderNumber} confirmed`;

  // Items are rendered in htmlSection, so they are not listed here.
  const details = [
    { label: "Order number", value: orderNumber },
    ...(placedAt
      ? [{ label: "Placed on", value: formatDateTime(placedAt) }]
      : []),
    { label: "Payment method", value: paymentMethod },
    { label: "Delivery address", value: deliveryAddress || "Not provided" },
    { label: "Order total", value: amount },
  ];

  const footerMessage =
    "We'll email you again as your order moves forward. If you didn't place this order, please contact our support team right away.";

  const email = buildBaseEmail({
    subject,
    preheader: `Thanks, ${name}! We've received order ${orderNumber} (${amount}) and it's being processed.`,
    title: `Thank you for your order, ${name}`,
    message: `We've received your order ${orderNumber}${
      itemCount > 0
        ? ` with ${itemCount} ${itemCount === 1 ? "item" : "items"}`
        : ""
    } and it's now being processed. Here's a summary for your records.`,
    htmlSection: buildItemsHtml(items),
    details,
    button: orderUrl
      ? { label: "View order details", url: orderUrl }
      : undefined,
    footerMessage,
  });

  const itemLines =
    items.length > 0
      ? items.map(
          (item) =>
            `- ${item.name} × ${item.quantity}: ${formatAmount(
              item.totalPrice,
            )} (${formatAmount(item.unitPrice)} each)`,
        )
      : ["- No items available."];

  const text = [
    `Hi ${name},`,
    "",
    `Thank you for your order. We've received order ${orderNumber} and it's now being processed.`,
    "",
    `Order number: ${orderNumber}`,
    ...(placedAt ? [`Placed on: ${formatDateTime(placedAt)}`] : []),
    `Payment method: ${paymentMethod}`,
    `Delivery address: ${deliveryAddress || "Not provided"}`,
    "",
    "Items:",
    ...itemLines,
    "",
    `Order total: ${amount}`,
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