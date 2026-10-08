"use client";

import Link from "next/link";

import {
  Edit,
  Eye,
  Trash2,
} from "lucide-react";

import Image from "next/image";

import { getCloudinaryImageUrl } from "@/lib/cloudinary";

import type {
  Product,
} from "@/types/product.types";

import ProductStatusBadge from "./ProductStatusBadge";

type ProductsTableProps = {
  products: Product[];

  loading?: boolean;

  onEdit: (
    product: Product,
  ) => void;

  onDelete: (
    product: Product,
  ) => void;
};

function formatPrice(
  amount: number,
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    },
  ).format(amount);
}

function getAvailableStock(
  product: Product,
) {
  return product.variants.reduce(
    (
      total,
      variant,
    ) =>
      total +
      variant.sizes.reduce(
        (
          variantTotal,
          inventory,
        ) =>
          variantTotal +
          Math.max(
            0,
            inventory.stock -
              inventory.reservedStock,
          ),
        0,
      ),
    0,
  );
}

export default function ProductsTable({
  products,
  loading = false,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  if (loading) {
    return (
      <div
        className="
          rounded-lg
          border
          border-[var(--admin-card-border)]
          bg-[var(--admin-card-bg)]
          px-3
          py-7
          text-center
          text-[9px]
          text-[var(--admin-muted)]
          sm:rounded-[var(--admin-surface-radius)]
          sm:p-10
          sm:text-sm
        "
      >
        Loading products...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        className="
          rounded-lg
          border
          border-[var(--admin-card-border)]
          bg-[var(--admin-card-bg)]
          px-3
          py-7
          text-center
          text-[9px]
          text-[var(--admin-muted)]
          sm:rounded-[var(--admin-surface-radius)]
          sm:p-10
          sm:text-sm
        "
      >
        No products found.
      </div>
    );
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-lg
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-card-bg)]
        sm:rounded-[var(--admin-surface-radius)]
      "
    >
      <div className="overflow-x-auto">
        <table
          className="
            min-w-[900px]
            border-collapse
            sm:min-w-full
          "
        >
          <thead
            className="
              bg-[var(--admin-table-header-bg)]
            "
          >
            <tr>
              {[
                "Product",
                "Category",
                "Price",
                "Stock",
                "Status",
                "Featured",
                "Actions",
              ].map((title) => (
                <th
                  key={title}
                  className="
                    whitespace-nowrap
                    px-2.5
                    py-2.5
                    text-left
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.06em]
                    text-[var(--admin-muted)]
                    sm:px-5
                    sm:py-4
                    sm:text-xs
                    sm:tracking-wide
                  "
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {products.map(
              (product) => (
                <tr
                  key={product.id}
                  className="
                    border-t
                    border-[var(--admin-card-border)]
                    transition
                    hover:bg-[var(--admin-hover-bg)]
                  "
                >
                  <td
                    className="
                      whitespace-nowrap
                      px-2.5
                      py-2.5
                      sm:px-5
                      sm:py-4
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        sm:gap-4
                      "
                    >
                      <div
                        className="
                          relative
                          h-9
                          w-9
                          shrink-0
                          overflow-hidden
                          rounded-md
                          border
                          border-[var(--admin-card-border)]
                          bg-[var(--admin-input-bg)]
                          sm:h-14
                          sm:w-14
                          sm:rounded-[var(--radius-md)]
                        "
                      >
                        {product.images?.[0] ? (
                          <Image
                            src={
                              getCloudinaryImageUrl(
                                product
                                  .images[0]
                                  .imageKey,
                              )!
                            }
                            alt={
                              product.name
                            }
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>

                      <div>
                        <p
                          className="
                            max-w-[180px]
                            truncate
                            text-[10px]
                            font-medium
                            text-[var(--admin-title)]
                            sm:max-w-none
                            sm:text-sm
                          "
                        >
                          {product.name}
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[8px]
                            text-[var(--admin-muted)]
                            sm:mt-1
                            sm:text-xs
                          "
                        >
                          {product.sku ||
                            "No SKU"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td
                    className="
                      whitespace-nowrap
                      px-2.5
                      py-2.5
                      text-[9px]
                      text-[var(--admin-title)]
                      sm:px-5
                      sm:py-4
                      sm:text-sm
                    "
                  >
                    {product.categories.length > 0
                      ? product.categories
                          .map(
                            (item) =>
                              item.category.name,
                          )
                          .join(", ")
                      : "Uncategorized"}
                  </td>

                  <td
                    className="
                      whitespace-nowrap
                      px-2.5
                      py-2.5
                      text-[9px]
                      font-medium
                      text-[var(--admin-title)]
                      sm:px-5
                      sm:py-4
                      sm:text-sm
                    "
                  >
                    {formatPrice(
                      product.price,
                    )}
                  </td>

                  <td
                    className="
                      whitespace-nowrap
                      px-2.5
                      py-2.5
                      text-[9px]
                      text-[var(--admin-title)]
                      sm:px-5
                      sm:py-4
                      sm:text-sm
                    "
                  >
                    {getAvailableStock(
                      product,
                    )}
                  </td>

                  <td
                    className="
                      whitespace-nowrap
                      px-2.5
                      py-2.5
                      sm:px-5
                      sm:py-4
                    "
                  >
                    <ProductStatusBadge
                      status={
                        product.status
                      }
                    />
                  </td>

                  <td
                    className="
                      whitespace-nowrap
                      px-2.5
                      py-2.5
                      sm:px-5
                      sm:py-4
                    "
                  >
                    {product.featured ? (
                      <span
                        className="
                          inline-flex
                          rounded-full
                          bg-[var(--admin-status-success-bg)]
                          px-1.5
                          py-0.5
                          text-[8px]
                          font-medium
                          text-[var(--admin-status-success-text)]
                          sm:px-2
                          sm:py-1
                          sm:text-xs
                        "
                      >
                        Featured
                      </span>
                    ) : (
                      <span
                        className="
                          text-[8px]
                          text-[var(--admin-muted)]
                          sm:text-xs
                        "
                      >
                        No
                      </span>
                    )}
                  </td>

                  <td
                    className="
                      whitespace-nowrap
                      px-2.5
                      py-2.5
                      sm:px-5
                      sm:py-4
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-1
                        sm:gap-2
                      "
                    >
                      <Link
                        href={`/admin/products/${product.id}`}
                        title="View product"
                        aria-label="View product"
                        className="
                          inline-flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-md
                          border
                          border-[var(--admin-button-secondary-border)]
                          bg-[var(--admin-button-secondary-bg)]
                          transition
                          hover:bg-[var(--admin-button-secondary-hover)]
                          sm:h-9
                          sm:w-9
                          sm:rounded-[var(--admin-input-radius)]
                        "
                      >
                        <Eye
                          size={13}
                          className="
                            sm:h-4
                            sm:w-4
                          "
                        />
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          onEdit(
                            product,
                          )
                        }
                        title="Edit product"
                        aria-label="Edit product"
                        className="
                          inline-flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-md
                          border
                          border-[var(--admin-button-secondary-border)]
                          bg-[var(--admin-button-secondary-bg)]
                          transition
                          hover:bg-[var(--admin-button-secondary-hover)]
                          sm:h-9
                          sm:w-9
                          sm:rounded-[var(--admin-input-radius)]
                        "
                      >
                        <Edit
                          size={13}
                          className="
                            sm:h-4
                            sm:w-4
                          "
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(
                            product,
                          )
                        }
                        title="Delete product"
                        aria-label="Delete product"
                        className="
                          inline-flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-md
                          bg-[var(--admin-button-danger-bg)]
                          text-[var(--admin-button-danger-text)]
                          transition
                          hover:opacity-90
                          sm:h-9
                          sm:w-9
                          sm:rounded-[var(--admin-input-radius)]
                        "
                      >
                        <Trash2
                          size={13}
                          className="
                            sm:h-4
                            sm:w-4
                          "
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}