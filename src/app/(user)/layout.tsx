import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentSession } from "@/lib/auth/session";

import { DashboardLayout } from "@/components/dashboard";

type UserGroupLayoutProps = {
  children: ReactNode;
};

export default async function UserGroupLayout({
  children,
}: UserGroupLayoutProps) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/");
  }

return (
  <>
    <DashboardLayout
      environment="user"
      user={{
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        email: session.user.email,
        avatarKey: session.user.avatarKey,
      }}
    >
      {children}
    </DashboardLayout>
  </>
);
}