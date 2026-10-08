import "server-only";

import { getCurrentSession } from "./session";

export async function requireUser() {
  const session =
    await getCurrentSession();

  if (!session) {
    throw new Error(
      "UNAUTHENTICATED",
    );
  }

  return session;
}