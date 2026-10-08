import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import AffiliateTestBuyersPage from "@/components/admin/affiliate-test-buyers/AffiliateTestBuyersPage";

import { requireAdmin } from "@/lib/auth/admin";

export default async function AdminAffiliateTestBuyersRoute() {
  await requireAdmin();

  return (
    <DashboardPageLayout
      environment="admin"
      breadcrumb={[
        {
          label: "Affiliate Products",
          href: "/admin/affiliate",
        },
        {
          label: "Test Buyers",
        },
      ]}
    >
      <section
        className="
          py-4
          sm:py-5
        "
      >
        <AffiliateTestBuyersPage />
      </section>
    </DashboardPageLayout>
  );
}