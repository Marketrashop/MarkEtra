import "server-only";

import { getCurrentSession } from "./session";

export async function requireAdmin() {
  const session = await getCurrentSession();

  if (!session) {
    throw new Error("UNAUTHENTICATED");
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  return session;
}