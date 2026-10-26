"use client";

import NavigationLink from "@/components/ui/Preloader/NavigationLink";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  Loader2,
  PackageSearch,
  ClipboardList,
  X,
} from "lucide-react";

type Variant = "glass" | "sheet";

/** Return an error message to display, or nothing on success. */
export type TrackOrderHandler = (
  orderNumber: string,
) => Promise<string | void> | string | void;

function TrackOrderForm({
  variant,
  autoFocus = false,
  onSuccess,
  onTrack,
}: {
  variant: Variant;
  autoFocus?: boolean;
  onSuccess?: () => void;
  onTrack?: TrackOrderHandler;
}) {
  const inputId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!autoFocus) return;
    const timeout = window.setTimeout(() => inputRef.current?.focus(), 250);
    return () => window.clearTimeout(timeout);
  }, [autoFocus]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;

    if (!value.trim()) {
      setError("Enter your order number.");
      inputRef.current?.focus();
      return;
    }

    setError(null);
    startTransition(async () => {
      const message = await onTrack?.(value.trim().replace(/^#/, ""));
      if (typeof message === "string" && message) {
        setError(message);
        inputRef.current?.focus();
        return;
      }
      onSuccess?.();
    });
  };

  const isGlass = variant === "glass";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor={inputId} className="sr-only">Order number</label>
      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError(null);
          }}
          placeholder="Enter order reference"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          disabled={isPending}
          className={`w-full rounded-xl border text-sm outline-none transition duration-200 placeholder:transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
            isGlass
              ? "h-10 border-[var(--user-card-border)] bg-[var(--user-stat-bg)] pl-4 pr-11 text-sm text-[var(--user-title)] placeholder:text-[var(--user-text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              : "h-11 rounded-xl border-[var(--user-card-border)] bg-[var(--background)] px-3.5 text-sm text-[var(--user-title)] placeholder:text-[var(--user-text-muted)] shadow-inner focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
          }`}
        />
        {isGlass && (
          <button
            type="submit"
            disabled={isPending}
            aria-label="Track order"
            className="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--user-card-bg)] text-[var(--user-title)] transition hover:bg-[var(--primary)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:opacity-80"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} strokeWidth={2} />}
          </button>
        )}
      </div>
      <p
        id={errorId}
        role="alert"
        aria-live="polite"
        className={`min-h-[1rem] px-1 pt-1.5 text-xs ${
          error ? (isGlass ? "text-red-300" : "text-red-400") : "sr-only"
        }`}
      >
        {error}
      </p>
{!isGlass && (
  <button
    type="submit"
    disabled={isPending}
    className="group mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#5b5ef7] px-4 text-sm font-semibold text-white transition duration-200 hover:bg-[#4f52e6] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
  >
    {isPending ? (
      <>
        <Loader2 size={16} className="animate-spin" />
        Looking it up…
      </>
    ) : (
      <>
        Track order
        <ArrowRight
          size={16}
          strokeWidth={2.25}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </>
    )}
  </button>
)}
    </form>
  );
}

function TrackOrderSheet({
  open,
  onClose,
  onTrack,
}: {
  open: boolean;
  onClose: () => void;
  onTrack?: TrackOrderHandler;
}) {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) {
      setShown(false);
      return;
    }
    const frame = window.requestAnimationFrame(() => setShown(true));
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] lg:hidden">
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none ${shown ? "opacity-100" : "opacity-0"}`}
      />
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="track-order-sheet-title"
  className={`absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-3xl border border-[var(--user-card-border)] bg-[var(--user-card-bg)] px-4 py-5 shadow-2xl transition-all duration-300 ease-out motion-reduce:transition-none ${
    shown
      ? "-translate-y-1/2 opacity-100"
      : "-translate-y-[45%] opacity-0"
  }`}
  style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
>
        <div aria-hidden="true" className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--user-card-border)]" />
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/15 text-[var(--primary)]">
              <PackageSearch size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 id="track-order-sheet-title" className="text-base font-semibold text-[var(--user-title)]">Track your order</h2>
              <p className="text-xs text-[var(--user-text-muted)]">Use order's reference number.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--user-card-border)] text-[var(--user-text-muted)] transition hover:text-[var(--user-title)]"
          >
            <X size={16} />
          </button>
        </div>
        <TrackOrderForm variant="sheet" autoFocus onSuccess={onClose} onTrack={onTrack} />
        <NavigationLink href="/orders" className="mt-3 block py-2 text-center text-xs font-medium text-[var(--primary)]">
          View all my orders
        </NavigationLink>
      </div>
    </div>,
    document.body,
  );
}

export default function DashboardTrackOrder({
  onTrack,
}: {
  onTrack?: TrackOrderHandler;
}) {
  const router = useRouter();
  const [isMobileTracking, setIsMobileTracking] = useState(false);

  const handleTrackOrder: TrackOrderHandler = async (orderNumber) => {
    // Preserve any existing custom handler supplied by the parent.
    if (onTrack) {
      return onTrack(orderNumber);
    }

    const reference = orderNumber.trim().replace(/^#/, "");

    try {
      const response = await fetch(
        `/api/orders/track/${encodeURIComponent(reference)}`,
        {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
          headers: { Accept: "application/json" },
        },
      );

      if (response.status === 401) {
        return "Please sign in to track your order.";
      }

      if (response.status === 404) {
        return "We couldn't find an order with that reference.";
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return (
          data?.message ??
          data?.error ??
          "We couldn't retrieve your order. Please try again."
        );
      }

      router.push(
        `/order-tracking/${encodeURIComponent(reference)}`,
      );
    } catch {
      return "Unable to connect right now. Please try again.";
    }
  };

  return (
    <>
      <section
        aria-label="Track an order"
        className="relative z-10 hidden w-full rounded-xl border border-[var(--user-card-border)] bg-[var(--user-card-bg)] p-2.5 sm:block sm:p-3"
      >
        <div className="mb-2 flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--user-card-border)] bg-transparent text-[var(--user-title)]">
            <PackageSearch size={16} strokeWidth={1.9} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-[var(--user-title)] sm:text-sm">
              Track an order
            </h3>
            <p className="mt-0.5 text-[10px] leading-4 text-[var(--user-text-muted)] sm:text-xs">
              Follow your order’s delivery status
            </p>
          </div>
        </div>
        <TrackOrderForm variant="glass" onTrack={handleTrackOrder} />
      </section>

      <form
onSubmit={async (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const input = form.elements.namedItem(
    "mobileOrderReference",
  ) as HTMLInputElement | null;

  const reference = input?.value.trim().replace(/^#/, "") ?? "";

  if (!reference) {
    input?.setCustomValidity("Enter your order reference.");
    input?.reportValidity();
    input?.focus();
    return;
  }

  input?.setCustomValidity("");
  setIsMobileTracking(true);

  try {
    const message = await handleTrackOrder(reference);

    if (typeof message === "string" && message) {
      input?.setCustomValidity(message);
      input?.reportValidity();
      input?.focus();
    }
  } catch {
    input?.setCustomValidity(
      "Unable to connect right now. Please try again.",
    );
    input?.reportValidity();
    input?.focus();
  } finally {
    setIsMobileTracking(false);
  }
}}
        className="group relative flex h-10 w-full items-center overflow-hidden rounded-full border border-[var(--user-card-border)] bg-[var(--user-card-bg)] px-2.5 text-left shadow-[0_4px_18px_rgba(0,0,0,0.08)] transition duration-200 sm:hidden"
        aria-label="Track an order"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-[var(--user-title)]/[0.035] via-transparent to-transparent"
        />
        <span className="relative mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--user-card-border)] bg-transparent text-[var(--user-title)]">
          <PackageSearch size={14} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <input
          type="text"
          name="mobileOrderReference"
          placeholder="Enter order reference"
          aria-label="Enter order reference"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          className="relative min-w-0 flex-1 bg-transparent text-[11px] text-[var(--user-title)] outline-none placeholder:text-[var(--user-text-muted)]"
        />
        <button
          type="submit"
          aria-label="Track order"
          disabled={isMobileTracking}
          className="relative ml-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--user-card-border)] bg-transparent text-[var(--user-title)] transition hover:bg-[var(--user-stat-bg)] active:scale-95 disabled:cursor-wait disabled:opacity-70"
        >
          {isMobileTracking ? (
            <Loader2 size={12} strokeWidth={1.8} className="animate-spin" aria-hidden="true" />
          ) : (
            <ArrowRight size={12} strokeWidth={1.8} aria-hidden="true" />
          )}
        </button>
      </form>

      {/* Mobile tracking now uses the inline input; the centered dialog is intentionally disabled. */}
      {/* <TrackOrderSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onTrack={handleTrackOrder}
      /> */}
    </>
  );
}
