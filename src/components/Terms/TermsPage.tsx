"use client";

import CTA from "./CTA";
import TermsContent from "./TermsContent";
import TermsHero from "./TermsHero";

export default function TermsPage() {
  return (
    <main>
      <TermsHero />

      <TermsContent />

      <CTA />
    </main>
  );
}