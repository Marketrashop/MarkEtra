"use client";

import { Container } from "@/components/layout";

import {
  useCurrentSubscription,
} from "@/hooks/useCurrentSubscription";

import PricingPlanCard from "./PricingPlanCard";

import {
  PRICING_GRID,
  PRICING_SECTION_Y_PADDING,
} from "./pricingPlans.constants";

import { pricingPlans } from "./pricingPlans.data";

export default function PricingPlans() {
  const {
    subscription,
    loading,
  } = useCurrentSubscription();

  const currentPlanId =
    subscription?.planId ?? null;

  return (
    <section
      className={
        PRICING_SECTION_Y_PADDING
      }
      style={{
        background:
          "var(--pricing-bg)",
      }}
    >
      <Container>
        {/* Section Heading */}
        <div
          className="
            mx-auto
            mb-12
            max-w-[820px]
            text-center
          "
        >
          <span
            className="
              inline-block
              text-[18px]
              font-extrabold
              text-[#5658EC]
              sm:text-[20px]
            "
          >
            Affordable Pricing
          </span>

          <h2
            className="
              mt-4
              text-[30px]
              font-extrabold
              leading-[1.1]
              text-[var(--foreground)]
              sm:text-[36px]
              lg:text-[40px]
            "
          >
            Seller Memberships
          </h2>

          <p
            className="
              mx-auto
              mt-5
              max-w-[720px]
              text-[15px]
              leading-7
              text-[var(--foreground-muted)]
              sm:text-[16px]
            "
          >
            Boost Your Earnings, Amplify Your
            Influence: Join Our Affiliate
            Membership for Lucrative Partnerships
            and Explosive Marketing Opportunities.
          </p>
        </div>

        {/* Pricing Cards */}
        <div
          className={PRICING_GRID}
        >
          {pricingPlans.map(
            (plan) => (
              <PricingPlanCard
                key={plan.id}
                plan={plan}
                current={
                  !loading &&
                  currentPlanId ===
                    plan.id
                }
              />
            ),
          )}
        </div>
      </Container>
    </section>
  );
}