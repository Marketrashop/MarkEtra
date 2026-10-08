import { ReactNode } from "react";

export type FAQItem = {
  id: string;
  question: string;
  answer: ReactNode;
  defaultOpen?: boolean;
};