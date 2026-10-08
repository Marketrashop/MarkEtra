import type { Metadata } from "next";

import {
  ShopPage,
} from "@/components/Shop";

export const metadata: Metadata = {
  title: "Store | MarkEtra",

  description:
    "Browse our collection of carefully selected products. Discover quality items with secure shopping and exceptional value.",
};

type ShopRouteProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function Shop({
  searchParams,
}: ShopRouteProps) {
  const params =
    await searchParams;

  return (
    <ShopPage
      environment="public"
      categoryId={
        params.category ?? null
      }
    />
  );
}