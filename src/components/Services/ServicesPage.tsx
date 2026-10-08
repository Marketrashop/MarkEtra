"use client";

import CTA from "./CTA";
import HowWeHelp from "./HowWeHelp";
import ServicesHero from "./ServicesHero";
import WhatWeDo from "./WhatWeDo";
import WhyChooseMarkEtra from "./WhyChooseMarkEtra";

export default function ServicesPage() {
  return (
    <main
      className="
        overflow-x-hidden

        bg-[var(--background)]
      "
    >
      <ServicesHero />

      <WhatWeDo />

      <HowWeHelp />

      <WhyChooseMarkEtra />

      <CTA />
    </main>
  );
}