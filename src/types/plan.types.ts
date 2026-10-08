export type PlanStatus =
  | "ACTIVE"
  | "INACTIVE";

export type SubscriptionPlan = {
  id: string;

  name: string;

  slug: string;

  description: string | null;

  price: number;

  commissionRate: number;

  maxPublishedProducts: number;

  priorityLevel: number;

  badgeName: string;

  badgeColor: string;

  durationInDays: number;

  isActive: boolean;

  sortOrder: number;

  createdAt: string;

  updatedAt: string;
};

export type CreatePlanInput = {
  name: string;

  slug: string;

  description?: string;

  price: number;

  commissionRate: number;

  maxPublishedProducts: number;

  priorityLevel: number;

  badgeName: string;

  badgeColor: string;

  durationInDays: number;

  isActive: boolean;

  sortOrder: number;
};

export type UpdatePlanInput =
  Partial<CreatePlanInput>;

export type PlanListResponse = {
  plans: SubscriptionPlan[];
};

export type PlanResponse = {
  plan: SubscriptionPlan;
};