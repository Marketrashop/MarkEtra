"use client";

import CTA from "./CTA";
import RefundPolicyContent from "./RefundPolicyContent";
import RefundPolicyHero from "./RefundPolicyHero";

export default function RefundPolicyPage() {
  return (
    <main>
      <RefundPolicyHero />

      <RefundPolicyContent />

      <CTA />
    </main>
  );
}