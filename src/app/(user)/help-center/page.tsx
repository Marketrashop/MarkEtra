import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import {
  HelpPage,
  TawkChat,
  ChatLauncher,
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
      <TawkChat
        key="help-center-chat"
      />

      <ChatLauncher />

      <HelpPage />
    </DashboardPageLayout>
  );
}