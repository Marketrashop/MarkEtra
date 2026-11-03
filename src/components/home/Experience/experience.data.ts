import {
  Headset,
  List,
  Users,
  User,
} from "lucide-react";

import { ExperienceItem } from "./experience.types";

export const experienceData: ExperienceItem[] = [
  {
    id: "customer-service",
    icon: Headset,
    value: 24,
    title: "Customer Support Agents",
  },
  {
    id: "active-users",
    icon: User,
    value: 18500,
    suffix: "+",
    title: "Active Customers",
  },
  {
    id: "completed-orders",
    icon: List,
    value: 67000,
    suffix: "+",
    title: "Orders Delivered",
  },
  {
    id: "happy-clients",
    icon: Users,
    value: 14000,
    suffix: "+",
    title: "Happy Customers",
  },
];