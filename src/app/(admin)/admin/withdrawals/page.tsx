import type { Metadata } from "next";

import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import WithdrawalsPage from "@/components/admin/withdrawals/WithdrawalsPage";

export const metadata: Metadata = {
  title: "Withdrawal Requests",
  description:
    "Review, approve, or reject withdrawal requests from users.",
};

export default function AdminWithdrawalsPage() {
  return (
<DashboardPageLayout
  environment="admin"
  breadcrumb={[
        {
          label: "Withdrawal Requests",
        },
      ]}
    >
      <section className="py-6">
        <WithdrawalsPage />
      </section>
</DashboardPageLayout>
  );
}