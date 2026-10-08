import type {
  Metadata,
} from "next";


import {
  DepositPage,
} from "@/components/Deposit";


export const metadata: Metadata = {
  title: "Deposit",
  description:
    "Deposit funds into your MarkEtra wallet using cryptocurrency.",
};


export default function Page() {
  return <DepositPage />;
}