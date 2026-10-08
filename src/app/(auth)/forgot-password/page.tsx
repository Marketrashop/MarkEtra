import type { Metadata } from "next";

import ForgotPasswordPageClient from "./ForgotPasswordPageClient";

export const metadata: Metadata = {
  title: "Forgot Password",

  description:
    "Reset your MarkEtra account password securely.",

  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageClient />;
}