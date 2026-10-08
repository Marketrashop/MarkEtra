import type {
  CreatePlanInput,
  UpdatePlanInput,
} from "@/types/plan.types";

const BASE_URL =
  "/api/admin/plans";

async function parseResponse(
  response: Response,
) {
  const data = await response.json();

  if (!response.ok) {
    console.error("API Error:", data);

    if (data.fieldErrors) {
      throw new Error(
        JSON.stringify(data.fieldErrors, null, 2),
      );
    }

    throw new Error(
      data.error ?? "Request failed.",
    );
  }

  return data;
}

export async function getPlans() {
  const response =
    await fetch("/api/plans", {
      cache: "no-store",
    });

  return parseResponse(
    response,
  );
}

export async function createPlan(
  input: CreatePlanInput,
) {
  const response =
    await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(
        input,
      ),
    });

  return parseResponse(
    response,
  );
}

export async function updatePlan(
  planId: string,
  input: UpdatePlanInput,
) {
  const payload = {
    ...input,
    price:
      input.price !== undefined
        ? Number(input.price)
        : undefined,
    commissionRate:
      input.commissionRate !== undefined
        ? Number(input.commissionRate)
        : undefined,
    maxPublishedProducts:
      input.maxPublishedProducts !== undefined
        ? Number(input.maxPublishedProducts)
        : undefined,
    priorityLevel:
      input.priorityLevel !== undefined
        ? Number(input.priorityLevel)
        : undefined,
    durationInDays:
      input.durationInDays !== undefined
        ? Number(input.durationInDays)
        : undefined,
    sortOrder:
      input.sortOrder !== undefined
        ? Number(input.sortOrder)
        : undefined,
  };

  const response = await fetch(
    `${BASE_URL}/${planId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  return parseResponse(response);
}

export async function deletePlan(
  planId: string,
) {
  const response =
    await fetch(
      `${BASE_URL}/${planId}`,
      {
        method: "DELETE",
      },
    );

  return parseResponse(
    response,
  );
}

export async function getPlan(
  planId: string,
) {
  const response =
    await fetch(
      `${BASE_URL}/${planId}`,
      {
        cache: "no-store",
      },
    );

  return parseResponse(
    response,
  );
}