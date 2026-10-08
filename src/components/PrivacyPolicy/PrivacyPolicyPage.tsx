"use client";

import CTA from "./CTA";
import PrivacyPolicyContent from "./PrivacyPolicyContent";
import PrivacyPolicyHero from "./PrivacyPolicyHero";

export default function PrivacyPolicyPage() {
  return (
    <main>
      <PrivacyPolicyHero />

      <PrivacyPolicyContent />

      <CTA />
    </main>
  );
}