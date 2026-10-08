import type {
  KycRecord,
  ReviewKycPayload,
} from "@/components/kyc/kyc.types";

export async function getKycSubmission(
  id: string
): Promise<KycRecord> {
  const response = await fetch(
    `/api/admin/kyc/${id}`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ??
        "Failed to load KYC submission."
    );
  }

  return data.data;
}

export async function reviewKyc(
  id: string,
  payload: ReviewKycPayload
): Promise<KycRecord> {
  const response = await fetch(
    `/api/admin/kyc/${id}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ??
        "Failed to review KYC submission."
    );
  }

  return data.data;
}