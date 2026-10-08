import {
  listProducts,
} from "@/repositories/product.repository";

import type {
  ProductFilters,
} from "@/types/product.types";

export async function searchProductsService(
  query: string,
  filters?: Omit<ProductFilters, "search">,
) {
  return listProducts({
    ...filters,
    search: query,
  });
}