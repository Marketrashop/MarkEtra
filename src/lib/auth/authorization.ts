import "server-only";

import { redirect } from "next/navigation";

import { getCurrentSession } from "@/lib/auth/session";

export async function requireAdminSession() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/Auth");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/Dashboard");
  }

  return session;
}