"use client";

import CTA from "./CTA";
import ContactContent from "./ContactContent";
import ContactHero from "./ContactHero";

export default function ContactPage() {
  return (
    <main>
      <ContactHero />

      <ContactContent />

      <CTA />
    </main>
  );
}