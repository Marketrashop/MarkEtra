import type {
  Metadata,
} from "next";

import CheckoutPage from "@/components/Checkout/CheckoutPage";

export const dynamic =
  "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your MarkEtra order securely using your wallet balance or cryptocurrency.",
};

export default function Page() {
  return (
    <CheckoutPage />
  );
}