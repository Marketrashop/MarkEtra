"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import {
  CategoriesPage,
} from "@/components/admin/categories";

import type {
  ProductCategory,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/types/category.types";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/admin-category.client";

export default function AdminCategoriesRoute() {
  const [
    categories,
    setCategories,
  ] = useState<ProductCategory[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    creating,
    setCreating,
  ] = useState(false);

  const [
    updating,
    setUpdating,
  ] = useState(false);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const loadCategories =
    useCallback(async () => {
      try {
        setLoading(true);

        const data =
          await getCategories();

        setCategories(data);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load categories.",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  async function handleCreate(
    values: CreateCategoryInput,
  ) {
    try {
      setCreating(true);

      const category =
        await createCategory(
          values,
        );

      setCategories(
        (current) => [
          category,
          ...current,
        ],
      );

      toast.success(
        "Category created.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create category.",
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(
    categoryId: string,
    values: UpdateCategoryInput,
  ) {
    try {
      setUpdating(true);

      const category =
        await updateCategory(
          categoryId,
          values,
        );

      setCategories(
        (current) =>
          current.map((item) =>
            item.id ===
            category.id
              ? category
              : item,
          ),
      );

      toast.success(
        "Category updated.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update category.",
      );
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete(
    categoryId: string,
  ) {
    try {
      setDeleting(true);

      await deleteCategory(
        categoryId,
      );

      setCategories(
        (current) =>
          current.filter(
            (category) =>
              category.id !==
              categoryId,
          ),
      );

      toast.success(
        "Category deleted.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete category.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <DashboardPageLayout
      environment="admin"
      breadcrumb={[
        {
          label:
            "Categories",
        },
      ]}
    >
      <section className="py-6">
<CategoriesPage
  categories={categories}
  loading={loading}
/>
      </section>
    </DashboardPageLayout>
  );
}