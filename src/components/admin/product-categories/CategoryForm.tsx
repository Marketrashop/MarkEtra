"use client";

import { useEffect, useRef } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import CloudinaryUploader from "@/components/shared/CloudinaryUploader";

import {
  createCategorySchema,
  type CreateCategorySchema,
} from "@/validation/category.validation";

import { z } from "zod";

type CategoryFormProps = {
  initialValues?: Partial<CreateCategorySchema>;

  loading?: boolean;

  submitLabel?: string;

  onSubmit: (
    values: FormValues
  ) => Promise<void> | void;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type FormValues = z.input<
  typeof createCategorySchema
>;

export default function CategoryForm({
  initialValues,
  loading = false,
  submitLabel = "Save Category",
  onSubmit,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(
      createCategorySchema
    ),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      imageKey: "",
      isActive: true,
      sortOrder: 0,
    },
  });

  const slugEditedRef =
    useRef(false);

  const name = watch("name");

  const slug = watch("slug");

  useEffect(() => {
    if (!slug) {
      slugEditedRef.current = false;
    }

    if (slugEditedRef.current) {
      return;
    }

    setValue(
      "slug",
      slugify(name ?? ""),
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );
  }, [name, slug, setValue]);

  useEffect(() => {
    if (!initialValues) {
      return;
    }

    reset({
      name: initialValues.name,
      slug: initialValues.slug,
      description:
        initialValues.description ??
        "",
      imageKey:
        initialValues.imageKey ??
        "",
      isActive:
        initialValues.isActive,
      sortOrder:
        initialValues.sortOrder,
    });

    slugEditedRef.current = false;
  }, [initialValues, reset]);

  const imageKey =
    watch("imageKey") ?? "";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        flex
        flex-col
        gap-3
        sm:gap-[var(--space-lg)]
      "
    >
      <div
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
            Name
          </label>

          <input
            id="name"
            {...register("name")}
            placeholder="Streetwear"
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
              {errors.name.message}
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
            placeholder="streetwear"
            {...register("slug", {
              onChange: (event) => {
                slugEditedRef.current =
                  event.target.value.trim() !==
                  "";
              },
            })}
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
              {errors.slug.message}
            </p>
          )}
        </div>
      </div>

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
          rows={4}
          {...register("description")}
          placeholder="Optional description..."
          className="
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
            {errors.description.message}
          </p>
        )}
      </div>

      <div
        className="
          grid
          gap-3
          lg:grid-cols-[1fr_auto]
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
            htmlFor="sortOrder"
            className="
              text-[10px]
              font-medium
              text-[var(--admin-title)]
              sm:text-sm
            "
          >
            Sort Order
          </label>

          <input
            id="sortOrder"
            type="number"
            {...register(
              "sortOrder",
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
        </div>

        <label
          className="
            mt-auto
            flex
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
            {...register("isActive")}
            className="
              h-3
              w-3
              sm:h-4
              sm:w-4
            "
          />

          Active
        </label>
      </div>

      <CloudinaryUploader
        value={imageKey || null}
        folder="categories"
        disabled={loading}
        onChange={(value) =>
          setValue(
            "imageKey",
            value ?? "",
            {
              shouldDirty: true,
              shouldValidate: true,
            }
          )
        }
      />

      <div
        className="
          flex
          justify-end
        "
      >
        <button
          type="submit"
          disabled={loading}
          className="
            inline-flex
            h-8
            items-center
            justify-center
            rounded-md
            bg-[var(--admin-button-primary-bg)]
            px-3
            text-[10px]
            font-medium
            text-[var(--admin-button-primary-text)]
            transition
            hover:bg-[var(--admin-button-primary-hover)]
            disabled:cursor-not-allowed
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
  );
}