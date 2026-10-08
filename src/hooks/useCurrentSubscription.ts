"use client";

import { useSubscription } from "@/context/SubscriptionContext";

export function useCurrentSubscription() {
  return useSubscription();
}