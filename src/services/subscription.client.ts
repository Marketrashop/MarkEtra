async function parseResponse(
  response: Response,
) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ??
      "Request failed.",
    );
  }

  return data;
}

export async function subscribeToPlan(
  planId: string,
) {
  const response =
    await fetch(
      "/api/subscriptions/subscribe",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          planId,
        }),
      },
    );

  return parseResponse(
    response,
  );
}