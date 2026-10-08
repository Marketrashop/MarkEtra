import PageBreadcrumb from "@/components/common/PageBreadcrumb";

import {
  DashboardBreadcrumb,
} from "@/components/dashboard";

import {
  ProductTabs,
} from "@/components/Product";

import ProductPurchaseSection from "@/components/Product/ProductPurchaseSection";

import StoreProducts from "@/components/Shop/StoreProducts";

import type {
  ProductDetails,
} from "@/lib/products/product.types";

import {
  getRelatedProducts,
} from "@/lib/products/product.service";

import type {
  AppEnvironment,
} from "@/types/environment";

type ProductPageProps = {
  product: ProductDetails;

  environment?: AppEnvironment;
};

export default async function ProductPage({
  product,
  environment = "public",
}: ProductPageProps) {
const relatedProducts =
  await getRelatedProducts(
    product.id,
    product.categories[0]?.category.id ??
      null,
  );

  return (
    <main
      data-product-environment={
        environment
      }
    >
      <section
        className="
          bg-[var(--services-hero-bg)]
          transition-colors
          duration-300
        "
      >
        {environment ===
        "public" ? (
          <div
            className="
              mx-auto
              max-w-7xl
              px-5
              py-10
              lg:px-8
              md:py-12
            "
          >
            <PageBreadcrumb
              items={[
                {
                  label: "Shop",
                  href: "/shop",
                },
                {
                  label:
                    product.name,
                },
              ]}
            />

<h1
  className="
    mt-4
    text-center
    text-[22px]
    font-extrabold
    leading-tight
    text-[var(--services-hero-title)]
    sm:text-[26px]
    md:text-[40px]
    lg:text-[44px]
  "
>
              {product.name}
            </h1>
          </div>
        ) : (
          <DashboardBreadcrumb
            environment="user"
            items={[
              {
                label: "Market Place",
                href: "/Market-Place",
              },
              {
                label:
                  product.name,
              },
            ]}
          />
        )}
      </section>

      <section
        className={
          environment ===
          "public"
            ? `
                bg-[var(--background)]
                py-10
                transition-colors
                duration-300
                lg:py-14
              `
            : `
                bg-[var(--background)]
                pt-8
                pb-10
                transition-colors
                duration-300
                lg:pt-8
                lg:pb-14
              `
        }
      >
<ProductPurchaseSection
  product={product}
/>

        <div
          className="
            mx-auto
            mt-12
            max-w-7xl
            px-5
            lg:mt-14
            lg:px-8
          "
        >
          <ProductTabs
            description={
              product.description
            }
            reviews={
              product.reviews
            }
          />
        </div>
      </section>

      <StoreProducts
        products={relatedProducts}
        environment={
          environment
        }
        variant="compact"
        eyebrow="Related Products"
        title="You May Also Like"
        subtitle="Discover similar products that other shoppers are loving."
      />
    </main>
  );
}