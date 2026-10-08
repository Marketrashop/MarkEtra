export type EmailItem = {
  name: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  imageUrl?: string | null;
};

const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export function formatAmount(value: string) {
  const cleaned = value.replace(/^\$/, "").trim();
  return `$${cleaned}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function resolveImageUrl(url?: string | null): string | null {
  if (!url) return null;

  let absolute = url.trim();

  if (absolute.startsWith("//")) {
    absolute = `https:${absolute}`;
  } else if (absolute.startsWith("/")) {
    absolute = `${APP_URL}${absolute}`;
  }

  absolute = absolute.replace(
    /^http:\/\/res\.cloudinary\.com/i,
    "https://res.cloudinary.com",
  );

  if (!/^https:\/\//i.test(absolute)) return null;

  // Serve a small, email-safe JPG instead of WebP/AVIF.
  if (
    absolute.includes("res.cloudinary.com") &&
    absolute.includes("/image/upload/")
  ) {
    absolute = absolute.replace(
      "/image/upload/",
      "/image/upload/f_jpg,q_auto,w_128,h_128,c_fill/",
    );
  }

  return absolute;
}

export function buildItemsHtml(
  items: EmailItem[],
  heading = "Items in your order",
) {
  if (items.length === 0) return "";

  const rows = items
    .map((item, index) => {
      const name = escapeHtml(item.name);
      const border =
        index < items.length - 1 ? "border-bottom:1px solid #e8e8ee;" : "";
      const imageUrl = resolveImageUrl(item.imageUrl);

      const image = imageUrl
        ? `<img src="${escapeHtml(imageUrl)}" alt="${name}" width="64" height="64" style="display:block;width:64px;height:64px;object-fit:cover;border-radius:8px;border:1px solid #e8e8ee;background:#f5f5f8;" />`
        : `<div style="width:64px;height:64px;border-radius:8px;border:1px solid #e8e8ee;background:#f5f5f8;"></div>`;

      return `
        <tr>
          <td width="64" valign="top" style="padding:12px 0;${border}">${image}</td>
          <td valign="top" style="padding:12px;${border}font-family:Arial,Helvetica,sans-serif;">
            <div style="font-size:14px;font-weight:600;line-height:20px;color:#18191f;">${name}</div>
            <div style="margin-top:2px;font-size:12px;line-height:18px;color:#6b6d78;">
              Qty ${item.quantity} &middot; ${escapeHtml(formatAmount(item.unitPrice))} each
            </div>
          </td>
          <td align="right" valign="top" style="padding:12px 0;${border}font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;line-height:20px;color:#18191f;white-space:nowrap;">
            ${escapeHtml(formatAmount(item.totalPrice))}
          </td>
        </tr>`;
    })
    .join("");

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#6b6d78;margin:0 0 4px;">
      ${escapeHtml(heading)}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      ${rows}
    </table>`;
}