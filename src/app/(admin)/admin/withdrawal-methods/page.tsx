import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import WithdrawalMethodsPage from "@/components/admin/withdrawal-methods/WithdrawalMethodsPage";

export default function AdminWithdrawalMethodsPage() {
  return (
<DashboardPageLayout
  environment="admin"
  breadcrumb={[
        {
          label: "Withdrawal Methods",
        },
      ]}
    >
      <section className="py-6">
        <WithdrawalMethodsPage />
      </section>
  </DashboardPageLayout>
  );
}