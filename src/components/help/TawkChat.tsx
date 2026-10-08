"use client";

import { useEffect } from "react";

import { usePathname } from "next/navigation";

declare global {
  interface Window {
    Tawk_API?: {
      customStyle?: {
        visibility: {
          desktop: {
            position: string;
            xOffset: number;
            yOffset: number;
          };
          mobile: {
            position: string;
            xOffset: number;
            yOffset: number;
          };
          bubble: {
            rotate: string;
            xOffset: number;
            yOffset: number;
          };
        };
      };

      showWidget?: () => void;
      hideWidget?: () => void;
      maximize?: () => void;
      minimize?: () => void;
toggle?: () => void;

isChatMinimized?: () => boolean;

onLoad?: () => void;
    };

    Tawk_LoadStart?: Date;

    __tawkReady?: boolean;
  }
}

const TAWK_SRC =
  "https://embed.tawk.to/6a956a936c07cd3443eb15e2/1k1bqgkt9";

export default function TawkChat() {
  const pathname = usePathname();

  useEffect(() => {
    window.Tawk_API = window.Tawk_API ?? {};

    window.Tawk_API.customStyle = {
      visibility: {
        desktop: {
          position: "br",
          xOffset: 20,
          yOffset: 90,
        },

        mobile: {
          position: "br",
          xOffset: 0,
          yOffset: 90,
        },

        bubble: {
          rotate: "0deg",
          xOffset: 0,
          yOffset: 0,
        },
      },
    };

    window.Tawk_API.onLoad = () => {
      window.__tawkReady = true;

      window.Tawk_API?.hideWidget?.();
    };

    const existingScript =
      document.querySelector<HTMLScriptElement>(
        `script[src="${TAWK_SRC}"]`,
      );

    if (!existingScript) {
      window.Tawk_LoadStart =
        new Date();

      const script =
        document.createElement("script");

      script.async = true;

      script.src = TAWK_SRC;

      script.charset = "UTF-8";

      script.setAttribute(
        "crossorigin",
        "*",
      );

      document.body.appendChild(script);
    } else if (window.__tawkReady) {
      window.Tawk_API?.hideWidget?.();
    }

    return () => {
      window.Tawk_API?.hideWidget?.();
    };
  }, []);

  useEffect(() => {
    if (
      window.__tawkReady &&
      pathname === "/help-center"
    ) {
      window.Tawk_API?.hideWidget?.();
    }
  }, [pathname]);

  return null;
}