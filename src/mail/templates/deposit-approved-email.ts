import {
  buildBaseEmail,
} from "./base-email";

type DepositApprovedEmailInput = {
  firstName: string;
  amount: string;
};

export function buildDepositApprovedEmail({
  firstName,
  amount,
}: DepositApprovedEmailInput) {
  const subject =
    "Your deposit has been approved";

  const email =
    buildBaseEmail({
      subject,

      preheader:
        "Your deposit has been approved and credited to your wallet.",

      title:
        "Deposit approved",

      message:
        `Hello ${firstName}, your deposit of $${amount} has been approved and credited to your wallet.`,

      button: {
        label:
          "View your wallet",

        url:
          `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/Wallet`,
      },

      footerMessage:
        "You can now log in to your account to view your updated wallet balance. Thank you for choosing MarkEtra.",
    });

  const text = [
    `Hello ${firstName},`,
    "",
    `Your deposit of $${amount} has been approved and credited to your wallet.`,
    "",
    "You can now log in to your account to view your updated wallet balance.",
    "",
    "Thank you for choosing MarkEtra.",
  ].join("\n");

  return {
    subject,
    html:
      email.html,
    text,
  };
}