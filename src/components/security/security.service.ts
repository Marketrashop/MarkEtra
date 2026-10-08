import type {
  ActiveSessionsResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
} from "./security.types";

export class ChangePasswordError
  extends Error {
  code?: string;
  remainingAttempts?: number;

  constructor(
    message: string,
    options?: {
      code?: string;
      remainingAttempts?: number;
    },
  ) {
    super(message);

    this.name =
      "ChangePasswordError";

    this.code =
      options?.code;

    this.remainingAttempts =
      options?.remainingAttempts;
  }
}

async function parseResponse<T>(
  response: Response,
): Promise<T> {
  const data: unknown =
    await response.json();

  if (!response.ok) {
    if (
      typeof data === "object" &&
      data !== null
    ) {
      const errorData =
        data as {
          error?: unknown;
          code?: unknown;
          remainingAttempts?: unknown;
        };

      throw new ChangePasswordError(
        typeof errorData.error ===
          "string"
          ? errorData.error
          : "Something went wrong.",
        {
          code:
            typeof errorData.code ===
            "string"
              ? errorData.code
              : undefined,
          remainingAttempts:
            typeof errorData.remainingAttempts ===
            "number"
              ? errorData.remainingAttempts
              : undefined,
        },
      );
    }

    throw new ChangePasswordError(
      "Something went wrong.",
    );
  }

  return data as T;
}

export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<ChangePasswordResponse> {
  const response = await fetch(
    "/api/security/password",
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

export async function getActiveSessions(): Promise<ActiveSessionsResponse> {
  const response = await fetch(
    "/api/security/sessions",
    {
      cache: "no-store",
    },
  );

  return parseResponse(response);
}

export async function revokeSession(
  sessionId: string,
): Promise<{
  success: boolean;
  message: string;
}> {
  const response = await fetch(
    `/api/security/sessions/${sessionId}`,
    {
      method: "DELETE",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ??
        "Unable to revoke session.",
    );
  }

  return data;
}