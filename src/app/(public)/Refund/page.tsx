import type { Metadata } from "next";

import { RefundPolicyPage } from "@/components/RefundPolicy";

export const metadata: Metadata = {
  title: "Refund Policy | MarkEtra",

  description:
    "Read the MarkEtra Refund Policy to understand our refund eligibility, digital product policy, and how approved refunds are processed.",
};

export default function RefundPolicy() {
  return <RefundPolicyPage />;
}