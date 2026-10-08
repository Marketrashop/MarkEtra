"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

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
    selection:
      | ProductVariantSelection
      | null,
  ) => void;
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

function isAvailable(
  inventory: ProductVariantSize,
) {
  return (
    inventory.stock -
      inventory.reservedStock >
      0 ||
    inventory.allowPreorder
  );
}

function getVariantTypeLabel(
  type: ProductVariant["type"],
) {
  return variantTypeLabels[
    type
  ];
}

function getVariantInventory(
  variant: ProductVariant,
) {
  return variant.sizes ?? [];
}

function getInitialVariant(
  variants: ProductVariant[],
) {
  return (
    variants.find(
      (variant) =>
        variant.sizes.some(
          isAvailable,
        ),
    ) ??
    variants[0] ??
    null
  );
}

function getInitialInventory(
  variant: ProductVariant | null,
) {
  if (!variant) {
    return null;
  }

  return (
    variant.sizes.find(
      isAvailable,
    ) ??
    variant.sizes[0] ??
    null
  );
}

function shouldShowInventorySelector(
  variant: ProductVariant | null,
) {
  if (!variant) {
    return false;
  }

  if (
    variant.sizes.length === 0
  ) {
    return false;
  }

  const hasNamedOptions =
    variant.sizes.some(
      (inventory) =>
        Boolean(
          inventory.size?.trim(),
        ),
    );

  return (
    variant.sizes.length >
      1 &&
    hasNamedOptions
  );
}

export default function ProductVariantPicker({
  variants,
  disabled = false,
  onVariantChange,
}: ProductVariantPickerProps) {
  const selectableVariants =
    useMemo(
      () =>
        variants.filter(
          (variant) =>
            Boolean(
              variant.label?.trim(),
            ) ||
            variant.type ===
              "DEFAULT",
        ),
      [variants],
    );

const hasOnlyDefaultVariant =
  selectableVariants.length === 1 &&
  selectableVariants[0]?.type === "DEFAULT" &&
  !selectableVariants[0]?.label?.trim();

  const variantGroups =
    useMemo(() => {
      const groups =
        new Map<
          ProductVariant["type"],
          ProductVariant[]
        >();

      for (
        const variant of
        selectableVariants
      ) {
        const current =
          groups.get(
            variant.type,
          ) ?? [];

        current.push(
          variant,
        );

        groups.set(
          variant.type,
          current,
        );
      }

      return Array.from(
        groups.entries(),
      ).map(
        ([
          type,
          groupVariants,
        ]) => ({
          type,

          label:
            getVariantTypeLabel(
              type,
            ),

          variants:
            groupVariants,
        }),
      );
    }, [
      selectableVariants,
    ]);

const [
  selectedVariantIds,
  setSelectedVariantIds,
] = useState<
  Partial<
    Record<
      ProductVariant["type"],
      string
    >
  >
>({});

  const [
    selectedInventoryIds,
    setSelectedInventoryIds,
  ] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (
      selectableVariants.length ===
      0
    ) {
      return;
    }

    setSelectedVariantIds(
      (current) => {
        const next = {
          ...current,
        };

        let changed =
          false;

        for (
          const group of
          variantGroups
        ) {
          const currentId =
            current[
              group.type
            ];

          const currentVariant =
            group.variants.find(
              (variant) =>
                variant.id ===
                currentId,
            );

          if (
            currentVariant
          ) {
            continue;
          }

          const initialVariant =
            getInitialVariant(
              group.variants,
            );

          if (
            initialVariant
          ) {
            next[group.type] =
              initialVariant.id;

            changed =
              true;
          }
        }

        return changed
          ? next
          : current;
      },
    );
  }, [
    selectableVariants,
    variantGroups,
  ]);

  const selectedVariants =
    useMemo(() => {
      return variantGroups
        .map(
          (group) => {
            const selectedId =
              selectedVariantIds[
                group.type
              ];

            return (
              group.variants.find(
                (variant) =>
                  variant.id ===
                  selectedId,
              ) ??
              getInitialVariant(
                group.variants,
              )
            );
          },
        )
        .filter(
          (
            variant,
          ): variant is ProductVariant =>
            Boolean(variant),
        );
    }, [
      selectedVariantIds,
      variantGroups,
    ]);

  useEffect(() => {
    setSelectedInventoryIds(
      (current) => {
        const next = {
          ...current,
        };

        let changed =
          false;

        for (
          const variant of
          selectedVariants
        ) {
          const inventory =
            getVariantInventory(
              variant,
            );

          if (
            inventory.length ===
            0
          ) {
            continue;
          }

          const currentId =
            current[
              variant.id
            ];

          const currentInventory =
            inventory.find(
              (item) =>
                item.id ===
                currentId,
            );

          if (
            currentInventory &&
            isAvailable(
              currentInventory,
            )
          ) {
            continue;
          }

          const initialInventory =
            getInitialInventory(
              variant,
            );

          if (
            initialInventory
          ) {
            next[variant.id] =
              initialInventory.id;

            changed =
              true;
          }
        }

        return changed
          ? next
          : current;
      },
    );
  }, [
    selectedVariants,
  ]);

  const primarySelection =
    useMemo(() => {
      const variant =
        selectedVariants[0];

      if (!variant) {
        return null;
      }

      const inventoryId =
        selectedInventoryIds[
          variant.id
        ];

      const inventory =
        variant.sizes.find(
          (item) =>
            item.id ===
            inventoryId,
        ) ??
        getInitialInventory(
          variant,
        );

      if (!inventory) {
        return null;
      }

      return {
        variant,

        inventory,
      };
    }, [
      selectedInventoryIds,
      selectedVariants,
    ]);

  useEffect(() => {
    onVariantChange?.(
      primarySelection,
    );
  }, [
    onVariantChange,
    primarySelection,
  ]);

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
    if (disabled) {
      return;
    }

    setSelectedVariantIds(
      (current) => ({
        ...current,

        [type]:
          variantId,
      }),
    );
  }

  function handleInventoryChange(
    variantId: string,
    inventoryId: string,
  ) {
    if (disabled) {
      return;
    }

    setSelectedInventoryIds(
      (current) => ({
        ...current,

        [variantId]:
          inventoryId,
      }),
    );
  }

  return (
    <div
className="
  space-y-3
  lg:space-y-5
"
    >
      {variantGroups.map(
        (group) => {
          const selectedId =
            selectedVariantIds[
              group.type
            ];

          const selectedVariant =
            group.variants.find(
              (variant) =>
                variant.id ===
                selectedId,
            ) ??
            getInitialVariant(
              group.variants,
            );

          if (
            group.variants.length ===
              0 ||
            !selectedVariant
          ) {
            return null;
          }

          const inventory =
            getVariantInventory(
              selectedVariant,
            );

          const showInventory =
            shouldShowInventorySelector(
              selectedVariant,
            );

          const selectedInventoryId =
            selectedInventoryIds[
              selectedVariant.id
            ];

          return (
            <div
              key={
                group.type
              }
className="
  space-y-1.5
  lg:space-y-2.5
"
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <span
                  className="
text-[13px]
font-medium
lg:text-sm
                    text-[var(--foreground)]
                  "
                >
                  {
                    group.label
                  }
                </span>

                {selectedVariant.label && (
                  <span
                    className="
                      text-sm
                      text-[var(--foreground-muted)]
                    "
                  >
                    {
                      selectedVariant.label
                    }
                  </span>
                )}
              </div>

              <div
                className="
                  flex
                  flex-wrap
                  gap-1.5
                  lg:gap-2
                "
              >
                {group.variants.map(
                  (
                    variant,
                  ) => {
                    const variantInventory =
                      getVariantInventory(
                        variant,
                      );

                    const available =
                      variantInventory.some(
                        isAvailable,
                      );

                    const preorder =
                      variantInventory.some(
                        (
                          item,
                        ) =>
                          item.allowPreorder,
                      );

                    const selected =
                      variant.id ===
                      selectedVariant.id;

                    return (
                      <button
                        key={
                          variant.id
                        }
                        type="button"
                        disabled={
                          disabled ||
                          (
                            !available &&
                            !preorder
                          )
                        }
                        onClick={() =>
                          handleVariantChange(
                            group.type,
                            variant.id,
                          )
                        }
                        className={`
rounded-lg
border
px-3
py-1.5
min-h-9
text-[13px]
transition
lg:min-h-10
lg:px-4
lg:py-2.5
lg:text-sm

                          ${
                            selected
                              ? `
                                  border-[var(--foreground)]
                                  bg-[var(--foreground)]
                                  text-[var(--background)]
                                `
                              : available ||
                                  preorder
                                ? `
                                    border-[var(--border)]
                                    bg-transparent
                                    text-[var(--foreground)]
                                    hover:border-[var(--foreground)]
                                  `
                                : `
                                    cursor-not-allowed
                                    border-[var(--border)]
                                    text-[var(--foreground-muted)]
                                    opacity-50
                                  `
                          }
                        `}
                      >
                        {variant.label ||
                          "Default"}
                      </button>
                    );
                  },
                )}
              </div>

              {showInventory && (
                <div
className="
  space-y-1.5
  lg:space-y-2.5
  pt-1
"
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <span
                      className="
text-[13px]
font-medium
lg:text-sm
                        text-[var(--foreground)]
                      "
                    >
                      Size
                    </span>

                    {selectedInventoryId && (
                      <span
                        className="
                          text-sm
                          text-[var(--foreground-muted)]
                        "
                      >
                        {
                          inventory.find(
                            (
                              item,
                            ) =>
                              item.id ===
                              selectedInventoryId,
                          )?.size
                        }
                      </span>
                    )}
                  </div>

                  <div
                    className="
                      flex
                      flex-wrap
                      gap-2
                    "
                  >
                    {inventory.map(
                      (
                        item,
                      ) => {
                        const available =
                          isAvailable(
                            item,
                          );

                        const selected =
                          item.id ===
                          selectedInventoryId;

                        return (
                          <button
                            key={
                              item.id
                            }
                            type="button"
                            disabled={
                              disabled ||
                              !available
                            }
                            onClick={() =>
                              handleInventoryChange(
                                selectedVariant.id,
                                item.id,
                              )
                            }
                            className={`
rounded-lg
border
px-3
py-1.5
min-h-9
text-[13px]
transition
lg:min-h-10
lg:px-4
lg:py-2.5
lg:text-sm

                              ${
                                selected
                                  ? `
                                      border-[var(--foreground)]
                                      bg-[var(--foreground)]
                                      text-[var(--background)]
                                    `
                                  : available
                                    ? `
                                        border-[var(--border)]
                                        bg-transparent
                                        text-[var(--foreground)]
                                        hover:border-[var(--foreground)]
                                      `
                                    : `
                                        cursor-not-allowed
                                        border-[var(--border)]
                                        text-[var(--foreground-muted)]
                                        line-through
                                        opacity-50
                                      `
                              }
                            `}
                          >
                            {
                              item.size
                            }
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        },
      )}
    </div>
  );
}