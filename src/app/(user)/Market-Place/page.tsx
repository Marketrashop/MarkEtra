import type { Metadata } from "next";

import {
  ShopPage,
} from "@/components/Shop";

export const metadata: Metadata = {
  title: "Store | MarkEtra",

  description:
    "Browse products, discover new arrivals, and shop directly from your MarkEtra account.",
};

type StoreRouteProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function StorePage({
  searchParams,
}: StoreRouteProps) {
  const params =
    await searchParams;

  return (
    <ShopPage
      environment="user"
      categoryId={
        params.category ?? null
      }
    />
  );
}