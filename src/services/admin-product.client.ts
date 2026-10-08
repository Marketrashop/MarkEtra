import type {
  Product,
} from "@/types/product.types";

import type {
  CreateProductInput,
} from "@/validation/product.validation";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
};

async function parseResponse<T>(
  response: Response,
): Promise<T> {
  const payload =
    (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    throw new Error(
      payload.error ??
        payload.message ??
        "Request failed.",
    );
  }

  return payload.data;
}

export async function getProducts() {
  const response =
    await fetch(
      "/api/admin/products",
      {
        cache: "no-store",
      },
    );

  return parseResponse<Product[]>(
    response,
  );
}

export async function createProduct(
  values: CreateProductInput,
) {
  const response =
    await fetch(
      "/api/admin/products",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          values,
        ),
      },
    );

  return parseResponse<Product>(
    response,
  );
}

export async function updateProduct(
  productId: string,
  values: CreateProductInput,
) {
  const response =
    await fetch(
      `/api/admin/products/${productId}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          values,
        ),
      },
    );

  return parseResponse<Product>(
    response,
  );
}

export async function deleteProduct(
  productId: string,
) {
  const response =
    await fetch(
      `/api/admin/products/${productId}`,
      {
        method: "DELETE",
      },
    );

  return parseResponse<{
    success: boolean;
  }>(response);
}

export async function duplicateProduct(
  productId: string,
) {
  const response =
    await fetch(
      "/api/admin/products/duplicate",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          productId,
        }),
      },
    );

  return parseResponse<Product>(
    response,
  );
}

export async function toggleFeatured(
  ids: string[],
) {
  const response =
    await fetch(
      "/api/admin/products/featured",
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          ids,
        }),
      },
    );

  return parseResponse<Product[]>(
    response,
  );
}

export async function updateProductStatus(
  ids: string[],
  status: string,
) {
  const response =
    await fetch(
      "/api/admin/products/status",
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          ids,
          status,
        }),
      },
    );

  return parseResponse<{
    updated: number;
  }>(response);
}

export async function bulkDeleteProducts(
  ids: string[],
) {
  const response =
    await fetch(
      "/api/admin/products/bulk-delete",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          ids,
        }),
      },
    );

  return parseResponse<{
    deleted: number;
  }>(response);
}