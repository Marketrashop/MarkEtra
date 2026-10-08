import {
  buildBaseEmail,
} from "./base-email";

type VerificationEmailOptions = {
  firstName: string;

  verificationUrl: string;
};

export function buildVerificationEmail({
  firstName,
  verificationUrl,
}: VerificationEmailOptions) {
  const subject =
    "Verify your MarkEtra account";

  const email =
    buildBaseEmail({
      subject,

      preheader:
        "Verify your MarkEtra account to activate your account.",

      title:
        `Welcome to MarkEtra, ${firstName}`,

      message:
        "Thanks for creating your MarkEtra account. Please verify your email address to activate your account.",

      button: {
        label:
          "Verify my email",

        url:
          verificationUrl,
      },

      footerMessage:
        "This verification link will expire in 30 minutes. If you did not create a MarkEtra account, you can safely ignore this email.",
    });

  const text = [
    `Hi ${firstName},`,
    "",
    "Welcome to MarkEtra.",
    "",
    "Please verify your email address by visiting the link below:",
    "",
    verificationUrl,
    "",
    "This verification link will expire in 30 minutes.",
    "",
    "If you did not create a MarkEtra account, you can safely ignore this email.",
    "",
    "MarkEtra",
  ].join("\n");

  return {
    subject,
    html:
      email.html,
    text,
  };
}