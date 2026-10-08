import type { ReactNode } from "react";

import { requireAdminSession } from "@/lib/auth/authorization";

import { DashboardLayout } from "@/components/dashboard";

type AdminGroupLayoutProps = {
  children: ReactNode;
};

export default async function AdminGroupLayout({
  children,
}: AdminGroupLayoutProps) {
  const session =
    await requireAdminSession();

  return (
    <DashboardLayout
      environment="admin"
      user={{
        firstName:
          session.user.firstName,
        lastName:
          session.user.lastName,
        email:
          session.user.email,
        avatarKey:
          session.user.avatarKey,
      }}
    >
      {children}
    </DashboardLayout>
  );
}