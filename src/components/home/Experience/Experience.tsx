"use client";

import { Container } from "@/components/layout";

import ExperienceCard from "./ExperienceCard";
import {
  EXPERIENCE_SECTION_Y_PADDING,
} from "./experience.constants";
import { experienceData } from "./experience.data";

export default function Experience() {
  return (
    <section
      className={EXPERIENCE_SECTION_Y_PADDING}
      style={{
        background: "var(--experience-bg)",
      }}
    >
      <Container>
        <div
          className="
            grid
            gap-6

            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          {experienceData.map((item) => (
            <ExperienceCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}