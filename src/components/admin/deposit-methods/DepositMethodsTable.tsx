"use client";

import Image from "next/image";

import {
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import type {
  DepositMethod,
} from "./types";

import {
  getCloudinaryImageUrl,
} from "@/lib/cloudinary";

type Props = {
  methods: DepositMethod[];

  loading: boolean;

  onCreate: () => void;

  onEdit: (
    method: DepositMethod,
  ) => void;

  onDelete: (
    method: DepositMethod,
  ) => void;
};

function LoadingSkeleton() {
  return (
    <div
      className="
        overflow-hidden
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-card-bg)]
        shadow-[var(--admin-card-shadow)]
      "
    >
      <div className="overflow-x-auto">
        <table className="min-w-[620px] w-full border-collapse">
          <thead>
            <tr
              className="
                border-b
                border-[var(--admin-table-border)]
                bg-[var(--admin-table-header-bg)]
              "
            >
              {[
                "Icon",
                "Name",
                "Symbol",
                "Network",
                "Min",
                "Max",
                "Status",
                "Order",
                "Actions",
              ].map((label) => (
                <th
                  key={label}
                  className="
                    px-3
                    py-2.5
                    text-left
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-[var(--admin-table-header-text)]
                    sm:px-4
                    sm:py-3
                  "
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 8 }).map((_, row) => (
              <tr
                key={row}
                className="
                  border-b
                  border-[var(--admin-table-border)]
                "
              >
                {Array.from({ length: 9 }).map(
                  (_, cell) => (
                    <td
                      key={cell}
                      className="px-3 py-3 sm:px-4 sm:py-3.5"
                    >
                      <div
                        className="
                          h-3
                          w-full
                          max-w-[140px]
                          animate-pulse
                          rounded
                          bg-[var(--admin-table-header-bg)]
                        "
                      />
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DepositMethodsTable({
  methods,
  loading,
  onCreate,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div
      className="
        mb-20
        mt-6
        overflow-hidden
        rounded-[var(--admin-deposit-methods-radius)]
        border
        border-[var(--admin-deposit-methods-border)]
        bg-[var(--admin-deposit-methods-bg)]
        shadow-[var(--admin-deposit-methods-shadow)]
        transition-all
        duration-300
        sm:mb-28
        sm:mt-8
      "
    >
      <div
        className="
          flex
          flex-col
          gap-3
          border-b
          border-[var(--admin-deposit-methods-header-border)]
          bg-[var(--admin-deposit-methods-header-bg)]
          p-3
          transition-colors
          duration-300
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:p-4
        "
      >
        <div className="min-w-0">
          <h1
            className="
              text-base
              font-semibold
              text-[var(--admin-deposit-methods-title)]
              sm:text-lg
            "
          >
            Deposit Methods
          </h1>

          <p
            className="
              mt-0.5
              text-xs
              leading-4
              text-[var(--admin-deposit-methods-text)]
              sm:mt-1
              sm:text-sm
            "
          >
            Manage supported deposit methods.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="
            inline-flex
            h-9
            w-full
            shrink-0
            items-center
            justify-center
            gap-1.5
            rounded-lg
            bg-[var(--admin-deposit-methods-button-bg)]
            px-3
            text-xs
            font-medium
            text-[var(--admin-deposit-methods-button-text)]
            transition-all
            duration-300
            hover:bg-[var(--admin-deposit-methods-button-hover)]
            active:scale-[0.98]
            sm:h-10
            sm:w-auto
            sm:gap-2
            sm:rounded-xl
            sm:px-4
            sm:text-sm
          "
        >
          <Plus
            size={16}
            className="sm:h-[18px] sm:w-[18px]"
          />

          Add Method
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : methods.length === 0 ? (
        <div
          className="
            flex
            items-center
            justify-center
            p-8
            text-xs
            text-[var(--admin-deposit-methods-text)]
            sm:p-10
            sm:text-sm
          "
        >
          No deposit methods found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px]">
            <thead>
              <tr
                className="
                  border-b
                  border-[var(--admin-deposit-methods-header-border)]
                  bg-[var(--admin-deposit-methods-header-bg)]
                  transition-colors
                  duration-300
                "
              >
                <th
                  className="
                    hidden
                    px-3
                    py-2.5
                    text-left
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-[var(--admin-deposit-methods-heading)]
                    sm:table-cell
                    sm:px-4
                    sm:py-3
                    sm:text-xs
                  "
                >
                  Icon
                </th>

                <th
                  className="
                    px-3
                    py-2.5
                    text-left
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-[var(--admin-deposit-methods-heading)]
                    sm:px-4
                    sm:py-3
                    sm:text-xs
                  "
                >
                  Name
                </th>

                <th
                  className="
                    px-3
                    py-2.5
                    text-left
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-[var(--admin-deposit-methods-heading)]
                    sm:px-4
                    sm:py-3
                    sm:text-xs
                  "
                >
                  Symbol
                </th>

                <th
                  className="
                    px-3
                    py-2.5
                    text-left
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-[var(--admin-deposit-methods-heading)]
                    sm:px-4
                    sm:py-3
                    sm:text-xs
                  "
                >
                  Network
                </th>

                <th
                  className="
                    hidden
                    px-4
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-[var(--admin-deposit-methods-heading)]
                    md:table-cell
                  "
                >
                  Min
                </th>

                <th
                  className="
                    hidden
                    px-4
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-[var(--admin-deposit-methods-heading)]
                    md:table-cell
                  "
                >
                  Max
                </th>

                <th
                  className="
                    px-3
                    py-2.5
                    text-left
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-[var(--admin-deposit-methods-heading)]
                    sm:px-4
                    sm:py-3
                    sm:text-xs
                  "
                >
                  Status
                </th>

                <th
                  className="
                    hidden
                    px-4
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-[var(--admin-deposit-methods-heading)]
                    md:table-cell
                  "
                >
                  Order
                </th>

                <th
                  className="
                    px-3
                    py-2.5
                    text-right
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-[var(--admin-deposit-methods-heading)]
                    sm:px-4
                    sm:py-3
                    sm:text-xs
                  "
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {methods.map((method) => (
                <tr
                  key={method.id}
                  className="
                    border-b
                    border-[var(--admin-deposit-methods-row-border)]
                    text-[var(--admin-deposit-methods-row-text)]
                    transition-colors
                    duration-300
                    hover:bg-[var(--admin-deposit-methods-row-hover)]
                  "
                >
                  <td
                    className="
                      hidden
                      px-4
                      py-2.5
                      sm:table-cell
                      sm:py-3
                    "
                  >
                    {method.iconKey ? (
                      <div
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-[var(--admin-deposit-methods-icon-border)]
                          bg-[var(--admin-deposit-methods-icon-bg)]
                        "
                      >
                        <Image
                          src={
                            getCloudinaryImageUrl(
                              method.iconKey,
                            ) ??
                            "/images/placeholders/crypto.svg"
                          }
                          alt={method.name}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--admin-deposit-methods-text)]">
                        N/A
                      </span>
                    )}
                  </td>

                  <td
                    className="
                      max-w-[150px]
                      px-3
                      py-2.5
                      text-xs
                      font-medium
                      sm:max-w-[220px]
                      sm:px-4
                      sm:py-3
                      sm:text-sm
                    "
                  >
                    <span className="block truncate">
                      {method.name}
                    </span>
                  </td>

                  <td
                    className="
                      px-3
                      py-2.5
                      text-xs
                      sm:px-4
                      sm:py-3
                      sm:text-sm
                    "
                  >
                    {method.symbol}
                  </td>

                  <td
                    className="
                      max-w-[130px]
                      px-3
                      py-2.5
                      text-xs
                      sm:max-w-[180px]
                      sm:px-4
                      sm:py-3
                      sm:text-sm
                    "
                  >
                    <span className="block truncate">
                      {method.network}
                    </span>
                  </td>

                  <td
                    className="
                      hidden
                      px-4
                      py-3
                      text-sm
                      md:table-cell
                    "
                  >
                    {method.minimumAmount}
                  </td>

                  <td
                    className="
                      hidden
                      px-4
                      py-3
                      text-sm
                      md:table-cell
                    "
                  >
                    {method.maximumAmount ??
                      "Unlimited"}
                  </td>

                  <td
                    className="
                      px-3
                      py-2.5
                      text-xs
                      sm:px-4
                      sm:py-3
                      sm:text-sm
                    "
                  >
                    <span
                      className={
                        method.isActive
                          ? "font-medium text-[var(--admin-deposit-methods-active)]"
                          : "font-medium text-[var(--admin-deposit-methods-inactive)]"
                      }
                    >
                      {method.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td
                    className="
                      hidden
                      px-4
                      py-3
                      text-sm
                      md:table-cell
                    "
                  >
                    {method.displayOrder}
                  </td>

                  <td
                    className="
                      px-3
                      py-2
                      sm:px-4
                      sm:py-2.5
                    "
                  >
                    <div
                      className="
                        flex
                        justify-end
                        gap-1
                        sm:gap-1.5
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(method)
                        }
                        className="
                          rounded-md
                          p-1.5
                          text-[var(--admin-deposit-methods-action)]
                          transition-all
                          duration-300
                          hover:bg-[var(--admin-deposit-methods-action-hover-bg)]
                          hover:text-[var(--admin-deposit-methods-action-hover)]
                          sm:rounded-lg
                          sm:p-2
                        "
                      >
                        <Pencil
                          size={15}
                          className="sm:h-[18px] sm:w-[18px]"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(method)
                        }
                        className="
                          rounded-md
                          p-1.5
                          text-[var(--admin-deposit-methods-danger)]
                          transition-all
                          duration-300
                          hover:bg-[var(--admin-deposit-methods-danger-bg)]
                          hover:text-[var(--admin-deposit-methods-danger-hover)]
                          sm:rounded-lg
                          sm:p-2
                        "
                      >
                        <Trash2
                          size={15}
                          className="sm:h-[18px] sm:w-[18px]"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}