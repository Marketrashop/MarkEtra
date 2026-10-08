import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductBySlug,
  getProductStats,
  listFeaturedProducts,
  listProducts,
  listRelatedProducts,
  updateProduct,
} from "@/repositories/product.repository";

import type {
  Prisma,
} from "../../generated/prisma/client";

import type {
  ProductFilters,
} from "@/types/product.types";

export async function createProductService(
  data: Prisma.ProductCreateInput,
) {
  return createProduct(data);
}

export async function updateProductService(
  id: string,
  data: Prisma.ProductUpdateInput,
) {
  return updateProduct(id, data);
}

export async function deleteProductService(
  id: string,
) {
  return deleteProduct(id);
}

export async function getProductByIdService(
  id: string,
) {
  return getProductById(id);
}

export async function getProductBySlugService(
  slug: string,
) {
  return getProductBySlug(slug);
}

export async function listProductsService(
  filters?: ProductFilters,
) {
  return listProducts(filters);
}

export async function listFeaturedProductsService() {
  return listFeaturedProducts();
}

export async function listRelatedProductsService(
  categoryId: string,
  productId: string,
) {
  return listRelatedProducts(
    categoryId,
    productId,
  );
}

export async function getProductStatsService() {
  return getProductStats();
}