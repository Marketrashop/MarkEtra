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
    title: "Customer Service",
  },
  {
    id: "active-users",
    icon: User,
    value: 800,
    title: "Total Active Users",
  },
  {
    id: "completed-orders",
    icon: List,
    value: 1200,
    title: "Completed Orders",
  },
{
  id: "happy-clients",
  icon: Users,
  value: 5000,
  suffix: "+",
  title: "Our Happy Clients",
},
];