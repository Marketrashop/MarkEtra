"use client";

import PricingPlans from "@/components/home/PricingPlans";

import CTA from "./CTA";
import PlansFAQ from "./PlansFAQ";

export default function PlansPage() {
  return (
    <main>
      <PricingPlans />

      <PlansFAQ />

      <CTA />
    </main>
  );
}