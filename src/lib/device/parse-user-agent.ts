export function parseUserAgent(
  userAgent: string | null | undefined,
): string {
  if (!userAgent) {
    return "Unknown Device";
  }

  const ua = userAgent.toLowerCase();

  const browser = getBrowser(ua);
  const operatingSystem = getOperatingSystem(ua);

  if (
    browser &&
    operatingSystem
  ) {
    return `${browser} on ${operatingSystem}`;
  }

  return (
    browser ??
    operatingSystem ??
    "Unknown Device"
  );
}

function getBrowser(
  ua: string,
): string | null {
  // Samsung Internet
  if (
    ua.includes("samsungbrowser/")
  ) {
    return "Samsung Internet";
  }

  // Microsoft Edge
  if (
    ua.includes("edg/") ||
    ua.includes("edge/")
  ) {
    return "Edge";
  }

  // Opera
  if (
    ua.includes("opr/") ||
    ua.includes("opera/")
  ) {
    return "Opera";
  }

  // Firefox
  if (
    ua.includes("firefox/") ||
    ua.includes("fxios/")
  ) {
    return "Firefox";
  }

  // Chrome on iOS
  if (ua.includes("crios/")) {
    return "Chrome";
  }

  // Chrome
  if (
    ua.includes("chrome/") ||
    ua.includes("chromium/")
  ) {
    return "Chrome";
  }

  // Safari on iOS/macOS
  if (
    ua.includes("safari/") &&
    !ua.includes("chrome/") &&
    !ua.includes("crios/") &&
    !ua.includes("android")
  ) {
    return "Safari";
  }

  // Internet Explorer
  if (
    ua.includes("msie") ||
    ua.includes("trident/")
  ) {
    return "Internet Explorer";
  }

  return null;
}

function getOperatingSystem(
  ua: string,
): string | null {
  // iPhone / iPad / iPod
  if (
    ua.includes("iphone") ||
    ua.includes("ipad") ||
    ua.includes("ipod")
  ) {
    return "iOS";
  }

  // Android
  if (ua.includes("android")) {
    return "Android";
  }

  // Windows
  if (ua.includes("windows")) {
    return "Windows";
  }

  // macOS
  if (
    ua.includes("macintosh") ||
    ua.includes("mac os x")
  ) {
    return "macOS";
  }

  // Linux
  if (ua.includes("linux")) {
    return "Linux";
  }

  // ChromeOS
  if (ua.includes("cros")) {
    return "ChromeOS";
  }

  return null;
}