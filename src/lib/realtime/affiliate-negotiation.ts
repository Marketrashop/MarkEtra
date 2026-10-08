import { InferRealtimeEvents, Realtime } from "@upstash/realtime";
import { z } from "zod/v4";

import { redis } from "./redis";
import { getAffiliateNegotiationChannel } from "./affiliate-negotiation-channel";

const schema = {
  affiliate: {
    negotiationMessage: z.object({
      id: z.string(),
      interestId: z.string(),
      senderUserId: z.string(),
      message: z.string(),
      offeredPrice: z.number().nullable(),
      createdAt: z.string(),
      senderType: z.enum([
        "USER",
        "TEST_BUYER",
      ]),
      senderName: z.string(),
      interestStatus: z.string(),
    }),

    negotiationTyping: z.object({
      interestId: z.string(),
      senderUserId: z.string(),
      senderType: z.enum([
        "USER",
        "TEST_BUYER",
      ]),
      senderName: z.string(),
      isTyping: z.boolean(),
    }),
  },
};

export const realtime = new Realtime({
  schema,
  redis,
});

export type RealtimeEvents =
  InferRealtimeEvents<typeof realtime>;

export { getAffiliateNegotiationChannel };