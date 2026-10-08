"use client";

import { Plus, Trash2 } from "lucide-react";

import type {
  ProductSpecificationSchema,
} from "@/validation/product.validation";

type ProductSpecificationsProps = {
  value: ProductSpecificationSchema[];

  disabled?: boolean;

  onChange: (
    specifications: ProductSpecificationSchema[]
  ) => void;
};

const emptySpecification =
  (): ProductSpecificationSchema => ({
    name: "",
    value: "",
    sortOrder: 0,
  });

export default function ProductSpecifications({
  value,
  disabled = false,
  onChange,
}: ProductSpecificationsProps) {
  function normalize(
    specifications: ProductSpecificationSchema[]
  ) {
    return specifications.map(
      (
        specification,
        index
      ) => ({
        ...specification,
        sortOrder: index,
      })
    );
  }

  function addSpecification() {
    onChange(
      normalize([
        ...value,
        emptySpecification(),
      ])
    );
  }

  function removeSpecification(
    index: number
  ) {
    onChange(
      normalize(
        value.filter(
          (
            _,
            current
          ) => current !== index
        )
      )
    );
  }

  function updateSpecification(
    index: number,
    field: keyof ProductSpecificationSchema,
    fieldValue: string
  ) {
    const next = [...value];

    next[index] = {
      ...next[index],
      [field]: fieldValue,
    };

    onChange(normalize(next));
  }

  return (
    <section
      className="
        space-y-3
        sm:space-y-[var(--space-lg)]
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-2
          sm:items-center
          sm:gap-4
        "
      >
        <div>
          <h3
            className="
              text-[11px]
              font-semibold
              text-[var(--admin-title)]
              sm:text-sm
            "
          >
            Specifications
          </h3>

          <p
            className="
              mt-0.5
              max-w-[220px]
              text-[9px]
              leading-3.5
              text-[var(--admin-muted)]
              sm:mt-1
              sm:max-w-none
              sm:text-xs
              sm:leading-normal
            "
          >
            Technical details
            displayed on the
            product page.
          </p>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={addSpecification}
          className="
            inline-flex
            h-7
            shrink-0
            items-center
            justify-center
            gap-1
            rounded-md
            border
            border-[var(--admin-card-border)]
            bg-[var(--admin-table-header-bg)]
            px-2.5
            text-[9px]
            font-medium
            text-[var(--admin-table-title)]
            transition
            hover:opacity-90
            focus:outline-none
            disabled:pointer-events-none
            disabled:opacity-60
            sm:h-9
            sm:gap-2
            sm:rounded-[var(--admin-input-radius)]
            sm:px-3
            sm:text-xs
          "
        >
          <Plus
            size={12}
            className="
              sm:h-3.5
              sm:w-3.5
            "
          />

          Add Specification
        </button>
      </div>

      {value.length === 0 && (
        <div
          className="
            rounded-md
            border
            border-dashed
            border-[var(--admin-card-border)]
            px-3
            py-6
            text-center
            text-[9px]
            leading-3.5
            text-[var(--admin-muted)]
            sm:rounded-[var(--admin-surface-radius)]
            sm:p-5
            sm:text-sm
            sm:leading-normal
          "
        >
          No specifications added.
        </div>
      )}

      {value.map(
        (
          specification,
          index
        ) => (
          <div
            key={index}
            className="
              rounded-lg
              border
              border-[var(--admin-card-border)]
              bg-[var(--admin-card-bg)]
              p-2.5
              sm:rounded-[var(--admin-surface-radius)]
              sm:p-[var(--space-lg)]
            "
          >
            <div
              className="
                grid
                gap-2
                md:grid-cols-[1fr_2fr_auto]
                sm:gap-[var(--space-md)]
              "
            >
              <input
                placeholder="Name"
                value={
                  specification.name
                }
                disabled={disabled}
                onChange={(
                  event
                ) =>
                  updateSpecification(
                    index,
                    "name",
                    event.target
                      .value
                  )
                }
                className="
                  h-8
                  rounded-md
                  border
                  border-[var(--admin-input-border)]
                  bg-[var(--admin-input-bg)]
                  px-2.5
                  text-[10px]
                  text-[var(--admin-input-text)]
                  outline-none
                  transition
                  focus:border-[var(--admin-input-focus)]
                  sm:h-10
                  sm:rounded-[var(--admin-input-radius)]
                  sm:px-3
                  sm:text-sm
                "
              />

              <input
                placeholder="Value"
                value={
                  specification.value
                }
                disabled={disabled}
                onChange={(
                  event
                ) =>
                  updateSpecification(
                    index,
                    "value",
                    event.target
                      .value
                  )
                }
                className="
                  h-8
                  rounded-md
                  border
                  border-[var(--admin-input-border)]
                  bg-[var(--admin-input-bg)]
                  px-2.5
                  text-[10px]
                  text-[var(--admin-input-text)]
                  outline-none
                  transition
                  focus:border-[var(--admin-input-focus)]
                  sm:h-10
                  sm:rounded-[var(--admin-input-radius)]
                  sm:px-3
                  sm:text-sm
                "
              />

              <button
                type="button"
                disabled={disabled}
                onClick={() =>
                  removeSpecification(
                    index
                  )
                }
                className="
                  inline-flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-md
                  border
                  border-[var(--admin-button-secondary-border)]
                  bg-[var(--admin-button-secondary-bg)]
                  text-[var(--user-danger)]
                  transition
                  hover:bg-[var(--admin-button-secondary-hover)]
                  disabled:pointer-events-none
                  disabled:opacity-50
                  sm:h-10
                  sm:w-10
                  sm:rounded-[var(--admin-input-radius)]
                "
                aria-label="Remove specification"
              >
                <Trash2
                  size={13}
                  className="
                    sm:h-4
                    sm:w-4
                  "
                />
              </button>
            </div>
          </div>
        )
      )}
    </section>
  );
}