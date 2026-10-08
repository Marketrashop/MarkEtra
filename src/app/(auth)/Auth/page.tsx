import type { Metadata } from "next";

import AuthPageClient from "./AuthPageClient";

export const metadata: Metadata = {
  title: "Login or Create Account",
  description:
    "Sign in to your MarkEtra account or create a new account to discover winning products, manage your affiliate business, and grow with confidence.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthPage() {
  return <AuthPageClient />;
}