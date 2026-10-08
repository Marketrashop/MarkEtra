import type {
  BaseEmailInput,
} from "@/mail/types";

const BRAND_NAME =
  "MarkEtra";

const BRAND_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";

export function buildBaseEmail({
  subject,
  preheader,
  title,
  message,
  htmlSection,
  details = [],
  button,
  footerMessage,
}: BaseEmailInput): {
  html: string;
  text: string;
} {
  const safeSubject =
    escapeHtml(subject);

  const safePreheader =
    escapeHtml(
      preheader ??
        message,
    );

  const safeTitle =
    escapeHtml(title);

  const safeMessage =
    formatMessage(
      message,
    );

  const sectionHtml =
    htmlSection
      ? `
        <div
          style="
            margin-top:24px;
          "
        >
          ${htmlSection}
        </div>
      `
      : "";

  const detailsHtml =
    details.length > 0
      ? `
        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            margin-top:24px;
            border-collapse:collapse;
          "
        >
          ${details
            .map(
              (detail) => `
                <tr>
                  <td
                    style="
                      padding:10px 0;
                      border-bottom:1px solid #e8e8ee;
                      font-family:Arial,Helvetica,sans-serif;
                      font-size:13px;
                      line-height:20px;
                      color:#6b6d78;
                    "
                  >
                    ${escapeHtml(
                      detail.label,
                    )}
                  </td>

                  <td
                    align="right"
                    style="
                      padding:10px 0;
                      border-bottom:1px solid #e8e8ee;
                      font-family:Arial,Helvetica,sans-serif;
                      font-size:13px;
                      line-height:20px;
                      font-weight:600;
                      color:#18191f;
                    "
                  >
                    ${escapeHtml(
                      detail.value,
                    )}
                  </td>
                </tr>
              `,
            )
            .join("")}
        </table>
      `
      : "";

  const buttonHtml =
    button
      ? `
        <table
          role="presentation"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            margin-top:28px;
          "
        >
          <tr>
            <td
              style="
                border-radius:8px;
                background:#5b5ef7;
              "
            >
              <a
                href="${escapeAttribute(
                  button.url,
                )}"
                style="
                  display:inline-block;
                  padding:12px 18px;
                  border-radius:8px;
                  background:#5b5ef7;
                  color:#ffffff;
                  font-family:Arial,Helvetica,sans-serif;
                  font-size:13px;
                  font-weight:600;
                  line-height:18px;
                  text-decoration:none;
                "
              >
                ${escapeHtml(
                  button.label,
                )}
              </a>
            </td>
          </tr>
        </table>
      `
      : "";

  const footerHtml =
    footerMessage
      ? `
        <p
          style="
            margin:20px 0 0;
            font-family:Arial,Helvetica,sans-serif;
            font-size:12px;
            line-height:19px;
            color:#777985;
          "
        >
          ${formatMessage(
            footerMessage,
          )}
        </p>
      `
      : "";

  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta
      charset="UTF-8"
    />

    <meta
      name="viewport"
      content="width=device-width,initial-scale=1.0"
    />

    <meta
      name="x-apple-disable-message-reformatting"
    />

    <title>
      ${safeSubject}
    </title>
  </head>

  <body
    style="
      margin:0;
      padding:0;
      width:100%;
      background:#f5f5f8;
      -webkit-text-size-adjust:100%;
      -ms-text-size-adjust:100%;
    "
  >
    <div
      style="
        display:none;
        max-height:0;
        overflow:hidden;
        opacity:0;
        mso-hide:all;
      "
    >
      ${safePreheader}
    </div>

    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="
        width:100%;
        background:#f5f5f8;
      "
    >
      <tr>
        <td
          align="center"
          style="
            padding:28px 14px;
          "
        >
          <table
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              width:100%;
              max-width:620px;
              background:#ffffff;
              border:1px solid #e7e7ed;
              border-radius:12px;
              overflow:hidden;
            "
          >
            <tr>
              <td
                style="
                  padding:22px 24px;
                  border-bottom:1px solid #ececf1;
                  background:#ffffff;
                "
              >
                <a
                  href="${escapeAttribute(
                    BRAND_URL,
                  )}"
                  style="
                    font-family:Arial,Helvetica,sans-serif;
                    font-size:17px;
                    font-weight:700;
                    line-height:22px;
                    color:#18191f;
                    text-decoration:none;
                  "
                >
                  ${BRAND_NAME}
                </a>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:30px 24px 32px;
                "
              >
                <h1
                  style="
                    margin:0;
                    font-family:Arial,Helvetica,sans-serif;
                    font-size:22px;
                    line-height:30px;
                    font-weight:700;
                    color:#18191f;
                  "
                >
                  ${safeTitle}
                </h1>

                <div
                  style="
                    margin-top:14px;
                    font-family:Arial,Helvetica,sans-serif;
                    font-size:14px;
                    line-height:23px;
                    color:#555762;
                  "
                >
                  ${safeMessage}
                </div>

                ${sectionHtml}

                ${detailsHtml}

                ${buttonHtml}

                ${footerHtml}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:18px 24px;
                  border-top:1px solid #ececf1;
                  background:#fafafd;
                "
              >
                <p
                  style="
                    margin:0;
                    font-family:Arial,Helvetica,sans-serif;
                    font-size:11px;
                    line-height:18px;
                    color:#8a8b95;
                  "
                >
                  This is an automated message from
                  ${BRAND_NAME}. Please do not reply
                  directly to this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();

  const text = buildPlainText({
    title,
    message,
    details,
    button,
    footerMessage,
  });

  return {
    html,
    text,
  };
}

function buildPlainText({
  title,
  message,
  details = [],
  button,
  footerMessage,
}: Omit<
  BaseEmailInput,
  "subject" | "preheader"
>) {
  const lines: string[] = [
    BRAND_NAME,
    "",
    title,
    "",
    stripHtml(
      message,
    ),
  ];

  if (details.length) {
    lines.push("");

    for (
      const detail of details
    ) {
      lines.push(
        `${detail.label}: ${detail.value}`,
      );
    }
  }

  if (button) {
    lines.push(
      "",
      `${button.label}: ${button.url}`,
    );
  }

  if (footerMessage) {
    lines.push(
      "",
      stripHtml(
        footerMessage,
      ),
    );
  }

  lines.push(
    "",
    `© ${new Date().getFullYear()} ${BRAND_NAME}.`,
  );

  return lines.join("\n");
}

function formatMessage(
  value: string,
) {
  return escapeHtml(
    value,
  ).replace(
    /\n/g,
    "<br />",
  );
}

function stripHtml(
  value: string,
) {
  return value
    .replace(
      /<br\s*\/?>/gi,
      "\n",
    )
    .replace(
      /<[^>]*>/g,
      "",
    )
    .trim();
}

function escapeHtml(
  value: string,
) {
  return value.replace(
    /[&<>"']/g,
    (character) => {
      switch (
        character
      ) {
        case "&":
          return "&amp;";

        case "<":
          return "&lt;";

        case ">":
          return "&gt;";

        case '"':
          return "&quot;";

        case "'":
          return "&#39;";

        default:
          return character;
      }
    },
  );
}

function escapeAttribute(
  value: string,
) {
  return escapeHtml(
    value,
  );
}