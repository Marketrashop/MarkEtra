import {
  DashboardBreadcrumb,
} from "@/components/dashboard";

import { getStorefrontCategoriesService } from "@/services/category.service";

import MobileShopFilters from "./MobileShopFilters";
import ShopHero from "./ShopHero";
import ShopProducts from "./ShopProducts";
import ShopSidebar from "./ShopSidebar";

import type {
  AppEnvironment,
} from "@/types/environment";

type ShopPageProps = {
  environment?: AppEnvironment;

  categoryId?: string | null;
};

export default async function ShopPage({
  environment = "public",
  categoryId = null,
}: ShopPageProps) {
  const categories =
    await getStorefrontCategoriesService();

  return (
    <main
      data-shop-environment={
        environment
      }
    >
      {environment ===
      "public" ? (
        <ShopHero
          environment="public"
        />
      ) : (
        <DashboardBreadcrumb
          environment="user"
          items={[
            {
              label: "Market-Place",
            },
          ]}
        />
      )}

      <section
        className={
          environment === "public"
            ? `
                bg-[var(--background)]
                pt-6
                pb-8
                transition-colors
                duration-300
                sm:pt-8
                sm:pb-10
                lg:pt-10
                lg:pb-12
              `
            : `
                bg-[var(--background)]
                pt-8
                pb-16
                transition-colors
                duration-300
                sm:pb-20
                lg:pb-24
              `
        }
      >
        <div
          className="
            mx-auto

            w-full

            max-w-7xl

            px-5

            lg:px-8
          "
        >
          {/* Mobile only (hidden on lg inside the component).
              Must sit outside the grid so its sticky bar spans the full list. */}
          <MobileShopFilters
            categories={categories}
            selectedCategoryId={
              categoryId
            }
          />

          <div
            className="
              mt-5

              grid

              items-start

              gap-8

              lg:mt-0

              lg:grid-cols-[minmax(0,1fr)_280px]
            "
          >
            <ShopProducts
              environment={
                environment
              }

              categoryId={
                categoryId
              }
            />

            <ShopSidebar
              categories={
                categories
              }
              selectedCategoryId={
                categoryId
              }
            />
          </div>
        </div>
      </section>
    </main>
  );
}