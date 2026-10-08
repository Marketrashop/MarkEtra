import type {
  Metadata,
} from "next";

import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import {
  SecurityPage,
} from "@/components/security";

export const metadata: Metadata = {
  title: "Security",
  description:
    "Manage your password and active sessions.",
};

export default function AdminSecurityPage() {
  return (
<DashboardPageLayout
  environment="admin"
  breadcrumb={[
        {
          label: "Security",
        },
      ]}
    >
      <section
        className="
          py-6
        "
      >
        <SecurityPage />
      </section>
</DashboardPageLayout>
  );
}