"use client";

import {
  useEffect,
  useRef,
} from "react";

import { toast } from "sonner";

import {
  FormProvider,
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  PRODUCT_STATUSES,
} from "@/constants/product-status";

import {
  createProductSchema,
  type CreateProductInput,
  type CreateProductSchema,
} from "@/validation/product.validation";

import type {
  ProductCategory,
} from "@/types/category.types";

import ProductImages from "./ProductImages";
import ProductVariants from "./ProductVariants";
import ProductReviews from "./ProductReviews";
import CategoryMultiSelect from "@/components/ui/CategoryMultiSelect";

type FormValues =
  CreateProductInput;

type ProductFormProps = {
  categories:
    ProductCategory[];

  initialValues?:
    Partial<FormValues>;

  loading?: boolean;

  submitLabel?: string;

  onSubmit: (
    values: FormValues,
  ) =>
    | Promise<void>
    | void;
};

function slugify(
  value: string,
) {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9\s-]/g,
      "",
    )
    .replace(
      /\s+/g,
      "-",
    )
    .replace(
      /-+/g,
      "-",
    );
}

export default function ProductForm({
  categories,
  initialValues,
  loading = false,
  submitLabel =
    "Save Product",
  onSubmit,
}: ProductFormProps) {
  const methods =
    useForm<
      CreateProductInput,
      any,
      CreateProductSchema
    >({
      resolver:
        zodResolver(
          createProductSchema,
        ),

      defaultValues: {
        name: "",

        slug: "",

        description: "",

        sku: "",

        price: 0,

        compareAtPrice:
          null,

        initialRating: 0,

        featured: false,

        status: "ACTIVE",

        metaTitle: "",

        metaDescription:
          "",

        categoryIds: [],

        images: [],

        variants: [],

        specifications: [],

        reviews: [],
      },
    });

  const {
    register,

    handleSubmit,

    watch,

    setValue,

    reset,

    formState: {
      errors,
    },
  } = methods;

  const slugEditedRef =
    useRef(false);

  const name =
    watch("name");

  const slug =
    watch("slug");

  const categoryIds =
    watch("categoryIds") ?? [];

  useEffect(() => {
    register("categoryIds");
  }, [
    register,
  ]);

  const selectedCategory =
    categories.find((category) =>
      categoryIds.includes(
        category.id,
      ),
    );

  const selectedCategorySlug =
    selectedCategory?.slug ??
    "";

  useEffect(() => {
    if (!slug) {
      slugEditedRef.current =
        false;
    }

    if (
      slugEditedRef.current
    ) {
      return;
    }

    setValue(
      "slug",
      slugify(
        name ?? "",
      ),
      {
        shouldDirty:
          true,

        shouldValidate:
          true,
      },
    );
  }, [
    name,
    slug,
    setValue,
  ]);

  useEffect(() => {
    if (!initialValues) {
      return;
    }

    reset({
      name:
        initialValues.name ??
        "",

      slug:
        initialValues.slug ??
        "",

      description:
        initialValues.description ??
        "",

      sku:
        initialValues.sku ??
        "",

      price:
        initialValues.price ??
        0,

      compareAtPrice:
        initialValues.compareAtPrice ??
        null,

      initialRating:
        initialValues.initialRating ??
        0,

      featured:
        initialValues.featured ??
        false,

      status:
        initialValues.status ??
        "ACTIVE",

      metaTitle:
        initialValues.metaTitle ??
        "",

      metaDescription:
        initialValues.metaDescription ??
        "",

      categoryIds:
        initialValues.categoryIds ??
        [],

      images:
        initialValues.images ??
        [],

      variants:
        initialValues.variants ??
        [],

      specifications:
        initialValues.specifications ??
        [],

      reviews:
        initialValues.reviews ??
        [],
    });
  }, [
    initialValues,
    reset,
  ]);

  return (
    <FormProvider
      {...methods}
    >
      <form
        onSubmit={handleSubmit(
          onSubmit,
          (
            submitErrors,
          ) => {
            const firstError =
              Object.values(
                submitErrors,
              )[0];

            const message =
              firstError?.message;

            toast.error(
              typeof message ===
                "string"
                ? message
                : "Please fix the highlighted fields before submitting.",
            );
          },
        )}
        className="
          flex
          flex-col
          gap-4
          sm:gap-[var(--space-xl)]
        "
      >
        <section
          className="
            grid
            gap-3
            lg:grid-cols-2
            sm:gap-[var(--space-lg)]
          "
        >
          <div
            className="
              space-y-1
              sm:space-y-2
            "
          >
            <label
              htmlFor="name"
              className="
                text-[10px]
                font-medium
                text-[var(--admin-title)]
                sm:text-sm
              "
            >
              Product Name
            </label>

            <input
              id="name"
              placeholder="Premium Hoodie"
              {...register(
                "name",
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

            {errors.name && (
              <p
                className="
                  text-[9px]
                  text-[var(--user-danger)]
                  sm:text-xs
                "
              >
                {
                  errors.name
                    .message
                }
              </p>
            )}
          </div>

          <div
            className="
              space-y-1
              sm:space-y-2
            "
          >
            <label
              htmlFor="slug"
              className="
                text-[10px]
                font-medium
                text-[var(--admin-title)]
                sm:text-sm
              "
            >
              Slug
            </label>

            <input
              id="slug"
              placeholder="premium-hoodie"
              {...register(
                "slug",
                {
                  onChange:
                    (
                      event,
                    ) => {
                      slugEditedRef.current =
                        event.target.value.trim() !==
                        "";
                    },
                },
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

            {errors.slug && (
              <p
                className="
                  text-[9px]
                  text-[var(--user-danger)]
                  sm:text-xs
                "
              >
                {
                  errors.slug
                    .message
                }
              </p>
            )}
          </div>

          <div
            className="
              space-y-1
              sm:space-y-2
            "
          >
            <label
              htmlFor="categoryIds"
              className="
                text-[10px]
                font-medium
                text-[var(--admin-title)]
                sm:text-sm
              "
            >
              Category
            </label>

            <CategoryMultiSelect
              options={categories}
              value={categoryIds}
              onChange={(value) =>
                setValue(
                  "categoryIds",
                  value,
                  {
                    shouldDirty:
                      true,
                    shouldValidate:
                      true,
                  },
                )
              }
            />

            {errors.categoryIds && (
              <p
                className="
                  text-[9px]
                  text-[var(--user-danger)]
                  sm:text-xs
                "
              >
                {
                  errors.categoryIds
                    .message
                }
              </p>
            )}
          </div>

          <div
            className="
              space-y-1
              sm:space-y-2
            "
          >
            <label
              htmlFor="sku"
              className="
                text-[10px]
                font-medium
                text-[var(--admin-title)]
                sm:text-sm
              "
            >
              SKU
            </label>

            <input
              id="sku"
              placeholder="HD001"
              {...register(
                "sku",
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

            {errors.sku && (
              <p
                className="
                  text-[9px]
                  text-[var(--user-danger)]
                  sm:text-xs
                "
              >
                {
                  errors.sku
                    .message
                }
              </p>
            )}
          </div>
        </section>

        <div
          className="
            space-y-1
            sm:space-y-2
          "
        >
          <label
            htmlFor="description"
            className="
              text-[10px]
              font-medium
              text-[var(--admin-title)]
              sm:text-sm
            "
          >
            Description
          </label>

          <textarea
            id="description"
            rows={5}
            placeholder="Write a detailed product description..."
            {...register(
              "description",
            )}
            className="
              min-h-[110px]
              w-full
              resize-none
              rounded-md
              border
              border-[var(--admin-input-border)]
              bg-[var(--admin-input-bg)]
              px-2.5
              py-2
              text-[10px]
              text-[var(--admin-input-text)]
              outline-none
              transition
              focus:border-[var(--admin-input-focus)]
              sm:min-h-0
              sm:rounded-[var(--admin-input-radius)]
              sm:px-4
              sm:py-3
              sm:text-sm
            "
          />

          {errors.description && (
            <p
              className="
                text-[9px]
                text-[var(--user-danger)]
                sm:text-xs
              "
            >
              {
                errors.description
                  .message
              }
            </p>
          )}
        </div>

        <section
          className="
            grid
            gap-3
            sm:grid-cols-2
            xl:grid-cols-4
            sm:gap-[var(--space-lg)]
          "
        >
          <div
            className="
              space-y-1
              sm:space-y-2
            "
          >
            <label
              htmlFor="price"
              className="
                text-[10px]
                font-medium
                text-[var(--admin-title)]
                sm:text-sm
              "
            >
              Product Price
            </label>

            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              {...register(
                "price",
                {
                  valueAsNumber:
                    true,
                },
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

            {errors.price && (
              <p
                className="
                  text-[9px]
                  text-[var(--user-danger)]
                  sm:text-xs
                "
              >
                {
                  errors.price
                    .message
                }
              </p>
            )}
          </div>

          <div
            className="
              space-y-1
              sm:space-y-2
            "
          >
            <label
              htmlFor="compareAtPrice"
              className="
                text-[10px]
                font-medium
                text-[var(--admin-title)]
                sm:text-sm
              "
            >
              Discounted Amount
            </label>

            <input
              id="compareAtPrice"
              type="number"
              min="0"
              step="0.01"
              {...register(
                "compareAtPrice",
                {
                  setValueAs:
                    (
                      value,
                    ) =>
                      value ===
                      ""
                        ? null
                        : Number(
                            value,
                          ),
                },
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

            {errors.compareAtPrice && (
              <p
                className="
                  text-[9px]
                  text-[var(--user-danger)]
                  sm:text-xs
                "
              >
                {
                  errors.compareAtPrice
                    .message
                }
              </p>
            )}
          </div>

          <div
            className="
              space-y-1
              sm:space-y-2
            "
          >
            <label
              htmlFor="initialRating"
              className="
                text-[10px]
                font-medium
                text-[var(--admin-title)]
                sm:text-sm
              "
            >
              Product Rating
            </label>

            <input
              id="initialRating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              {...register(
                "initialRating",
                {
                  valueAsNumber:
                    true,
                },
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
                text-[9px]
                leading-3.5
                text-[var(--admin-muted)]
                sm:text-[11px]
                sm:leading-4
              "
            >
              Optional rating from 0 to 5.
              This is separate from customer
              reviews.
            </p>

            {errors.initialRating && (
              <p
                className="
                  text-[9px]
                  text-[var(--user-danger)]
                  sm:text-xs
                "
              >
                {
                  errors.initialRating
                    .message
                }
              </p>
            )}
          </div>

          <div
            className="
              space-y-1
              sm:space-y-2
            "
          >
            <label
              htmlFor="status"
              className="
                text-[10px]
                font-medium
                text-[var(--admin-title)]
                sm:text-sm
              "
            >
              Status
            </label>

            <select
              id="status"
              {...register(
                "status",
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
            >
              {PRODUCT_STATUSES.map(
                (
                  status,
                ) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ),
              )}
            </select>

            {errors.status && (
              <p
                className="
                  text-[9px]
                  text-[var(--user-danger)]
                  sm:text-xs
                "
              >
                {
                  errors.status
                    .message
                }
              </p>
            )}
          </div>
        </section>

        <label
          className="
            inline-flex
            items-center
            gap-2
            text-[10px]
            font-medium
            text-[var(--admin-title)]
            sm:gap-3
            sm:text-sm
          "
        >
          <input
            type="checkbox"
            {...register(
              "featured",
            )}
            className="
              h-3
              w-3
              sm:h-4
              sm:w-4
            "
          />

          Featured Product
        </label>

        <ProductImages
          value={
            watch(
              "images",
            ) ?? []
          }
          disabled={
            loading
          }
          onChange={(
            images,
          ) =>
            setValue(
              "images",
              images,
              {
                shouldDirty:
                  true,

                shouldValidate:
                  true,
              },
            )
          }
        />

        <ProductVariants
          value={
            watch(
              "variants",
            ) ?? []
          }
          categorySlug={
            selectedCategorySlug
          }
          disabled={
            loading
          }
          onChange={(
            variants,
          ) =>
            setValue(
              "variants",
              variants,
              {
                shouldDirty:
                  true,

                shouldValidate:
                  true,
              },
            )
          }
        />

        <ProductReviews
          disabled={
            loading
          }
        />

        <div
          className="
            flex
            justify-end
            pt-1
            sm:pt-[var(--space-md)]
          "
        >
          <button
            type="submit"
            disabled={
              loading
            }
            className="
              inline-flex
              h-8
              items-center
              justify-center
              rounded-md
              bg-[#4F46E5]
              px-3
              text-[10px]
              font-medium
              text-white
              transition-colors
              hover:bg-[#4338CA]
              focus:outline-none
              focus:ring-2
              focus:ring-[#6366F1]
              focus:ring-offset-2
              disabled:pointer-events-none
              disabled:opacity-60
              sm:h-11
              sm:rounded-[var(--admin-input-radius)]
              sm:px-5
              sm:text-sm
            "
          >
            {loading
              ? "Saving..."
              : submitLabel}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}