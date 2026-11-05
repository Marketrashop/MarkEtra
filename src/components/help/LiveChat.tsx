"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    _smartsupp?: {
      key?: string;
      offsetX?: number;
      offsetY?: number;
    };

    smartsupp?: {
      (...args: unknown[]): void;
      _: unknown[];
    };

    __smartsuppLoaded?: boolean;
  }
}

const SMARTSUPP_KEY =
  "ada3adebdb594ee8a555e1b3d69b8802b7e2b78f";

const SMARTSUPP_SRC =
  "https://www.smartsuppchat.com/loader.js?";

// Distance (px) the chat bubble sits away from the screen edges.
// Desktop clears the footer bar; mobile clears the bottom nav.
const OFFSET_Y_DESKTOP = 80;
const OFFSET_Y_MOBILE = 96;
const OFFSET_X = 8;
const MOBILE_BREAKPOINT = 768;

/* ---------- attention animation ---------- */

// Smartsupp renders the bubble inside an iframe. We can't style what's inside
// it, but we can animate the iframe element itself. Check in DevTools that one
// of these matches (inspect the bubble and look for the <iframe>).
const WIDGET_SELECTORS = [
  "iframe#chat-application",
  "#chat-application",
  "#smartsupp-widget-container iframe",
  'iframe[src*="smartsupp"]',
];

const POLL_MS = 400; // how often we look for the widget after it's shown
const POLL_MAX = 40; // ...and how many times (about 16 seconds)
const FIRST_NUDGE_DELAY_MS = 1800; // pause after the pop-in before the first nudge
const NUDGE_EVERY_MS = 7000; // gap between nudges
const NUDGE_COUNT = 3; // total nudges per visit, then it stays still

function findWidget(): HTMLElement | null {
  for (const selector of WIDGET_SELECTORS) {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) return element;
  }
  return null;
}

/**
 * Pops the bubble in, then gives it a few gentle hops. Stops for good as soon
 * as the visitor hovers or clicks it. Returns a cleanup function.
 */
function startAttentionAnimation(): () => void {
  let stopped = false;
  let widget: HTMLElement | null = null;
  const timers: number[] = [];

  function later(callback: () => void, delay: number) {
    timers.push(window.setTimeout(callback, delay));
  }

  function onBlur() {
    // A click inside a cross-origin iframe blurs the window and focuses the
    // iframe, which is how we detect "the visitor clicked the bubble".
    if (widget && document.activeElement === widget) stop();
  }

  function stop() {
    stopped = true;
    timers.forEach((id) => window.clearTimeout(id));
    widget?.removeEventListener("pointerenter", stop);
    window.removeEventListener("blur", onBlur);
  }

  function popIn() {
    widget?.animate(
      [
        { scale: "0.85", translate: "0 14px", transformOrigin: "100% 100%" },
        { scale: "1", translate: "0 0", transformOrigin: "100% 100%" },
      ],
      { duration: 450, easing: "cubic-bezier(0.2, 0.9, 0.3, 1.2)" },
    );
  }

  function nudge(count: number) {
    if (stopped || !widget) return;

    widget.animate(
      [
        { translate: "0 0", offset: 0 },
        { translate: "0 -10px", offset: 0.25 },
        { translate: "0 0", offset: 0.5 },
        { translate: "0 -5px", offset: 0.7 },
        { translate: "0 0", offset: 1 },
      ],
      { duration: 900, easing: "ease-in-out" },
    );

    if (count < NUDGE_COUNT) {
      later(() => nudge(count + 1), NUDGE_EVERY_MS);
    }
  }

  let attempts = 0;

  function poll() {
    if (stopped) return;

    widget = findWidget();

    if (widget) {
      widget.addEventListener("pointerenter", stop, { once: true });
      window.addEventListener("blur", onBlur);

      popIn();
      later(() => nudge(1), FIRST_NUDGE_DELAY_MS);
      return;
    }

    attempts += 1;
    if (attempts < POLL_MAX) later(poll, POLL_MS);
  }

  poll();

  return stop;
}

export default function LiveChat() {
  const pathname = usePathname();

  useEffect(() => {
    window._smartsupp = window._smartsupp ?? {};
    window._smartsupp.key = SMARTSUPP_KEY;

    // Must be set before the loader script runs.
    window._smartsupp.offsetX = OFFSET_X;
    window._smartsupp.offsetY =
      window.innerWidth < MOBILE_BREAKPOINT
        ? OFFSET_Y_MOBILE
        : OFFSET_Y_DESKTOP;

    if (!window.smartsupp) {
      const smartsupp = Object.assign(
        (...args: unknown[]) => {
          smartsupp._.push(args);
        },
        { _: [] as unknown[] },
      );

      window.smartsupp = smartsupp;
    }

    if (!window.__smartsuppLoaded) {
      const existingScript = document.querySelector(
        `script[src^="${SMARTSUPP_SRC}"]`,
      );

      if (!existingScript) {
        const script = document.createElement("script");

        script.async = true;
        script.charset = "utf-8";
        script.src = SMARTSUPP_SRC;

        document.head.appendChild(script);
      }

      window.__smartsuppLoaded = true;
    }
  }, []);

  useEffect(() => {
    if (!window.smartsupp) return;

    if (pathname !== "/help-center") {
      window.smartsupp("chat:hide");
      return;
    }

    window.smartsupp("chat:show");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    return startAttentionAnimation();
  }, [pathname]);

  return null;
}