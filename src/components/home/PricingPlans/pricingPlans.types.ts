export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  billing: string;
  features: string[];
  buttonText: string;
  featured?: boolean;
};