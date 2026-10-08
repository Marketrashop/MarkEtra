"use client";

import {
  GripVertical,
  Star,
  Trash2,
} from "lucide-react";

import CloudinaryUploader from "@/components/shared/CloudinaryUploader";

import type {
  ProductImageInput,
} from "@/validation/product.validation";

type ProductImagesProps = {
  value: ProductImageInput[];

  disabled?: boolean;

  onChange: (
    images: ProductImageInput[],
  ) => void;
};

const createImage = (
  imageKey: string,
): ProductImageInput => ({
  imageKey,
  altText: "",
  isPrimary: false,
  sortOrder: 0,
});

export default function ProductImages({
  value,
  disabled = false,
  onChange,
}: ProductImagesProps) {
  function normalize(
    images: ProductImageInput[],
  ): ProductImageInput[] {
    return images.map(
      (image, index) => ({
        ...image,
        sortOrder: index,
      }),
    );
  }

  function addImage(
    imageKey: string | null,
  ) {
    if (!imageKey) {
      return;
    }

    const next = normalize([
      ...value,
      {
        ...createImage(imageKey),
        isPrimary:
          value.length === 0,
      },
    ]);

    onChange(next);
  }

  function removeImage(
    index: number,
  ) {
    const next = value.filter(
      (_, current) =>
        current !== index,
    );

    if (
      next.length > 0 &&
      !next.some(
        (image) =>
          image.isPrimary === true,
      )
    ) {
      next[0] = {
        ...next[0],
        isPrimary: true,
      };
    }

    onChange(normalize(next));
  }

  function setPrimary(
    index: number,
  ) {
    onChange(
      normalize(
        value.map(
          (image, current) => ({
            ...image,
            isPrimary:
              current === index,
          }),
        ),
      ),
    );
  }

  function move(
    from: number,
    to: number,
  ) {
    if (
      to < 0 ||
      to >= value.length
    ) {
      return;
    }

    const next = [...value];

    const [item] =
      next.splice(from, 1);

    if (!item) {
      return;
    }

    next.splice(to, 0, item);

    onChange(
      normalize(next),
    );
  }

  function updateAlt(
    index: number,
    altText: string,
  ) {
    const next = [...value];

    const image = next[index];

    if (!image) {
      return;
    }

    next[index] = {
      ...image,
      altText,
    };

    onChange(next);
  }

  return (
    <section
      className="
        space-y-3
        sm:space-y-[var(--space-lg)]
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
          Product's Primary Image
        </h3>

        <p
          className="
            mt-0.5
            text-[9px]
            leading-3.5
            text-[var(--admin-muted)]
            sm:mt-1
            sm:text-xs
            sm:leading-normal
          "
        >
          Upload one or more images.
          Select one as the primary
          product image.
        </p>
      </div>

      <div className="relative">
        <CloudinaryUploader
          value={
            value[0]?.imageKey ?? null
          }
          folder="products"
          disabled={disabled}
          onChange={addImage}
        />
      </div>

      {value.length > 0 && (
        <div
          className="
            space-y-2
            sm:space-y-[var(--space-md)]
          "
        >
          {value.map(
            (
              image,
              index,
            ) => (
              <div
                key={`${image.imageKey}-${index}`}
                className="
                  flex
                  flex-col
                  gap-2
                  rounded-lg
                  border
                  border-[var(--admin-card-border)]
                  bg-[var(--admin-card-bg)]
                  p-2.5
                  sm:gap-[var(--space-md)]
                  sm:rounded-[var(--admin-surface-radius)]
                  sm:p-[var(--space-md)]
                  md:flex-row
                  md:items-center
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    sm:gap-[var(--space-sm)]
                  "
                >
                  <GripVertical
                    size={13}
                    className="
                      text-[var(--admin-muted)]
                      sm:h-4
                      sm:w-4
                    "
                  />

                  <img
                    src={`/api/image/${image.imageKey}`}
                    alt=""
                    className="
                      h-10
                      w-10
                      rounded-md
                      border
                      border-[var(--admin-card-border)]
                      object-cover
                      sm:h-16
                      sm:w-16
                      sm:rounded-[var(--radius-md)]
                    "
                  />
                </div>

                <div className="flex-1">
                  <input
                    type="text"
                    value={
                      image.altText ??
                      ""
                    }
                    disabled={disabled}
                    placeholder="Alt text"
                    onChange={(
                      event,
                    ) =>
                      updateAlt(
                        index,
                        event.target.value,
                      )
                    }
                    className="
                      h-8
                      w-full
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
                </div>

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-1
                    sm:gap-2
                  "
                >
                  <button
                    type="button"
                    disabled={
                      disabled ||
                      index === 0
                    }
                    onClick={() =>
                      move(
                        index,
                        index - 1,
                      )
                    }
                    className="
                      inline-flex
                      h-7
                      min-w-7
                      items-center
                      justify-center
                      rounded-md
                      border
                      border-[var(--admin-card-border)]
                      bg-[var(--admin-button-secondary-bg)]
                      px-1.5
                      text-[9px]
                      text-[var(--admin-title)]
                      transition
                      hover:bg-[var(--admin-bg)]
                      disabled:pointer-events-none
                      disabled:opacity-50
                      sm:h-9
                      sm:min-w-9
                      sm:rounded-lg
                      sm:px-3
                      sm:text-xs
                    "
                    aria-label="Move image up"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    disabled={
                      disabled ||
                      index ===
                        value.length -
                          1
                    }
                    onClick={() =>
                      move(
                        index,
                        index + 1,
                      )
                    }
                    className="
                      inline-flex
                      h-7
                      min-w-7
                      items-center
                      justify-center
                      rounded-md
                      border
                      border-[var(--admin-card-border)]
                      bg-[var(--admin-button-secondary-bg)]
                      px-1.5
                      text-[9px]
                      text-[var(--admin-title)]
                      transition
                      hover:bg-[var(--admin-bg)]
                      disabled:pointer-events-none
                      disabled:opacity-50
                      sm:h-9
                      sm:min-w-9
                      sm:rounded-lg
                      sm:px-3
                      sm:text-xs
                    "
                    aria-label="Move image down"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                      setPrimary(index)
                    }
                    className={`
                      inline-flex
                      h-7
                      items-center
                      gap-1
                      rounded-md
                      px-2
                      text-[9px]
                      transition
                      sm:h-9
                      sm:gap-1
                      sm:rounded-lg
                      sm:px-3
                      sm:text-xs
                      ${
                        image.isPrimary
                          ? "bg-[var(--admin-plan-active-bg)] text-[var(--admin-status-success-text)]"
                          : "border border-[var(--admin-card-border)] bg-[var(--admin-button-secondary-bg)] text-[var(--admin-title)]"
                      }
                    `}
                  >
                    <Star
                      size={12}
                      fill={
                        image.isPrimary
                          ? "currentColor"
                          : "none"
                      }
                      className="
                        sm:h-3.5
                        sm:w-3.5
                      "
                    />

                    Primary
                  </button>

                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                      removeImage(index)
                    }
                    className="
                      inline-flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-md
                      bg-[var(--admin-button-danger-bg)]
                      p-0
                      text-[var(--admin-button-danger-text)]
                      transition
                      hover:opacity-90
                      sm:h-9
                      sm:w-9
                      sm:rounded-lg
                    "
                    aria-label="Remove image"
                  >
                    <Trash2
                      size={13}
                      className="
                        sm:h-[15px]
                        sm:w-[15px]
                      "
                    />
                  </button>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}