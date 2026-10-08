export type ExperienceOptions = {
  title: string;
  description: string;
  status: string;
  onComplete?: () => void;
};

export type ExperienceState =
  ExperienceOptions & {
    id: string;
    open: boolean;
  };

export type ExperienceContextValue = {
  experience:
    | ExperienceState
    | null;

  showExperience: (
    options: ExperienceOptions,
  ) => void;

  hideExperience: () => void;
};