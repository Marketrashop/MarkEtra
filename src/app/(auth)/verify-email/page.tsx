import type { Metadata } from "next";

import {
  AuthLayout,
} from "@/components/auth";

import VerifyEmailPageClient from "./VerifyEmailPageClient";

export const metadata: Metadata = {
  title: "Verify Your Email",

  description:
    "Verify your email address to activate your MarkEtra account.",

  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <VerifyEmailPageClient />
    </AuthLayout>
  );
}