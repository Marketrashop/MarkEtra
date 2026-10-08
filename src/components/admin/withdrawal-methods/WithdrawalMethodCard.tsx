"use client";

import {
  Edit2,
  Trash2,
} from "lucide-react";

import WithdrawalMethodStatus from "./WithdrawalMethodStatus";

import type {
  WithdrawalMethod,
} from "./withdrawal-method.types";

import Image from "next/image";

import {
  getCloudinaryImageUrl,
} from "@/lib/cloudinary";

type WithdrawalMethodCardProps = {
  method: WithdrawalMethod;

  desktop?: boolean;

  onEdit: () => void;

  onDelete: () => void;
};

export default function WithdrawalMethodCard({
  method,
  desktop = false,
  onEdit,
  onDelete,
}: WithdrawalMethodCardProps) {
  const iconUrl =
    getCloudinaryImageUrl(
      method.icon,
    );

  const fee =
    method.feeType === "percentage"
      ? `${method.fee}%`
      : `$${method.fee.toLocaleString()}`;

  const type =
    method.type === "crypto"
      ? "Crypto"
      : "Bank";

  if (desktop) {
    return (
      <tr
        className="
          border-b
          border-[var(--admin-card-border)]
          transition-colors
          hover:bg-[var(--admin-table-row-hover)]
        "
      >
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                overflow-hidden
                rounded-lg
                bg-[var(--admin-card-secondary-bg)]
              "
            >
              {iconUrl ? (
                <Image
                  src={iconUrl}
                  alt={method.name}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span
                  className="
                    text-xs
                    font-bold
                    uppercase
                    text-[var(--admin-title)]
                  "
                >
                  {method.symbol.slice(
                    0,
                    2,
                  )}
                </span>
              )}
            </div>

            <div>
              <p
                className="
                  text-sm
                  font-semibold
                  text-[var(--admin-title)]
                "
              >
                {method.name}
              </p>

              <p
                className="
                  text-xs
                  text-[var(--admin-muted)]
                "
              >
                {method.symbol}
                {method.network
                  ? ` • ${method.network}`
                  : ""}
              </p>
            </div>
          </div>
        </td>

        <td
          className="
            px-4
            py-3.5
            text-xs
            text-[var(--admin-text)]
          "
        >
          {type}
        </td>

        <td
          className="
            px-4
            py-3.5
            text-xs
            font-medium
            text-[var(--admin-text)]
          "
        >
          {fee}
        </td>

        <td className="px-4 py-3.5">
          <WithdrawalMethodStatus
            active={
              method.isActive
            }
          />
        </td>

        <td className="px-4 py-3.5">
          <div
            className="
              flex
              items-center
              gap-1.5
            "
          >
            <button
              type="button"
              onClick={onEdit}
              className="
                inline-flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                border
                border-[var(--admin-button-secondary-border)]
                text-[var(--admin-button-secondary-text)]
                transition-all
                duration-300
                hover:bg-[var(--admin-button-secondary-hover)]
              "
            >
              <Edit2
                size={14}
              />
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="
                inline-flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                border
                border-[var(--admin-button-danger-border)]
                text-[var(--admin-button-danger-text)]
                transition-all
                duration-300
                hover:bg-[var(--admin-button-danger-hover)]
              "
            >
              <Trash2
                size={14}
              />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div
      className="
        rounded-lg
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-card-bg)]
        p-2.5
        shadow-[var(--admin-card-shadow)]
        sm:rounded-[var(--admin-card-radius)]
        sm:p-5
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-2
          sm:gap-4
        "
      >
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-md
              bg-[var(--admin-card-secondary-bg)]
              sm:h-12
              sm:w-12
              sm:rounded-xl
            "
          >
            {iconUrl ? (
              <Image
                src={iconUrl}
                alt={method.name}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            ) : (
              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  text-[var(--admin-title)]
                  sm:text-sm
                "
              >
                {method.symbol.slice(
                  0,
                  2,
                )}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <h3
              className="
                truncate
                text-[11px]
                font-semibold
                text-[var(--admin-title)]
                sm:text-base
              "
            >
              {method.name}
            </h3>

            <p
              className="
                mt-0
                truncate
                text-[9px]
                text-[var(--admin-muted)]
                sm:mt-0.5
                sm:text-sm
              "
            >
              {method.symbol}
              {method.network
                ? ` • ${method.network}`
                : ""}
            </p>
          </div>
        </div>

        <WithdrawalMethodStatus
          active={method.isActive}
        />
      </div>

      <div
        className="
          mt-2
          grid
          grid-cols-2
          gap-2
          sm:mt-5
          sm:gap-4
        "
      >
        <div>
          <p
            className="
              text-[8px]
              uppercase
              tracking-wide
              text-[var(--admin-muted)]
              sm:text-xs
            "
          >
            Type
          </p>

          <p
            className="
              mt-0
              text-[10px]
              font-medium
              text-[var(--admin-text)]
              sm:mt-1
              sm:text-sm
            "
          >
            {type}
          </p>
        </div>

        <div>
          <p
            className="
              text-[8px]
              uppercase
              tracking-wide
              text-[var(--admin-muted)]
              sm:text-xs
            "
          >
            Fee
          </p>

          <p
            className="
              mt-0
              text-[10px]
              font-medium
              text-[var(--admin-text)]
              sm:mt-1
              sm:text-sm
            "
          >
            {fee}
          </p>
        </div>
      </div>

      <div
        className="
          mt-2
          flex
          gap-1.5
          sm:mt-6
          sm:gap-3
        "
      >
        <button
          type="button"
          onClick={onEdit}
          className="
            flex-1
            rounded
            border
            border-[var(--admin-button-secondary-border)]
            bg-[var(--admin-button-secondary-bg)]
            py-1
            text-[9px]
            font-semibold
            text-[var(--admin-button-secondary-text)]
            transition-all
            duration-300
            hover:bg-[var(--admin-button-secondary-hover)]
            sm:rounded-[var(--admin-input-radius)]
            sm:py-3
            sm:text-sm
          "
        >
          Edit
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="
            flex-1
            rounded
            bg-[var(--admin-button-danger-bg)]
            py-1
            text-[9px]
            font-semibold
            text-[var(--admin-button-danger-text)]
            transition-all
            duration-300
            hover:bg-[var(--admin-button-danger-hover)]
            sm:rounded-[var(--admin-input-radius)]
            sm:py-3
            sm:text-sm
          "
        >
          Delete
        </button>
      </div>
    </div>
  );
}