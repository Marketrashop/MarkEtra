"use client";

import { useMemo, useState } from "react";

type ProductSizePickerProps = {
  sizes: string[];
  selectedSize: string | null;
  disabled?: boolean;
  onChange: (size: string) => void;
};

type SizeRegion = "EU" | "US" | "UK" | "CM";

const SIZE_CONVERSIONS: Record<
  string,
  Record<SizeRegion, string>
> = {
  "36": { EU: "36", US: "4", UK: "3.5", CM: "22.5" },
  "37": { EU: "37", US: "5", UK: "4.5", CM: "23.5" },
  "38": { EU: "38", US: "6", UK: "5.5", CM: "24" },
  "39": { EU: "39", US: "6.5", UK: "6", CM: "24.5" },
  "40": { EU: "40", US: "7.5", UK: "6.5", CM: "25" },
  "41": { EU: "41", US: "8", UK: "7", CM: "26" },
  "42": { EU: "42", US: "9", UK: "8", CM: "26.5" },
  "43": { EU: "43", US: "10", UK: "9", CM: "27.5" },
  "44": { EU: "44", US: "10.5", UK: "9.5", CM: "28" },
  "45": { EU: "45", US: "11.5", UK: "10.5", CM: "29" },
  "46": { EU: "46", US: "12", UK: "11", CM: "29.5" },
  "47": { EU: "47", US: "13", UK: "12", CM: "30.5" },
  "48": { EU: "48", US: "14", UK: "13", CM: "31" },
  "49": { EU: "49", US: "15", UK: "14", CM: "32" },
  "50": { EU: "50", US: "16", UK: "15", CM: "32.5" },
  "51": { EU: "51", US: "17", UK: "16", CM: "33.5" },
  "52": { EU: "52", US: "18", UK: "17", CM: "34" },
};

const REGIONS: SizeRegion[] = ["EU", "US", "UK", "CM"];

export default function ProductSizePicker({
  sizes,
  selectedSize,
  disabled = false,
  onChange,
}: ProductSizePickerProps) {
  const [region, setRegion] = useState<SizeRegion>("EU");

  const uniqueSizes = useMemo(
    () =>
      [...new Set(sizes.map((size) => size.trim()).filter(Boolean))]
        .sort((a, b) => Number(a) - Number(b)),
    [sizes]
  );

  if (uniqueSizes.length === 0) {
    return null;
  }

  const selectedEUSize = selectedSize
    ? String(Number(selectedSize))
    : null;

  const getDisplaySize = (euSize: string) =>
    SIZE_CONVERSIONS[euSize]?.[region] ?? euSize;

  const getCanonicalSize = (displaySize: string) => {
    if (region === "EU") {
      return displaySize;
    }

    const match = Object.entries(SIZE_CONVERSIONS).find(
      ([, conversion]) => conversion[region] === displaySize
    );

    return match?.[0] ?? displaySize;
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-[var(--foreground)]">
          Size
        </h3>

        <div
          className="inline-flex items-center gap-0.5 rounded-full border border-[var(--border)] p-0.5"
          aria-label="Size region"
        >
          {REGIONS.map((item) => (
            <button
              key={item}
              type="button"
              disabled={disabled}
              aria-pressed={region === item}
              onClick={() => setRegion(item)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                region === item
                  ? "bg-black text-white"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {uniqueSizes.map((euSize) => {
          const displaySize = getDisplaySize(euSize);
          const active = euSize === selectedEUSize;

          return (
            <button
              key={euSize}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              onClick={() => onChange(getCanonicalSize(displaySize))}
              className={`min-w-11 rounded-[var(--radius-md)] border px-3.5 py-2 text-sm font-medium transition ${
                active
                  ? "border-black bg-black text-white"
                  : "border-[var(--border)] bg-transparent hover:border-black"
              } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
            >
              {displaySize}
            </button>
          );
        })}
      </div>
    </section>
  );
}
