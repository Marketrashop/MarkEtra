"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import {
  ProductsPage,
} from "@/components/admin/products";

import type {
  Product,
} from "@/types/product.types";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/admin-product.client";

import {
  getCategories,
} from "@/services/category.client";

import type {
  ProductCategory,
} from "@/types/category.types";

import type {
  CreateProductInput,
} from "@/validation/product.validation";



export default function AdminProductsRoute() {
  const [
    products,
    setProducts,
  ] = useState<Product[]>([]);

const [
  categories,
  setCategories,
] = useState<ProductCategory[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

const [
  creating,
  setCreating,
] = useState(false);

const [
  updating,
  setUpdating,
] = useState(false);

const loadData =
  useCallback(async () => {
    try {
      setLoading(true);

      const [
        products,
        categories,
      ] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      setProducts(products);

      setCategories(categories);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load products.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

useEffect(() => {
  void loadData();
}, [loadData]);

  async function handleDelete(
    productId: string,
  ) {
    try {
      setDeleting(true);

      await deleteProduct(
        productId,
      );

      setProducts(
        (current) =>
          current.filter(
            (product) =>
              product.id !==
              productId,
          ),
      );

      toast.success(
        "Product deleted.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete product.",
      );
    } finally {
      setDeleting(false);
    }
  }

async function handleCreate(
  values: CreateProductInput,
) {
  try {
    setCreating(true);

    const product =
      await createProduct(
        values,
      );

    setProducts(
      (current) => [
        product,
        ...current,
      ],
    );

    toast.success(
      "Product created.",
    );
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to create product.",
    );
  } finally {
    setCreating(false);
  }
}

async function handleUpdate(
  productId: string,
  values: CreateProductInput,
) {
  try {
    setUpdating(true);

    const product =
      await updateProduct(
        productId,
        values,
      );

    setProducts(
      (current) =>
        current.map((item) =>
          item.id === product.id
            ? product
            : item,
        ),
    );

    toast.success(
      "Product updated.",
    );
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to update product.",
    );
  } finally {
    setUpdating(false);
  }
}

  return (
    <DashboardPageLayout
      environment="admin"
      breadcrumb={[
        {
          label: "Products",
        },
      ]}
    >
      <section className="py-6">
<ProductsPage
  products={products}
  categories={categories}
  loading={loading}
  creating={creating}
  updating={updating}
  deleting={deleting}
  onCreate={handleCreate}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
/>
      </section>
    </DashboardPageLayout>
  );
}