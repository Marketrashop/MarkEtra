const resendApiKey = process.env.RESEND_API_KEY;
const mailFrom = process.env.MAIL_FROM;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

if (!resendApiKey) {
  throw new Error("Missing RESEND_API_KEY environment variable");
}

if (!mailFrom) {
  throw new Error("Missing MAIL_FROM environment variable");
}

if (!appUrl) {
  throw new Error("Missing NEXT_PUBLIC_APP_URL environment variable");
}

export const MAIL_CONFIG = {
  resendApiKey,
  mailFrom,
  appUrl,
  appName: "MarkEtra",
} as const;
