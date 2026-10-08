import type {
  Metadata,
} from "next";

import AddressesPage from "@/components/Addresses/AddressesPage";

export const metadata: Metadata = {
  title: "Addresses",
  description:
    "Manage your saved delivery addresses.",
};

export default function Page() {
  return <AddressesPage />;
}