import { LucideIcon } from "lucide-react";

export type ExperienceItem = {
  id: string;
  icon: LucideIcon;
  value: number;
  suffix?: string;
  title: string;
};