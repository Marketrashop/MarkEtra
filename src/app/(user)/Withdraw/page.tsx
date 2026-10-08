import type {
  Metadata,
} from "next";

import {
  WithdrawPage,
} from "@/components/Withdraw";

export const metadata: Metadata = {
  title: "Withdraw",
  description:
    "Withdraw funds from your MarkEtra wallet to a cryptocurrency wallet or bank account.",
};

export default function Page() {
  return <WithdrawPage />;
}