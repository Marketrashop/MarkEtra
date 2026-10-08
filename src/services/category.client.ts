import type {
  ProductCategory,
} from "@/types/category.types";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: string;
};

async function parseResponse<T>(
  response: Response,
): Promise<T> {
  const payload =
    (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(
      payload.error ??
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