import type { Metadata } from "next";

import ResetPasswordPageClient from "./ResetPasswordPageClient";

export const metadata: Metadata = {
  title: "Reset Password",

  description:
    "Create a new password for your MarkEtra account.",

  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordPage() {
  return <ResetPasswordPageClient />;
}