"use client";

import {
  useEffect,
  useState,
} from "react";

import { X } from "lucide-react";

import Button from "@/components/ui/Button";

import type {
  CreatePlanInput,
} from "@/types/plan.types";

type CreatePlanDialogProps = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (
    values: CreatePlanInput,
  ) => Promise<void> | void;
};

const initialValues: CreatePlanInput = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  commissionRate: 0,
  maxPublishedProducts: 0,
  priorityLevel: 1,
  badgeName: "",
  badgeColor: "#2563eb",
  durationInDays: 30,
  isActive: true,
  sortOrder: 0,
};

export default function CreatePlanDialog({
  open,
  loading = false,
  onClose,
  onSubmit,
}: CreatePlanDialogProps) {
  const [
    values,
    setValues,
  ] = useState(initialValues);

  useEffect(() => {
    if (open) {
      setValues(initialValues);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  function update<K extends keyof CreatePlanInput>(
    key: K,
    value: CreatePlanInput[K],
  ) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    await onSubmit(values);
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        overflow-y-auto
        bg-black/60
        p-2
        backdrop-blur-md
        sm:p-4
      "
    >
      <div
        className="
          flex
          min-h-full
          items-center
          justify-center
          py-3
          sm:py-6
        "
      >
        <div
          className="
            flex
            w-full
            max-w-2xl
            max-h-[calc(100vh-1.5rem)]
            flex-col
            overflow-hidden
            rounded-xl
            border
            sm:max-h-[calc(100vh-3rem)]
            sm:rounded-[var(--admin-modal-radius)]
          "
          style={{
            background:
              "var(--admin-modal-bg)",
            borderColor:
              "var(--admin-modal-border)",
            boxShadow:
              "var(--admin-modal-shadow)",
          }}
        >
          <form
            onSubmit={
              handleSubmit
            }
            className="
              flex
              min-h-0
              flex-1
              flex-col
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-2
                border-b
                px-3
                py-2.5
                sm:px-6
                sm:py-4
              "
              style={{
                background:
                  "var(--admin-modal-header-bg)",
                borderColor:
                  "var(--admin-modal-border)",
              }}
            >
              <div>
                <h2
                  className="
                    text-sm
                    font-semibold
                    sm:text-lg
                  "
                  style={{
                    color:
                      "var(--admin-title)",
                  }}
                >
                  Create Plan
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  onClose
                }
                disabled={
                  loading
                }
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  transition-opacity
                  hover:opacity-70
                  sm:h-auto
                  sm:w-auto
                  sm:p-2
                "
                aria-label="Close dialog"
              >
                <X
                  size={15}
                  className="sm:hidden"
                  style={{
                    color:
                      "var(--admin-text-muted)",
                  }}
                />

                <X
                  size={18}
                  className="hidden sm:block"
                  style={{
                    color:
                      "var(--admin-text-muted)",
                  }}
                />
              </button>
            </div>

            <div
              className="
                grid
                gap-2.5
                overflow-y-auto
                p-3
                sm:gap-4
                sm:p-6
                md:grid-cols-2
              "
              style={{
                maxHeight:
                  "calc(100vh - 9rem)",
              }}
            >
              <Input
                label="Name"
                value={
                  values.name
                }
                onChange={(v) =>
                  update(
                    "name",
                    v,
                  )
                }
              />

              <Input
                label="Slug"
                value={
                  values.slug
                }
                onChange={(v) =>
                  update(
                    "slug",
                    v
                      .toLowerCase()
                      .trim()
                      .replace(
                        /\s+/g,
                        "-",
                      )
                      .replace(
                        /[^a-z0-9-]/g,
                        "",
                      )
                      .replace(
                        /-+/g,
                        "-",
                      ),
                  )
                }
              />

              <Input
                label="Price"
                type="number"
                value={
                  values.price
                }
                onChange={(v) =>
                  update(
                    "price",
                    Number(v),
                  )
                }
              />

              <Input
                label="Commission (%)"
                type="number"
                value={
                  values.commissionRate
                }
                onChange={(v) =>
                  update(
                    "commissionRate",
                    Number(v),
                  )
                }
              />

              <Input
                label="Products"
                type="number"
                value={
                  values.maxPublishedProducts
                }
                onChange={(v) =>
                  update(
                    "maxPublishedProducts",
                    Number(v),
                  )
                }
              />

              <Input
                label="Duration"
                type="number"
                value={
                  values.durationInDays
                }
                onChange={(v) =>
                  update(
                    "durationInDays",
                    Number(v),
                  )
                }
              />

              <Input
                label="Priority"
                type="number"
                value={
                  values.priorityLevel
                }
                onChange={(v) =>
                  update(
                    "priorityLevel",
                    Number(v),
                  )
                }
              />

              <Input
                label="Sort Order"
                type="number"
                value={
                  values.sortOrder
                }
                onChange={(v) =>
                  update(
                    "sortOrder",
                    Number(v),
                  )
                }
              />

              <Input
                label="Badge Name"
                value={
                  values.badgeName
                }
                onChange={(v) =>
                  update(
                    "badgeName",
                    v,
                  )
                }
              />

              <Input
                label="Badge Color"
                type="color"
                value={
                  values.badgeColor
                }
                onChange={(v) =>
                  update(
                    "badgeColor",
                    v,
                  )
                }
              />

              <div
                className="
                  md:col-span-2
                "
              >
                <label
                  className="
                    mb-1.5
                    block
                    text-[10px]
                    sm:mb-2
                    sm:text-sm
                  "
                  style={{
                    color:
                      "var(--admin-text)",
                  }}
                >
                  Description
                </label>

                <textarea
                  rows={3}
                  value={
                    values.description
                  }
                  onChange={(e) =>
                    update(
                      "description",
                      e.target.value,
                    )
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    px-2.5
                    py-1.5
                    text-[11px]
                    outline-none
                    sm:rounded-[var(--admin-input-radius)]
                    sm:px-3
                    sm:py-2
                    sm:text-sm
                  "
                  style={{
                    background:
                      "var(--admin-input-bg)",
                    borderColor:
                      "var(--admin-input-border)",
                    color:
                      "var(--admin-input-text)",
                  }}
                />
              </div>

              <label
                className="
                  flex
                  items-center
                  gap-1.5
                  text-[10px]
                  md:col-span-2
                  sm:gap-2
                  sm:text-sm
                "
              >
                <input
                  type="checkbox"
                  checked={
                    values.isActive
                  }
                  onChange={(e) =>
                    update(
                      "isActive",
                      e.target.checked,
                    )
                  }
                />

                <span
                  style={{
                    color:
                      "var(--admin-text)",
                  }}
                >
                  Active
                </span>
              </label>
            </div>

            <div
              className="
                flex
                justify-end
                border-t
                px-3
                py-2.5
                sm:px-6
                sm:py-4
              "
              style={{
                background:
                  "var(--admin-modal-footer-bg)",
                borderColor:
                  "var(--admin-modal-border)",
              }}
            >
              <Button
                type="submit"
                disabled={
                  loading
                }
                className="
                  w-full
                  !h-8
                  !px-3
                  !text-[10px]
                  sm:w-auto
                  sm:!h-auto
                  sm:!px-4
                  sm:!py-2
                  sm:!text-sm
                "
              >
                {loading
                  ? "Creating..."
                  : "Create Plan"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

type InputProps = {
  label: string;
  type?: string;
  value: string | number;
  onChange: (
    value: string,
  ) => void;
};

function Input({
  label,
  type = "text",
  value,
  onChange,
}: InputProps) {
  return (
    <div>
      <label
        className="
          mb-1.5
          block
          text-[10px]
          sm:mb-2
          sm:text-sm
        "
        style={{
          color:
            "var(--admin-text)",
        }}
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value,
          )
        }
        className="
          w-full
          rounded-lg
          border
          px-2.5
          py-1.5
          text-[11px]
          outline-none
          sm:rounded-[var(--admin-input-radius)]
          sm:px-3
          sm:py-2
          sm:text-sm
        "
        style={{
          background:
            "var(--admin-input-bg)",
          borderColor:
            "var(--admin-input-border)",
          color:
            "var(--admin-input-text)",
        }}
      />
    </div>
  );
}