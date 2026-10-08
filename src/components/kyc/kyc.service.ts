import type { SubmitKycPayload } from "./kyc.types";

export type UploadResponse = {
  key: string;
  url: string;
};

export async function uploadKycImage(
  file: File
): Promise<UploadResponse> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    "/api/upload/kyc",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ??
        "Failed to upload image."
    );
  }

  return data;
}

export async function submitKyc(
  payload: SubmitKycPayload
) {
  const response = await fetch(
    "/api/kyc",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        payload
      ),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ??
        "Failed to submit KYC."
    );
  }

  return data;
}

export async function getKyc() {
  const response =
    await fetch(
      "/api/kyc",
      {
        cache: "no-store",
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ??
        "Failed to load KYC."
    );
  }

  return data;
}