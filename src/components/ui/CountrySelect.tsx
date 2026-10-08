"use client";

import {
  ChevronDown,
  Check,
  Search,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  COUNTRIES,
  type Country,
} from "@/lib/countries";

type Props = {
  label?: string;
  value: Country | "";
  onChange: (
    country: Country,
  ) => void;
  error?: string;
  placeholder?: string;
  compact?: boolean;
};

export function CountrySelect({
  label,
  value,
  onChange,
  error,
  placeholder = "Select a country",
  compact = false,
}: Props) {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const inputRef =
    useRef<HTMLInputElement>(null);

  const [open, setOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) {
      return COUNTRIES;
    }

    return COUNTRIES.filter((country) =>
      country
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search]);

  useEffect(() => {
    function handleClick(
      event: MouseEvent,
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    }

    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
    >
{label && (
  <label
    className={
      compact
        ? "mb-1.5 block text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--user-text-muted)]"
        : "mb-1.5 block text-[12px] sm:text-[13px] font-semibold text-[var(--user-text)]"
    }
  >
    {label}
  </label>
)}

      <button
        type="button"
        onClick={() =>
          setOpen((prev) => !prev)
        }
className={`
  flex
  w-full
  items-center
  justify-between
  border
  text-left
  transition
  ${
    compact
      ? "h-10 rounded-lg bg-[var(--user-card-bg)] px-3 text-sm text-[var(--user-title)]"
      : "h-10 sm:h-11 rounded-xl bg-[var(--user-input-bg)] px-3 sm:px-3.5 text-[13px] sm:text-[14px]"
  }
`}
        style={{
          borderColor: error
            ? "var(--user-danger)"
            : "var(--user-input-border)",
        }}
      >
<span
  className={`text-[13px] sm:text-[14px] ${
    value
      ? "text-[var(--user-input-text)]"
      : "text-[var(--user-input-placeholder)]"
  }`}
>
          {value || placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {error && (
        <p className="mt-1.5 text-[12px] text-[var(--user-danger)]">
          {error}
        </p>
      )}

      {open && (
        <div
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-[var(--user-radius-md)] border bg-[var(--user-card-bg)] shadow-lg"
          style={{
            borderColor:
              "var(--user-card-border)",
          }}
        >
          <div className="border-b p-2.5">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--user-text-muted)]"
              />

              <input
                ref={inputRef}
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value,
                  )
                }
                placeholder="Search country..."
                className="h-9 sm:h-10 w-full rounded-lg border bg-[var(--user-input-bg)] pl-9 pr-3 text-[13px] sm:text-[14px] text-[var(--user-input-text)] outline-none"
                style={{
                  borderColor:
                    "var(--user-input-border)",
                }}
              />
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="p-3 text-center text-[13px] text-[var(--user-text-muted)]">
                No country found.
              </div>
            )}

            {filtered.map((country) => (
              <button
                key={country}
                type="button"
onClick={() => {
  onChange(country);

  setSearch("");

  setOpen(false);
}}
                className="flex w-full items-center justify-between px-3 py-2.5 text-left transition hover:bg-[var(--user-card-hover)]"
              >
                <span className="text-[13px] sm:text-[14px] text-[var(--user-text)]">
                  {country}
                </span>

                {value === country && (
                  <Check
                    size={16}
                    className="text-[var(--user-success)]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}