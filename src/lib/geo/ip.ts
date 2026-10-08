import "server-only";

import { isIP } from "node:net";

export type IpLocation = {
  city: string | null;
  region: string | null;
  country: string | null;
  countryCode: string | null;
};

type IpApiResponse = {
  error?: boolean;
  reason?: string;
  ip?: string;
  city?: string | null;
  region?: string | null;
  country_name?: string | null;
  country_code?: string | null;
};

type CachedLocation = {
  location: IpLocation;
  expiresAt: number;
};

const CACHE_TTL_MS =
  15 * 60 * 1000;

const locationCache =
  new Map<string, CachedLocation>();

const LOOKUP_TIMEOUT_MS = 4000;

function normalizeIp(
  ip: string,
): string {
  return ip.trim().toLowerCase();
}

function isPrivateOrLocalIp(
  ip: string,
): boolean {
  const normalized =
    normalizeIp(ip);

  if (!normalized) {
    return true;
  }

  const version =
    isIP(normalized);

  if (version === 0) {
    return true;
  }

  if (version === 4) {
    const octets = normalized
      .split(".")
      .map(Number);

    const [
      first,
      second,
    ] = octets;

    if (
      first === 10 ||
      first === 127
    ) {
      return true;
    }

    if (
      first === 169 &&
      second === 254
    ) {
      return true;
    }

    if (
      first === 172 &&
      second >= 16 &&
      second <= 31
    ) {
      return true;
    }

    if (
      first === 192 &&
      second === 168
    ) {
      return true;
    }

    if (
      first === 100 &&
      second >= 64 &&
      second <= 127
    ) {
      return true;
    }

    return false;
  }

  if (version === 6) {
    if (
      normalized === "::1" ||
      normalized === "::"
    ) {
      return true;
    }

    if (
      normalized.startsWith("fc") ||
      normalized.startsWith("fd")
    ) {
      return true;
    }

    if (
      normalized.startsWith("fe8") ||
      normalized.startsWith("fe9") ||
      normalized.startsWith("fea") ||
      normalized.startsWith("feb")
    ) {
      return true;
    }

    if (
      normalized.startsWith("::ffff:")
    ) {
      const mappedIpv4 =
        normalized.slice(7);

      if (isIP(mappedIpv4) === 4) {
        return isPrivateOrLocalIp(
          mappedIpv4,
        );
      }
    }

    return false;
  }

  return true;
}

function emptyLocation(): IpLocation {
  return {
    city: null,
    region: null,
    country: null,
    countryCode: null,
  };
}

function normalizeValue(
  value:
    | string
    | null
    | undefined,
): string | null {
  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const trimmed =
    value.trim();

  return trimmed || null;
}

async function lookupIp(
  ip: string,
): Promise<IpLocation> {
  const cached =
    locationCache.get(ip);

  if (
    cached &&
    cached.expiresAt >
      Date.now()
  ) {
    return cached.location;
  }

  if (cached) {
    locationCache.delete(ip);
  }

  if (isPrivateOrLocalIp(ip)) {
    return emptyLocation();
  }

  const url =
    `https://ipapi.co/${encodeURIComponent(ip)}/json/`;

  try {
    const response =
      await fetch(url, {
        method: "GET",
        headers: {
          Accept:
            "application/json",
          "User-Agent":
            "MarkEtra/1.0",
        },
        cache: "no-store",
        signal:
          AbortSignal.timeout(
            LOOKUP_TIMEOUT_MS,
          ),
      });

    if (!response.ok) {
      return emptyLocation();
    }

    const data =
      (await response.json()) as IpApiResponse;

    if (data.error) {
      return emptyLocation();
    }

    const location: IpLocation = {
      city: normalizeValue(
        data.city,
      ),
      region: normalizeValue(
        data.region,
      ),
      country: normalizeValue(
        data.country_name,
      ),
      countryCode:
        normalizeValue(
          data.country_code,
        ),
    };

    locationCache.set(
      ip,
      {
        location,
        expiresAt:
          Date.now() +
          CACHE_TTL_MS,
      },
    );

    return location;
  } catch (error) {
    console.warn(
      `IP geolocation lookup failed for ${ip}:`,
      error,
    );

    return emptyLocation();
  }
}

export async function getIpLocations(
  ips: Array<
    string | null
  >,
): Promise<
  Map<string, IpLocation>
> {
  const uniqueIps =
    Array.from(
      new Set(
        ips
          .filter(
            (
              ip,
            ): ip is string =>
              typeof ip ===
                "string" &&
              ip.trim().length > 0,
          )
          .map(normalizeIp),
      ),
    );

  const entries =
    await Promise.all(
      uniqueIps.map(
        async (ip) => {
          const location =
            await lookupIp(
              ip,
            );

          return [
            ip,
            location,
          ] as const;
        },
      ),
    );

  return new Map(
    entries,
  );
}