import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategoryBySlug,
  getCategoryProductCounts,
  getCategoryStats,
  getCategoryWithProducts,
  getStorefrontCategories,
  listCategories,
  listCategoryOptions,
  updateCategory,
} from "@/repositories/category.repository";

import type {
  CategoryFilters,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/types/category.types";

export async function createCategoryService(
  data: CreateCategoryInput,
) {
  const existingCategory = await getCategoryBySlug(
    data.slug,
  );

  if (existingCategory) {
    throw new Error(
      "A category with this slug already exists.",
    );
  }

  return createCategory(data);
}

export async function updateCategoryService(
  id: string,
  data: UpdateCategoryInput,
) {
  const category = await getCategoryById(id);

  if (!category) {
    throw new Error("Category not found.");
  }

  if (
    data.slug &&
    data.slug !== category.slug
  ) {
    const existingCategory =
      await getCategoryBySlug(data.slug);

    if (
      existingCategory &&
      existingCategory.id !== id
    ) {
      throw new Error(
        "A category with this slug already exists.",
      );
    }
  }

  return updateCategory(id, data);
}

export async function deleteCategoryService(
  id: string,
) {
  const category = await getCategoryById(id);

  if (!category) {
    throw new Error("Category not found.");
  }

  const counts =
    await getCategoryProductCounts(id);

  if (counts.total > 0) {
    throw new Error(
      "Cannot delete a category that contains products.",
    );
  }

  return deleteCategory(id);
}

export async function getCategoryService(
  id: string,
) {
  return getCategoryById(id);
}

export async function getCategoryBySlugService(
  slug: string,
) {
  return getCategoryBySlug(slug);
}

export async function listCategoriesService(
  filters?: CategoryFilters,
) {
  return listCategories(filters);
}

export async function listCategoryOptionsService() {
  return listCategoryOptions();
}

export async function getCategoryStatsService() {
  return getCategoryStats();
}

export async function getCategoryWithProductsService(
  id: string,
) {
  return getCategoryWithProducts(id);
}

export async function getCategoryProductCountsService(
  categoryId: string,
) {
  return getCategoryProductCounts(categoryId);
}

export async function getStorefrontCategoriesService() {
  return getStorefrontCategories();
}