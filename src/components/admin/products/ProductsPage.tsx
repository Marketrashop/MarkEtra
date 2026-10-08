"use client";

import { useMemo, useState } from "react";

import type {
  Product,
} from "@/types/product.types";

import ProductFilters, {
  type ProductFiltersValue,
} from "./ProductFilters";

import ProductsTable from "./ProductsTable";

import DeleteProductDialog from "./DeleteProductDialog";

import type {
  ProductCategory,
} from "@/types/category.types";

import type {
  CreateProductInput,
} from "@/validation/product.validation";

import CreateProductDialog from "./CreateProductDialog";

import EditProductDialog from "./EditProductDialog";

import ProductsToolbar from "./ProductsToolbar";

type ProductsPageProps = {
  products: Product[];

  categories: ProductCategory[];

  loading?: boolean;

  creating?: boolean;

  updating?: boolean;

  deleting?: boolean;

  onCreate: (
    values: CreateProductInput,
  ) => Promise<void>;

  onUpdate: (
    productId: string,
    values: CreateProductInput,
  ) => Promise<void>;

  onDelete: (
    productId: string,
  ) => Promise<void>;
};

const defaultFilters: ProductFiltersValue =
  {
    search: "",
    status: "ALL",
    featured: null,
  };

export default function ProductsPage({
  products,
  categories,
  loading = false,
  creating = false,
  updating = false,
  deleting = false,
  onCreate,
  onUpdate,
  onDelete,
}: ProductsPageProps) {
  const [
    filters,
    setFilters,
  ] = useState(defaultFilters);

  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState<Product | null>(
    null
  );

  const [
    createOpen,
    setCreateOpen,
  ] = useState(false);

  const [
    editingProduct,
    setEditingProduct,
  ] = useState<Product | null>(
    null,
  );

  const filteredProducts =
    useMemo(() => {
      return products.filter(
        (product) => {
          const matchesSearch =
            filters.search === "" ||
            product.name
              .toLowerCase()
              .includes(
                filters.search.toLowerCase()
              ) ||
            product.slug
              .toLowerCase()
              .includes(
                filters.search.toLowerCase()
              ) ||
            (
              product.sku ?? ""
            )
              .toLowerCase()
              .includes(
                filters.search.toLowerCase()
              );

          const matchesStatus =
            filters.status ===
              "ALL" ||
            product.status ===
              filters.status;

          const matchesFeatured =
            filters.featured ===
              null ||
            product.featured ===
              filters.featured;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesFeatured
          );
        }
      );
    }, [
      products,
      filters,
    ]);

  async function confirmDelete() {
    if (!selectedProduct) {
      return;
    }

    await onDelete(
      selectedProduct.id
    );

    setSelectedProduct(
      null
    );
  }

  async function handleCreate(
    values: CreateProductInput,
  ) {
    await onCreate(values);

    setCreateOpen(false);
  }

  async function handleUpdate(
    values: CreateProductInput,
  ) {
    if (!editingProduct) {
      return;
    }

    await onUpdate(
      editingProduct.id,
      values,
    );

    setEditingProduct(null);
  }

  return (
    <div
      className="
        space-y-2.5
        sm:space-y-[var(--space-xl)]
      "
    >
      <ProductsToolbar
        onCreate={() =>
          setCreateOpen(true)
        }
      />

      <ProductFilters
        value={filters}
        onChange={setFilters}
        disabled={loading}
      />

      <ProductsTable
        products={
          filteredProducts
        }
        loading={loading}
        onEdit={
          setEditingProduct
        }
        onDelete={
          setSelectedProduct
        }
      />

      <CreateProductDialog
        open={createOpen}
        categories={categories}
        loading={creating}
        onClose={() =>
          setCreateOpen(false)
        }
        onSubmit={
          handleCreate
        }
      />

      <EditProductDialog
        open={
          editingProduct !==
          null
        }
        product={
          editingProduct
        }
        categories={categories}
        loading={updating}
        onClose={() =>
          setEditingProduct(
            null
          )
        }
        onSubmit={
          handleUpdate
        }
      />

      <DeleteProductDialog
        open={
          selectedProduct !==
          null
        }
        productName={
          selectedProduct?.name ??
          ""
        }
        loading={deleting}
        onClose={() =>
          setSelectedProduct(
            null
          )
        }
        onConfirm={
          confirmDelete
        }
      />
    </div>
  );
}