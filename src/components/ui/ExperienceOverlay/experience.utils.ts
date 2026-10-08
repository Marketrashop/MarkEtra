import type {
  ExperienceOptions,
} from "./experience.types";

const EXPERIENCE_STORAGE_KEY =
  "marketra:pending-experience";

export function savePendingExperience(
  experience: ExperienceOptions,
) {
  sessionStorage.setItem(
    EXPERIENCE_STORAGE_KEY,
    JSON.stringify(
      experience,
    ),
  );
}

export function getPendingExperience() {
  const raw =
    sessionStorage.getItem(
      EXPERIENCE_STORAGE_KEY,
    );

  if (!raw) {
    return null;
  }

  sessionStorage.removeItem(
    EXPERIENCE_STORAGE_KEY,
  );

  try {
    return JSON.parse(
      raw,
    ) as ExperienceOptions;
  } catch {
    return null;
  }
}