import type { Metadata } from "next";

import { PlansPage } from "@/components/Plans";

export const metadata: Metadata = {
  title: "Membership Plans | MarkEtra",

  description:
    "Explore MarkEtra membership plans designed to help you sell smarter, earn more, and grow your online business with powerful tools and dedicated support.",
};

export default function Plans() {
  return <PlansPage />;
}