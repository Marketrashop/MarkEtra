import type {
  AdminAffiliateListing,
  AdminAffiliatePublicationStatus,
} from "@/types/admin-affiliate.types";

type AffiliateListingMutationResult =
  Pick<
    AdminAffiliateListing,
    | "id"
    | "status"
    | "publicationStatus"
    | "publishedAt"
    | "submittedAt"
    | "reviewedAt"
    | "rejectionReason"
    | "removedAt"
    | "updatedAt"
  >;

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

export async function getAffiliateProducts() {
  const response =
    await fetch(
      "/api/admin/affiliate/products",
      {
        cache: "no-store",
      },
    );

  return parseResponse<
    AdminAffiliateListing[]
  >(response);
}

export async function reviewAffiliateProduct(
  listingId: string,
) {
  const response =
    await fetch(
      `/api/admin/affiliate/products/${encodeURIComponent(
        listingId,
      )}/review`,
      {
        method: "PATCH",
      },
    );

  return parseResponse<AffiliateListingMutationResult>(
    response,
  );
}

export async function approveAffiliateProduct(
  listingId: string,
) {
  const response =
    await fetch(
      `/api/admin/affiliate/products/${encodeURIComponent(
        listingId,
      )}/approve`,
      {
        method: "PATCH",
      },
    );

  return parseResponse<AffiliateListingMutationResult>(
    response,
  );
}

export async function rejectAffiliateProduct(
  listingId: string,
  reason: string,
) {
  const response =
    await fetch(
      `/api/admin/affiliate/products/${encodeURIComponent(
        listingId,
      )}/reject`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          reason,
        }),
      },
    );

  return parseResponse<AffiliateListingMutationResult>(
    response,
  );
}

export async function publishAffiliateProduct(
  listingId: string,
) {
  const response =
    await fetch(
      `/api/admin/affiliate/products/${encodeURIComponent(
        listingId,
      )}/publish`,
      {
        method: "PATCH",
      },
    );

  return parseResponse<AffiliateListingMutationResult>(
    response,
  );
}