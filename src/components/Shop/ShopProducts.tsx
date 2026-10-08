import StoreProducts from "@/components/Shop/StoreProducts";

import {
  getPublishedProducts,
} from "@/lib/products/product.service";

import type {
  AppEnvironment,
} from "@/types/environment";

type ShopProductsProps = {
  environment: AppEnvironment;

  categoryId?: string | null;
};

export default async function ShopProducts({
  environment,
  categoryId = null,
}: ShopProductsProps) {
  const products =
    await getPublishedProducts(
      categoryId,
    );

  return (
    <StoreProducts
      products={products}
      environment={environment}
      variant="compact"
      showHeading={false}
      useContainer={false}
      gridClassName="
        grid
        grid-cols-2
        gap-4

        md:grid-cols-3

        xl:grid-cols-4
      "
    />
  );
}