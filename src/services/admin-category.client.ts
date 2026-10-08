import type {
  ProductCategory,
} from "@/types/category.types";

import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/types/category.types";

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

export async function getCategories() {
  const response =
    await fetch(
      "/api/admin/categories",
      {
        cache: "no-store",
      },
    );

  return parseResponse<
    ProductCategory[]
  >(response);
}

export async function createCategory(
  values: CreateCategoryInput,
) {
  const response =
    await fetch(
      "/api/admin/categories",
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

  return parseResponse<ProductCategory>(
    response,
  );
}

export async function updateCategory(
  categoryId: string,
  values: UpdateCategoryInput,
) {
  const response =
    await fetch(
      `/api/admin/categories/${categoryId}`,
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

  return parseResponse<ProductCategory>(
    response,
  );
}

export async function deleteCategory(
  categoryId: string,
) {
  const response =
    await fetch(
      `/api/admin/categories/${categoryId}`,
      {
        method: "DELETE",
      },
    );

  return parseResponse<void>(
    response,
  );
}