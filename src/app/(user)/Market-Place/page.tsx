import type { Metadata } from "next";

import { ShopPage } from "@/components/Shop";

import {
  getCategoryBySlugService,
  getCategoryService,
} from "@/services/category.service";

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
  const params = await searchParams;
  const selectedCategory = params.category?.trim();

  let categoryId: string | null = null;

  if (selectedCategory) {
    // Dashboard category tiles pass slugs.
    const categoryBySlug =
      await getCategoryBySlugService(selectedCategory);

    if (categoryBySlug) {
      categoryId = categoryBySlug.id;
    } else {
      // Existing sidebar links pass category IDs.
      const categoryById =
        await getCategoryService(selectedCategory);

      categoryId = categoryById?.id ?? null;
    }
  }

  return (
    <ShopPage
      environment="user"
      categoryId={categoryId}
    />
  );
}