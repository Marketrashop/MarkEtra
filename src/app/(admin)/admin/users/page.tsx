import type { Metadata } from "next";

import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import { UserManagementPage } from "@/components/admin/users";

export const metadata: Metadata = {
  title: "User Management",
  description:
    "Manage user accounts, account status, and deletion requests.",
};

export default function AdminUsersPage() {
  return (
<DashboardPageLayout
  environment="admin"
  breadcrumb={[
        {
          label: "Users",
        },
      ]}
    >
      <section className="py-6">
        <div
          className="
            flex
            flex-col
            gap-[var(--admin-page-gap)]
          "
        >
          <UserManagementPage />
        </div>
      </section>
</DashboardPageLayout>
  );
}