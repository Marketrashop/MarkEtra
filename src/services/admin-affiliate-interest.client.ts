import type {
  AdminAffiliateInterest,
} from "@/types/admin-affiliate.types";

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

export type CreateAffiliateInterestInput = {
  affiliateListingId: string;

  testBuyerId: string;

  offeredPrice: number;
};

export async function createAffiliateInterest(
  input: CreateAffiliateInterestInput,
) {
  const response =
    await fetch(
      "/api/admin/affiliate/interests",
      {
        method: "POST",

        credentials:
          "include",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          input,
        ),
      },
    );

  return parseResponse<AdminAffiliateInterest>(
    response,
  );
}