import type {
  AddToWishlistInput,
  WishlistActionResponse,
  WishlistResponse,
} from "@/types/wishlist.types";

const BASE_URL =
  "/api/wishlist";

async function request<T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> {
  const response =
    await fetch(input, {
      credentials:
        "include",

      headers: {
        "Content-Type":
          "application/json",

        ...(init?.headers ?? {}),
      },

      ...init,
    });

  const json =
    await response.json();

  if (!response.ok) {
    throw new Error(
      json.error ??
        "Wishlist request failed.",
    );
  }

  return json as T;
}

export async function getWishlist() {
  return request<WishlistResponse>(
    BASE_URL,
  );
}

export async function addToWishlist(
  input: AddToWishlistInput,
) {
  return request<WishlistActionResponse>(
    BASE_URL,
    {
      method: "POST",

      body: JSON.stringify(
        input,
      ),
    },
  );
}

export async function removeFromWishlist(
  productId: string,
  variantSizeId?: string,
) {
  return request<WishlistActionResponse>(
    BASE_URL,
    {
      method: "DELETE",

      body: JSON.stringify({
        productId,

        ...(variantSizeId
          ? {
              variantSizeId,
            }
          : {}),
      }),
    },
  );
}

export async function clearWishlist() {
  return request<WishlistActionResponse>(
    BASE_URL,
    {
      method: "DELETE",
    },
  );
}