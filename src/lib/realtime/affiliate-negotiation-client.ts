"use client";

import { createRealtime } from "@upstash/realtime/client";

import type { RealtimeEvents } from "@/lib/realtime/affiliate-negotiation";

export const { useRealtime } =
  createRealtime<RealtimeEvents>();