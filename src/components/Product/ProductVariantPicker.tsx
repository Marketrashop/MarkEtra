"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { toast } from "sonner";

import type {
  ProductVariant,
  ProductVariantSize,
} from "@/lib/products/product.types";

export type ProductVariantSelection = {
  variant: ProductVariant;
  inventory: ProductVariantSize;
};

type ProductVariantPickerProps = {
  variants: ProductVariant[];
  disabled?: boolean;
  onVariantChange?: (
    selection: ProductVariantSelection | null,
  ) => void;
};

type SizeRegion = "EU" | "US" | "UK" | "CM";

const SIZE_REGIONS: SizeRegion[] = ["EU", "US", "UK", "CM"];

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

const variantTypeLabels = {
  DEFAULT: "Option",
  COLOR: "Color",
  STORAGE: "Storage",
  MATERIAL: "Material",
  PACK_SIZE: "Pack Size",
  STYLE: "Style",
  OTHER: "Option",
} as const;

function isAvailable(inventory: ProductVariantSize) {
  return (
    inventory.stock - inventory.reservedStock > 0 ||
    inventory.allowPreorder
  );
}

function getVariantTypeLabel(type: ProductVariant["type"]) {
  return variantTypeLabels[type];
}

function getVariantInventory(variant: ProductVariant) {
  return variant.sizes ?? [];
}

function getInitialVariant(variants: ProductVariant[]) {
  return (
    variants.find((variant) =>
      variant.sizes.some(isAvailable),
    ) ??
    variants[0] ??
    null
  );
}

function getInitialInventory(variant: ProductVariant | null) {
  if (!variant) return null;

  return (
    variant.sizes.find(isAvailable) ??
    variant.sizes[0] ??
    null
  );
}

function shouldShowInventorySelector(variant: ProductVariant | null) {
  if (!variant || variant.sizes.length === 0) return false;

  const hasNamedOptions = variant.sizes.some((inventory) =>
    Boolean(inventory.size?.trim()),
  );

  return variant.sizes.length > 1 && hasNamedOptions;
}

function normalizeCanonicalSize(size: string | null | undefined) {
  if (!size?.trim()) return null;

  const normalized = size.trim();

  // Handles canonical EU values such as "EU 42" as well as "42".
  const match = normalized.match(/^(?:EU\s*)?(\d+(?:\.\d+)?)$/i);
  return match?.[1] ?? normalized;
}

function getDisplaySize(
  canonicalSize: string | null | undefined,
  region: SizeRegion,
) {
  const normalized = normalizeCanonicalSize(canonicalSize);
  if (!normalized) return canonicalSize ?? "";

  return SIZE_CONVERSIONS[normalized]?.[region] ?? normalized;
}

export default function ProductVariantPicker({
  variants,
  disabled = false,
  onVariantChange,
}: ProductVariantPickerProps) {
  const selectableVariants = useMemo(
    () =>
      variants.filter(
        (variant) =>
          Boolean(variant.label?.trim()) ||
          variant.type === "DEFAULT",
      ),
    [variants],
  );

  const hasOnlyDefaultVariant =
    selectableVariants.length === 1 &&
    selectableVariants[0]?.type === "DEFAULT" &&
    !selectableVariants[0]?.label?.trim();

  const variantGroups = useMemo(() => {
    const groups = new Map<
      ProductVariant["type"],
      ProductVariant[]
    >();

    for (const variant of selectableVariants) {
      const current = groups.get(variant.type) ?? [];
      current.push(variant);
      groups.set(variant.type, current);
    }

    return Array.from(groups.entries()).map(
      ([type, groupVariants]) => ({
        type,
        label: getVariantTypeLabel(type),
        variants: groupVariants,
      }),
    );
  }, [selectableVariants]);

  const [selectedVariantIds, setSelectedVariantIds] =
    useState<Partial<Record<ProductVariant["type"], string>>>({});

  const [selectedInventoryIds, setSelectedInventoryIds] =
    useState<Record<string, string>>({});

  const [sizeRegion, setSizeRegion] = useState<SizeRegion>("EU");

  useEffect(() => {
    if (selectableVariants.length === 0) return;

    setSelectedVariantIds((current) => {
      const next = { ...current };
      let changed = false;

      for (const group of variantGroups) {
        const currentId = current[group.type];
        const currentVariant = group.variants.find(
          (variant) => variant.id === currentId,
        );

        if (currentVariant) continue;

        const initialVariant = getInitialVariant(group.variants);

        if (initialVariant) {
          next[group.type] = initialVariant.id;
          changed = true;
        }
      }

      return changed ? next : current;
    });
  }, [selectableVariants, variantGroups]);

  const selectedVariants = useMemo(
    () =>
      variantGroups
        .map((group) => {
          const selectedId = selectedVariantIds[group.type];

          return (
            group.variants.find(
              (variant) => variant.id === selectedId,
            ) ?? getInitialVariant(group.variants)
          );
        })
        .filter(
          (variant): variant is ProductVariant => Boolean(variant),
        ),
    [selectedVariantIds, variantGroups],
  );

  useEffect(() => {
    setSelectedInventoryIds((current) => {
      const next = { ...current };
      let changed = false;

      for (const variant of selectedVariants) {
        const inventory = getVariantInventory(variant);
        if (inventory.length === 0) continue;

        const currentId = current[variant.id];
        const currentInventory = inventory.find(
          (item) => item.id === currentId,
        );

        if (currentInventory && isAvailable(currentInventory)) {
          continue;
        }

        const initialInventory = getInitialInventory(variant);

        if (initialInventory) {
          next[variant.id] = initialInventory.id;
          changed = true;
        }
      }

      return changed ? next : current;
    });
  }, [selectedVariants]);

  const primarySelection = useMemo(() => {
    const variant = selectedVariants[0];
    if (!variant) return null;

    const inventoryId = selectedInventoryIds[variant.id];

    const inventory =
      variant.sizes.find((item) => item.id === inventoryId) ??
      getInitialInventory(variant);

    if (!inventory) return null;

    return { variant, inventory };
  }, [selectedInventoryIds, selectedVariants]);

  useEffect(() => {
    onVariantChange?.(primarySelection);
  }, [onVariantChange, primarySelection]);

  if (
    selectableVariants.length === 0 ||
    hasOnlyDefaultVariant
  ) {
    return null;
  }

  function handleVariantChange(
    type: ProductVariant["type"],
    variantId: string,
  ) {
    if (disabled) return;

    setSelectedVariantIds((current) => ({
      ...current,
      [type]: variantId,
    }));
  }

  function handleInventoryChange(
    variantId: string,
    inventoryId: string,
  ) {
    if (disabled) return;

    setSelectedInventoryIds((current) => ({
      ...current,
      [variantId]: inventoryId,
    }));
  }

  return (
    <div className="space-y-3 lg:space-y-5">
      {variantGroups.map((group) => {
        const selectedId = selectedVariantIds[group.type];

        const selectedVariant =
          group.variants.find(
            (variant) => variant.id === selectedId,
          ) ?? getInitialVariant(group.variants);

        if (group.variants.length === 0 || !selectedVariant) {
          return null;
        }

        const inventory = getVariantInventory(selectedVariant);
        const showInventory =
          shouldShowInventorySelector(selectedVariant);
        const selectedInventoryId =
          selectedInventoryIds[selectedVariant.id];

        const selectedInventory = inventory.find(
          (item) => item.id === selectedInventoryId,
        );

        // Footwear sizes can be stored under a COLOR variant,
        // for example, Black with EU 36 through EU 52 inventory.
        // Identify footwear by the canonical EU size range, not variant type.
        const footwearInventory =
          inventory.length > 0 &&
          inventory.every((item) => {
            const canonicalSize =
              normalizeCanonicalSize(item.size);

            const euSize = Number(canonicalSize);

            return (
              canonicalSize !== null &&
              Number.isFinite(euSize) &&
              euSize >= 36 &&
              euSize <= 52
            );
          });

        return (
          <div
            key={group.type}
            className="space-y-1.5 lg:space-y-2.5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] font-medium text-[var(--foreground)] lg:text-sm">
                {group.label}
              </span>

              {selectedVariant.label && (
                <span className="text-sm text-[var(--foreground-muted)]">
                  {selectedVariant.label}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 lg:gap-2">
              {group.variants.map((variant) => {
                const variantInventory =
                  getVariantInventory(variant);
                const available =
                  variantInventory.some(isAvailable);
                const preorder =
                  variantInventory.some((item) =>
                    item.allowPreorder,
                  );
                const selected =
                  variant.id === selectedVariant.id;

                return (
                  <button
                    key={variant.id}
                    type="button"
                    disabled={
                      disabled || (!available && !preorder)
                    }
                    onClick={() =>
                      handleVariantChange(group.type, variant.id)
                    }
                    className={`rounded-lg border px-3 py-1.5 min-h-9 text-[13px] transition lg:min-h-10 lg:px-4 lg:py-2.5 lg:text-sm ${
                      selected
                        ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                        : available || preorder
                          ? "border-[var(--border)] bg-transparent text-[var(--foreground)] hover:border-[var(--foreground)]"
                          : "cursor-not-allowed border-[var(--border)] text-[var(--foreground-muted)] opacity-50"
                    }`}
                  >
                    {variant.label || "Default"}
                  </button>
                );
              })}
            </div>

            {showInventory && (
              <div className="space-y-1.5 pt-1 lg:space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13px] font-medium text-[var(--foreground)] lg:text-sm">
                    Size
                  </span>

                  {selectedInventory && (
                    <span className="text-sm text-[var(--foreground-muted)]">
                      {footwearInventory
                        ? getDisplaySize(
                            selectedInventory.size,
                            sizeRegion,
                          )
                        : selectedInventory.size}
                    </span>
                  )}
                </div>

                {footwearInventory && (
                  <div
                    className="inline-flex items-center gap-0.5 rounded-full border border-[var(--border)] p-0.5"
                    aria-label="Size region"
                  >
                    {SIZE_REGIONS.map((region) => (
                      <button
                        key={region}
                        type="button"
                        disabled={disabled}
                        aria-pressed={sizeRegion === region}
                        onClick={() => setSizeRegion(region)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                          sizeRegion === region
                            ? "bg-black text-white"
                            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                        } ${
                          disabled
                            ? "cursor-not-allowed opacity-60"
                            : ""
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {inventory.map((item) => {
                    const available = isAvailable(item);
                    const selected = item.id === selectedInventoryId;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-disabled={disabled || !available}
                        aria-pressed={selected}
                        onClick={() => {
                          if (disabled) return;

                          if (!available) {
                            const label = footwearInventory
                              ? `${sizeRegion} ${getDisplaySize(item.size, sizeRegion)}`
                              : item.size;

                            toast.error(`${label} is currently unavailable.`);
                            return;
                          }

                          handleInventoryChange(
                            selectedVariant.id,
                            item.id,
                          );
                        }}
                        className={`rounded-lg border px-3 py-1.5 min-h-9 text-[13px] transition lg:min-h-10 lg:px-4 lg:py-2.5 lg:text-sm ${
                          selected
                            ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                            : available
                              ? "border-[var(--border)] bg-transparent text-[var(--foreground)] hover:border-[var(--foreground)]"
                              : "cursor-not-allowed border-[var(--border)] text-[var(--foreground-muted)] line-through opacity-50"
                        }`}
                      >
                        {footwearInventory
                          ? getDisplaySize(item.size, sizeRegion)
                          : item.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
