import type {
  AffiliateTestBuyer,
  AffiliateTestBuyerResponse,
  AffiliateTestBuyersResponse,
  CreateAffiliateTestBuyerInput,
  UpdateAffiliateTestBuyerInput,
} from "./types";

async function parseResponse<T>(
  response: Response,
): Promise<T> {
  const data =
    (await response.json()) as T & {
      error?: string;
    };

  if (!response.ok) {
    throw new Error(
      data.error ??
        "Request failed.",
    );
  }

  return data;
}

export async function getAffiliateTestBuyers() {
  const response =
    await fetch(
      "/api/admin/affiliate/test-buyers",
      {
        method: "GET",

        credentials:
          "include",

        cache: "no-store",
      },
    );

  return parseResponse<
    AffiliateTestBuyersResponse
  >(response);
}

export async function createAffiliateTestBuyer(
  input: CreateAffiliateTestBuyerInput,
) {
  const response =
    await fetch(
      "/api/admin/affiliate/test-buyers",
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

  return parseResponse<
    AffiliateTestBuyerResponse
  >(response);
}

export async function updateAffiliateTestBuyer(
  buyerId: string,
  input: UpdateAffiliateTestBuyerInput,
) {
  const response =
    await fetch(
      `/api/admin/affiliate/test-buyers/${encodeURIComponent(
        buyerId,
      )}`,
      {
        method: "PATCH",

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

  return parseResponse<
    AffiliateTestBuyerResponse
  >(response);
}

export async function deleteAffiliateTestBuyer(
  buyerId: string,
) {
  const response =
    await fetch(
      `/api/admin/affiliate/test-buyers/${encodeURIComponent(
        buyerId,
      )}`,
      {
        method: "DELETE",

        credentials:
          "include",
      },
    );

  return parseResponse<{
    success: boolean;

    message?: string;

    error?: string;
  }>(
    response,
  );
}