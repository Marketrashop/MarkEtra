import type { Metadata } from "next";

import { PrivacyPolicyPage } from "@/components/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy | MarkEtra",

  description:
    "Learn how MarkEtra collects, uses, stores, and protects your personal information when you use our website, products, and services.",
};

export default function PrivacyPolicy() {
  return <PrivacyPolicyPage />;
}