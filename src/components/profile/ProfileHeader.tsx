"use client";

import Image from "next/image";

import {
  Mail,
  MapPin,
  Phone,
  Smartphone,
  UserCircle2,
  type LucideIcon,
} from "lucide-react";

import {
  getCloudinaryImageUrl,
} from "@/lib/cloudinary";

import type {
  ProfileHeaderProps,
} from "./profile.types";

function DetailTile({
  icon: Icon,
  label,
  value,
  onAdd,
}: {
  icon: LucideIcon;
  label: string;
  value?: string | null;
  /** Shown as an "Add" action when the value is empty. */
  onAdd?: () => void;
}) {
  const hasValue = Boolean(value && value.trim());

  return (
    <div
      className="
        flex
        min-w-0
        items-center
        gap-2.5
        rounded-lg
        border
        border-[var(--user-card-border)]
        p-2.5
        sm:gap-3
        sm:rounded-2xl
        sm:p-3.5
      "
      style={{
        background:
          "rgba(255,255,255,.03)",
      }}
    >
      <span
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          border
          border-[var(--user-card-border)]
          text-[var(--user-primary)]
          sm:h-10
          sm:w-10
          sm:rounded-xl
        "
      >
        <Icon
          size={15}
          strokeWidth={1.8}
          className="sm:h-[18px] sm:w-[18px]"
          aria-hidden="true"
        />
      </span>

      <div className="min-w-0 flex-1">
        <p
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.08em]
            text-[var(--user-text-muted)]
            sm:text-[10px]
          "
        >
          {label}
        </p>

        {hasValue ? (
          <p
            title={value ?? undefined}
            className="
              mt-0.5
              truncate
              text-[11px]
              font-semibold
              text-[var(--user-title)]
              sm:text-sm
            "
          >
            {value}
          </p>
        ) : (
          <div className="mt-0.5 flex items-center gap-2">
            <span
              className="
                text-[11px]
                text-[var(--user-text-muted)]
                sm:text-sm
              "
            >
              Not added
            </span>

            {onAdd && (
              <button
                type="button"
                onClick={onAdd}
                className="
                  text-[10px]
                  font-semibold
                  text-[var(--user-primary)]
                  transition
                  hover:underline
                  sm:text-xs
                "
              >
                Add
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfileHeader({
  user,
  onEdit,
}: ProfileHeaderProps) {
  const avatar =
    getCloudinaryImageUrl(
      user.avatarKey,
      "c_fill,w_320,h_320,f_auto,q_auto",
    );

  return (
    <section
      aria-label="Account overview"
      className="
        relative
        overflow-hidden
        rounded-lg
        border
        bg-[var(--user-card-bg)]
        p-3
        shadow-[var(--user-card-shadow)]
        sm:rounded-[var(--user-radius-lg)]
        sm:p-6
      "
      style={{
        borderColor:
          "var(--user-card-border)",
      }}
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-0
        "
        style={{
          background:
            "radial-gradient(circle at top right, rgba(99,102,241,.10), transparent 36%), radial-gradient(circle at bottom left, rgba(59,130,246,.07), transparent 42%)",
        }}
      />

      <div className="relative">
        {/* Header: avatar, name, edit */}
        <div
          className="
            flex
            items-center
            gap-3
            sm:gap-5
          "
        >
          <div
            className="
              relative
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-full
              border
              sm:h-[var(--profile-avatar-size-desktop)]
              sm:w-[var(--profile-avatar-size-desktop)]
            "
            style={{
              background:
                "var(--user-avatar-bg)",
              borderColor:
                "var(--user-avatar-border)",
            }}
          >
            {avatar ? (
              <Image
                src={avatar}
                alt="Profile photo"
                fill
                className="object-cover"
              />
            ) : (
              <>
                <UserCircle2
                  size={40}
                  className="sm:hidden"
                  color="var(--user-icon-muted)"
                />

                <UserCircle2
                  size={64}
                  className="hidden sm:block"
                  color="var(--user-icon-muted)"
                />
              </>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-[var(--user-text-muted)]
                sm:text-xs
                sm:tracking-[0.16em]
              "
            >
              Account Overview
            </p>

            <h2
              className="
                mt-0.5
                truncate
                text-base
                font-bold
                text-[var(--user-title)]
                sm:mt-1
                sm:text-2xl
              "
            >
              {user.firstName} {user.lastName}
            </h2>
          </div>

          <button
            type="button"
            onClick={onEdit}
            className="
              h-8
              shrink-0
              rounded-full
              border
              border-[var(--user-card-border)]
              bg-[color:rgba(255,255,255,.06)]
              px-3.5
              text-[10px]
              font-medium
              text-[var(--user-title)]
              backdrop-blur-sm
              transition-all
              duration-300
              hover:border-[var(--user-primary)]
              hover:bg-[color:rgba(255,255,255,.10)]
              sm:h-10
              sm:px-6
              sm:text-sm
            "
          >
            Edit Profile
          </button>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="
            my-3
            h-px
            bg-[var(--user-card-border)]
            sm:my-5
          "
        />

        {/* Details */}
        <div
          className="
            grid
            grid-cols-1
            gap-2
            sm:grid-cols-2
            sm:gap-3
          "
        >
          <DetailTile
            icon={Mail}
            label="Email"
            value={user.email}
          />

          <DetailTile
            icon={Phone}
            label="Primary Phone"
            value={user.phoneNumber}
            onAdd={onEdit}
          />

          <DetailTile
            icon={Smartphone}
            label="Secondary Phone"
            value={user.secondaryPhoneNumber}
            onAdd={onEdit}
          />

          <DetailTile
            icon={MapPin}
            label="Country"
            value={user.country}
            onAdd={onEdit}
          />
        </div>
      </div>
    </section>
  );
}
