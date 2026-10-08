import {
  redirect,
} from "next/navigation";

import {
  getCurrentSession,
} from "@/lib/auth/session";

import {
  getCurrentSubscription,
} from "@/repositories/subscription.repository";

import AffiliatePageClient from "./AffiliatePageClient";

export default async function AffiliatePage() {
  const session =
    await getCurrentSession();

  if (!session) {
    redirect(
      "/Auth?redirect=/affiliate",
    );
  }

  const subscription =
    await getCurrentSubscription(
      session.user.id,
    );

  if (!subscription) {
    redirect(
      "/plans",
    );
  }

  return (
    <AffiliatePageClient />
  );
}