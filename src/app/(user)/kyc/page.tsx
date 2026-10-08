import type {
  Metadata,
} from "next";

import {
  KycPage,
} from "@/components/kyc";

export const metadata: Metadata = {
  title: "Identity Verification",
  description:
    "Verify your identity to unlock withdrawals and keep your MarkEtra account secure.",
};

export default function Page() {
  return <KycPage />;
}