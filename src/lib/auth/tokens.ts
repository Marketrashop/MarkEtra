import { createHash, randomBytes } from "node:crypto";

import { AUTH_CONSTANTS } from "./constants";

export function generateToken(
  bytes: number = AUTH_CONSTANTS.SESSION_TOKEN_BYTES,
): string {
  return randomBytes(bytes).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function generateVerificationToken(): {
  token: string;
  tokenHash: string;
  expiresAt: Date;
} {
  const token = generateToken(AUTH_CONSTANTS.EMAIL_VERIFICATION_TOKEN_BYTES);

  const tokenHash = hashToken(token);

  const expiresAt = new Date(
    Date.now() + AUTH_CONSTANTS.EMAIL_VERIFICATION_TOKEN_TTL_MS,
  );

  return {
    token,
    tokenHash,
    expiresAt,
  };
}

export function generatePasswordResetToken(): {
  token: string;
  tokenHash: string;
  expiresAt: Date;
} {
  const token = generateToken(AUTH_CONSTANTS.PASSWORD_RESET_TOKEN_BYTES);

  const tokenHash = hashToken(token);

  const expiresAt = new Date(
    Date.now() + AUTH_CONSTANTS.PASSWORD_RESET_TOKEN_TTL_MS,
  );

  return {
    token,
    tokenHash,
    expiresAt,
  };
}