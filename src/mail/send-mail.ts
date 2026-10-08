import { resend } from "./resend";
import { MAIL_CONFIG } from "./config";
import type {
  SendMailInput,
  SendMailResult,
} from "./types";

export async function sendMail(
  input: SendMailInput,
): Promise<SendMailResult> {
  const {
    data,
    error,
  } =
    await resend.emails.send({
      from:
        MAIL_CONFIG.mailFrom,

      to: input.to,

      subject:
        input.subject,

      html:
        input.html,

      ...(input.text
        ? {
            text:
              input.text,
          }
        : {}),
    });

  if (error) {
    throw new Error(
      `Email delivery failed: ${error.message}`,
    );
  }

  if (!data?.id) {
    throw new Error(
      "Email delivery failed: Resend returned no message ID",
    );
  }

  return {
    id: data.id,
  };
}
