import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import { HelpPage } from "@/components/help";

export default function HelpCenterPage() {
  return (
    <DashboardPageLayout
      environment="user"
      breadcrumb={[
        {
          label: "Help Center",
        },
      ]}
    >
      <HelpPage />
    </DashboardPageLayout>
  );
}