import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import {
  HelpPage,
  LiveChat,
} from "@/components/help";

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
      <LiveChat />

      <HelpPage />
    </DashboardPageLayout>
  );
}