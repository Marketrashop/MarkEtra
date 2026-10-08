import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import { AdminPageHeader } from "@/components/admin";

import {
  AdminAffiliateProducts,
  AdminOverview,
  AdminQuickActions,
  AdminRecentActivity,
  AdminStats,
} from "@/components/admin/dashboard";

import { getAdminDashboard } from "@/lib/admin/dashboard/get-admin-dashboard";

export default async function AdminDashboardPage() {
  const data =
    await getAdminDashboard();

  return (
    <DashboardPageLayout
      environment="admin"
      breadcrumb={[
        {
          label: "Dashboard",
        },
      ]}
    >
      <div
        className="
          space-y-8
        "
      >
        <AdminPageHeader
          title="Dashboard"
          description="Monitor your platform and review pending administrative activity."
        />

        <AdminStats
          users={data.users}
          products={data.products}
          affiliateProducts={
            data.affiliateProducts
          }
          orders={data.orders}
        />

        <div
          className="
            grid
            gap-6
            xl:grid-cols-[1.7fr_1fr]
          "
        >
          <AdminOverview
            pendingUsers={
              data.pendingUsers
            }
            pendingDeposits={
              data.pendingDeposits
            }
            pendingWithdrawals={
              data.pendingWithdrawals
            }
            pendingAffiliateProducts={
              data.pendingAffiliateProducts
            }
          />

          <AdminQuickActions />
        </div>

        <div
          className="
            grid
            gap-6
            xl:grid-cols-[1.4fr_1fr]
          "
        >
          <AdminAffiliateProducts
            listings={
              data.affiliateListings
            }
          />

          <AdminRecentActivity
            activities={
              data.recentActivity
            }
          />
        </div>
      </div>
    </DashboardPageLayout>
  );
}