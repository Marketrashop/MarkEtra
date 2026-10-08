"use client";

import { useEffect, useState } from "react";

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

import CategoriesToolbar from "./CategoriesToolbar";
import CategoriesTable from "./CategoriesTable";
import CreateCategoryDialog from "./CreateCategoryDialog";
import EditCategoryDialog from "./EditCategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

import { toast } from "sonner";

type CategoriesPageProps = {
  categories: ProductCategory[];
  loading?: boolean;
};

export default function CategoriesPage({
  categories: initialCategories,
  loading = false,
}: CategoriesPageProps) {
  const [categories, setCategories] =
    useState(initialCategories);

  const [createOpen, setCreateOpen] =
    useState(false);

  const [
    editingCategory,
    setEditingCategory,
  ] = useState<ProductCategory | null>(
    null,
  );

  const [
    deletingCategory,
    setDeletingCategory,
  ] = useState<ProductCategory | null>(
    null,
  );

  const [busy, setBusy] =
    useState(false);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  async function refresh() {
    const data =
      await getCategories();

    setCategories(data);
  }

  async function handleCreate(
    values: CreateCategoryInput,
  ) {
    setBusy(true);

    try {
      await createCategory(values);

      await refresh();

      setCreateOpen(false);

      toast.success(
        `Category "${values.name}" created successfully.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create category.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate(
    values: UpdateCategoryInput,
  ) {
    if (!editingCategory) {
      return;
    }

    const categoryName =
      values.name ??
      editingCategory.name;

    setBusy(true);

    try {
      await updateCategory(
        editingCategory.id,
        values,
      );

      await refresh();

      setEditingCategory(null);

      toast.success(
        `Category "${categoryName}" updated successfully.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update category.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!deletingCategory) {
      return;
    }

    const categoryName =
      deletingCategory.name;

    setBusy(true);

    try {
      await deleteCategory(
        deletingCategory.id,
      );

      await refresh();

      setDeletingCategory(null);

      toast.success(
        `Category "${categoryName}" deleted successfully.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete category.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div
        className="
          space-y-3
          sm:space-y-6
        "
      >
        <CategoriesToolbar
          onCreate={() =>
            setCreateOpen(true)
          }
        />

        <CategoriesTable
          categories={
            categories
          }
          loading={
            loading
          }
          onEdit={
            setEditingCategory
          }
          onDelete={
            setDeletingCategory
          }
        />
      </div>

      <CreateCategoryDialog
        open={
          createOpen
        }
        loading={
          busy
        }
        onClose={() =>
          setCreateOpen(false)
        }
        onSubmit={
          handleCreate
        }
      />

      <EditCategoryDialog
        open={
          editingCategory !==
          null
        }
        category={
          editingCategory
        }
        loading={
          busy
        }
        onClose={() =>
          setEditingCategory(
            null,
          )
        }
        onSubmit={
          handleUpdate
        }
      />

      <DeleteCategoryDialog
        open={
          deletingCategory !==
          null
        }
        category={
          deletingCategory
        }
        loading={
          busy
        }
        onClose={() =>
          setDeletingCategory(
            null,
          )
        }
        onConfirm={
          handleDelete
        }
      />
    </>
  );
}