async function parseResponse(
  response: Response,
) {
  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ??
        "Request failed.",
    );
  }

  return data;
}

export async function getAffiliateEarnings() {
  const response =
    await fetch(
      "/api/affiliate/earnings",
      {
        cache: "no-store",
      },
    );

  return parseResponse(
    response,
  );
}

export async function submitAffiliateProduct(
  productId: string,
) {
  const response =
    await fetch(
      "/api/affiliate/publish",
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

  return parseResponse(
    response,
  );
}