"use client";

import {
  useFieldArray,
  useFormContext,
} from "react-hook-form";

import type {
  CreateProductInput,
} from "@/validation/product.validation";

type ProductReviewsProps = {
  disabled?: boolean;
};

export default function ProductReviews({
  disabled,
}: ProductReviewsProps) {
  const {
    control,
    register,
    formState: { errors },
  } =
    useFormContext<CreateProductInput>();

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "reviews",
  });

  return (
    <section
      className="
        rounded-lg
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-card-bg)]
        p-2.5
        sm:rounded-[var(--admin-surface-radius)]
        sm:p-6
      "
    >
      <div
        className="
          mb-3
          flex
          items-start
          justify-between
          gap-2
          sm:mb-6
          sm:items-center
          sm:gap-4
        "
      >
        <div>
          <h3
            className="
              text-[12px]
              font-semibold
              text-[var(--admin-title)]
              sm:text-lg
            "
          >
            Customer Reviews
          </h3>

          <p
            className="
              mt-0.5
              text-[9px]
              leading-3.5
              text-[var(--admin-muted)]
              sm:mt-1
              sm:text-sm
              sm:leading-normal
            "
          >
            Add as many reviews as you want.
          </p>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            append({
              customerName: "",
              rating: 5,
              title: "",
              comment: "",
              verifiedPurchase: false,
              sortOrder: fields.length,
            })
          }
          className="
            inline-flex
            h-7
            shrink-0
            items-center
            justify-center
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
            disabled:pointer-events-none
            disabled:opacity-60
            sm:h-9
            sm:rounded-[var(--admin-input-radius)]
            sm:px-4
            sm:text-sm
          "
        >
          Add Review
        </button>
      </div>

      {fields.length === 0 && (
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
            sm:rounded-lg
            sm:p-8
            sm:text-sm
            sm:leading-normal
          "
        >
          No reviews added yet.
        </div>
      )}

      <div
        className="
          space-y-2.5
          sm:space-y-6
        "
      >
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="
              rounded-lg
              border
              border-[var(--admin-card-border)]
              p-2.5
              sm:rounded-xl
              sm:p-5
            "
          >
            <div
              className="
                mb-2.5
                flex
                items-center
                justify-between
                gap-2
                sm:mb-5
              "
            >
              <h4
                className="
                  text-[10px]
                  font-medium
                  text-[var(--admin-title)]
                  sm:text-sm
                "
              >
                Review {index + 1}
              </h4>

              <button
                type="button"
                disabled={disabled}
                onClick={() => remove(index)}
                className="
                  text-[9px]
                  font-medium
                  text-[var(--user-danger)]
                  transition
                  hover:opacity-80
                  disabled:pointer-events-none
                  disabled:opacity-50
                  sm:text-sm
                "
              >
                Remove
              </button>
            </div>

            <div
              className="
                grid
                gap-2.5
                sm:gap-5
                md:grid-cols-2
              "
            >
              <div
                className="
                  space-y-1
                  sm:space-y-2
                "
              >
                <label
                  className="
                    text-[9px]
                    font-medium
                    text-[var(--admin-title)]
                    sm:text-sm
                  "
                >
                  Customer Name
                </label>

                <input
                  {...register(
                    `reviews.${index}.customerName`
                  )}
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
                    sm:h-11
                    sm:rounded-[var(--admin-input-radius)]
                    sm:px-4
                    sm:text-sm
                  "
                />

                <p
                  className="
                    text-[8px]
                    leading-3
                    text-[var(--user-danger)]
                    sm:text-xs
                    sm:leading-normal
                  "
                >
                  {
                    errors.reviews?.[index]
                      ?.customerName?.message
                  }
                </p>
              </div>

              <div
                className="
                  space-y-1
                  sm:space-y-2
                "
              >
                <label
                  className="
                    text-[9px]
                    font-medium
                    text-[var(--admin-title)]
                    sm:text-sm
                  "
                >
                  Rating
                </label>

                <input
                  type="number"
                  min={1}
                  max={5}
                  {...register(
                    `reviews.${index}.rating`,
                    {
                      valueAsNumber: true,
                    }
                  )}
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
                    sm:h-11
                    sm:rounded-[var(--admin-input-radius)]
                    sm:px-4
                    sm:text-sm
                  "
                />

                <p
                  className="
                    text-[8px]
                    leading-3
                    text-[var(--user-danger)]
                    sm:text-xs
                    sm:leading-normal
                  "
                >
                  {
                    errors.reviews?.[index]
                      ?.rating?.message
                  }
                </p>
              </div>

              <div
                className="
                  space-y-1
                  md:col-span-2
                  sm:space-y-2
                "
              >
                <label
                  className="
                    text-[9px]
                    font-medium
                    text-[var(--admin-title)]
                    sm:text-sm
                  "
                >
                  Review Title
                </label>

                <input
                  {...register(
                    `reviews.${index}.title`
                  )}
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
                    sm:h-11
                    sm:rounded-[var(--admin-input-radius)]
                    sm:px-4
                    sm:text-sm
                  "
                />

                <p
                  className="
                    text-[8px]
                    leading-3
                    text-[var(--user-danger)]
                    sm:text-xs
                    sm:leading-normal
                  "
                >
                  {
                    errors.reviews?.[index]
                      ?.title?.message
                  }
                </p>
              </div>

              <div
                className="
                  space-y-1
                  md:col-span-2
                  sm:space-y-2
                "
              >
                <label
                  className="
                    text-[9px]
                    font-medium
                    text-[var(--admin-title)]
                    sm:text-sm
                  "
                >
                  Comment
                </label>

                <textarea
                  rows={5}
                  {...register(
                    `reviews.${index}.comment`
                  )}
                  className="
                    min-h-[100px]
                    w-full
                    rounded-md
                    border
                    border-[var(--admin-input-border)]
                    bg-[var(--admin-input-bg)]
                    px-2.5
                    py-2
                    text-[10px]
                    leading-4
                    text-[var(--admin-input-text)]
                    outline-none
                    transition
                    focus:border-[var(--admin-input-focus)]
                    sm:min-h-0
                    sm:rounded-[var(--admin-input-radius)]
                    sm:px-4
                    sm:py-3
                    sm:text-sm
                    sm:leading-normal
                  "
                />

                <p
                  className="
                    text-[8px]
                    leading-3
                    text-[var(--user-danger)]
                    sm:text-xs
                    sm:leading-normal
                  "
                >
                  {
                    errors.reviews?.[index]
                      ?.comment?.message
                  }
                </p>
              </div>

              <div
                className="
                  md:col-span-2
                "
              >
                <label
                  className="
                    inline-flex
                    items-center
                    gap-2
                    text-[10px]
                    text-[var(--admin-title)]
                    sm:gap-3
                    sm:text-sm
                  "
                >
                  <input
                    type="checkbox"
                    {...register(
                      `reviews.${index}.verifiedPurchase`
                    )}
                    className="
                      h-3
                      w-3
                      sm:h-4
                      sm:w-4
                    "
                  />

                  Verified Purchase
                </label>
              </div>

              <input
                type="hidden"
                {...register(
                  `reviews.${index}.sortOrder`,
                  {
                    valueAsNumber: true,
                  }
                )}
                value={index}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}