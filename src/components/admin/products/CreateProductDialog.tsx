"use client";

import { X } from "lucide-react";

import type {
  ProductCategory,
} from "@/types/category.types";

import type {
  CreateProductInput,
} from "@/validation/product.validation";

import ProductForm from "./ProductForm";

type CreateProductDialogProps = {
  open: boolean;

  categories: ProductCategory[];

  loading?: boolean;

  onClose: () => void;

  onSubmit: (
    values: CreateProductInput,
  ) => Promise<void>;
};

export default function CreateProductDialog({
  open,
  categories,
  loading = false,
  onClose,
  onSubmit,
}: CreateProductDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-end
        justify-center
        bg-black/60
        backdrop-blur-md
        p-0
        sm:items-center
        sm:p-6
      "
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-product-title"
        onClick={(event) =>
          event.stopPropagation()
        }
        className="
          flex
          h-[100dvh]
          w-full
          flex-col
          overflow-hidden
          rounded-none
          border
          border-[var(--admin-card-border)]
          bg-[var(--admin-card-bg)]
          shadow-2xl
          sm:h-auto
          sm:max-h-[92vh]
          sm:max-w-6xl
          sm:rounded-[var(--admin-surface-radius)]
        "
      >
        <header
          className="
            sticky
            top-0
            z-10
            flex
            items-center
            justify-between
            gap-3
            border-b
            border-[var(--admin-card-border)]
            bg-[var(--admin-card-bg)]
            px-3
            py-2.5
            sm:px-6
            sm:py-5
          "
        >
          <div className="min-w-0">
            <h2
              id="create-product-title"
              className="
                truncate
                text-[13px]
                font-semibold
                text-[var(--admin-title)]
                sm:text-xl
              "
            >
              Create Product
            </h2>

            <p
              className="
                mt-0.5
                text-[9px]
                leading-3.5
                text-[var(--admin-muted)]
                sm:mt-1
                sm:text-sm
                sm:leading-normal
              "
            >
              Add a new product to your marketplace.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close create product dialog"
            title="Close"
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              text-[var(--admin-muted)]
              transition-colors
              hover:bg-[var(--admin-hover)]
              hover:text-[var(--admin-title)]
              disabled:pointer-events-none
              disabled:opacity-50
              sm:h-10
              sm:w-10
            "
          >
            <X
              size={15}
              className="
                sm:h-5
                sm:w-5
              "
            />
          </button>
        </header>

        <div
          className="
            flex-1
            overflow-y-auto
            px-3
            py-3.5
            sm:px-8
            sm:py-6
          "
        >
          <ProductForm
            categories={categories}
            loading={loading}
            submitLabel="Create Product"
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}