"use client";

import {
  useEffect,
  useState,
} from "react";

type CategoryFormValues = {
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
};

type CategoryFormProps = {
  initialValues?: CategoryFormValues;
  loading?: boolean;
  submitLabel: string;
  onSubmit: (
    values: CategoryFormValues,
  ) => Promise<void>;
};

const defaultValues: CategoryFormValues =
  {
    name: "",
    slug: "",
    sortOrder: 0,
    isActive: true,
  };

function slugify(
  value: string,
) {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );
}

export default function CategoryForm({
  initialValues =
    defaultValues,
  loading = false,
  submitLabel,
  onSubmit,
}: CategoryFormProps) {
  const [
    values,
    setValues,
  ] = useState(
    initialValues,
  );

  useEffect(() => {
    setValues(
      initialValues,
    );
  }, [initialValues]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    await onSubmit(
      values,
    );
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="
        space-y-3
        sm:space-y-6
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
            text-[10px]
            font-medium
            sm:text-sm
          "
        >
          Name
        </label>

        <input
          type="text"
          value={
            values.name
          }
          disabled={
            loading
          }
          onChange={(
            event,
          ) =>
            setValues({
              ...values,
              name:
                event.target
                  .value,
              slug: slugify(
                event.target
                  .value,
              ),
            })
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
            sm:h-11
            sm:rounded-[var(--admin-input-radius)]
            sm:px-4
            sm:text-sm
          "
          required
        />
      </div>

      <div
        className="
          space-y-1
          sm:space-y-2
        "
      >
        <label
          className="
            text-[10px]
            font-medium
            sm:text-sm
          "
        >
          Slug
        </label>

        <input
          type="text"
          value={
            values.slug
          }
          disabled={
            loading
          }
          onChange={(
            event,
          ) =>
            setValues({
              ...values,
              slug:
                event.target
                  .value,
            })
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
            sm:h-11
            sm:rounded-[var(--admin-input-radius)]
            sm:px-4
            sm:text-sm
          "
          required
        />
      </div>

      <div
        className="
          space-y-1
          sm:space-y-2
        "
      >
        <label
          className="
            text-[10px]
            font-medium
            sm:text-sm
          "
        >
          Sort Order
        </label>

        <input
          type="number"
          value={
            values.sortOrder
          }
          disabled={
            loading
          }
          onChange={(
            event,
          ) =>
            setValues({
              ...values,
              sortOrder:
                Number(
                  event.target
                    .value,
                ),
            })
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
            sm:h-11
            sm:rounded-[var(--admin-input-radius)]
            sm:px-4
            sm:text-sm
          "
        />
      </div>

      <label
        className="
          flex
          items-center
          gap-2
          text-[10px]
          font-medium
          sm:gap-3
          sm:text-sm
        "
      >
        <input
          type="checkbox"
          checked={
            values.isActive
          }
          disabled={
            loading
          }
          onChange={(
            event,
          ) =>
            setValues({
              ...values,
              isActive:
                event.target
                  .checked,
            })
          }
          className="
            h-3
            w-3
            sm:h-4
            sm:w-4
          "
        />

        Active Category
      </label>

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
          bg-violet-600
          px-3
          text-[10px]
          font-medium
          text-white
          transition
          hover:bg-violet-700
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
    </form>
  );
}