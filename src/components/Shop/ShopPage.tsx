import {
  DashboardBreadcrumb,
} from "@/components/dashboard";

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

export default function ShopPage({
  environment = "public",
  categoryId = null,
}: ShopPageProps) {
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

            grid

            items-start

            w-full

            max-w-7xl

            gap-8

            px-5

            lg:grid-cols-[minmax(0,1fr)_280px]

            lg:px-8
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
            selectedCategoryId={
              categoryId
            }
          />
        </div>
      </section>
    </main>
  );
}