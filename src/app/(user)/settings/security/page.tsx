import type {
  Metadata,
} from "next";

import {
  DashboardPage,
} from "@/components/dashboard";

import {
  SecurityPage,
} from "@/components/security";

export const metadata: Metadata = {
  title: "Security",
  description:
    "Manage your password and active sessions.",
};

export default function Page() {
  return (
    <DashboardPage
      environment="user"
      breadcrumb={[
        {
          label: "Security",
        },
      ]}
      containerClassName="
        pb-16
        lg:pb-24
      "
    >
      <SecurityPage />
    </DashboardPage>
  );
}