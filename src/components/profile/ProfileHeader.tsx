"use client";

import Image from "next/image";

import {
  Mail,
  MapPin,
  Phone,
  UserCircle2,
} from "lucide-react";

import {
  getCloudinaryImageUrl,
} from "@/lib/cloudinary";

import type {
  ProfileHeaderProps,
} from "./profile.types";

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

      <div
        className="
          relative
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
          sm:gap-5
        "
      >
        <div
          className="
            flex
            items-start
            gap-2.5
            sm:gap-4
          "
        >
          <div
            className="
              relative
              flex
              h-16
              w-16
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
                  size={42}
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

          <div className="min-w-0">
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

            <div
              className="
                mt-3
                grid
                gap-2.5
                text-[11px]
                sm:mt-5
                sm:gap-3
                sm:text-sm
              "
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <Mail
                  size={14}
                  className="
                    mt-0.5
                    shrink-0
                    text-[var(--user-icon-muted)]
                    sm:h-[17px]
                    sm:w-[17px]
                  "
                />

                <div className="min-w-0">
                  <p className="text-[9px] text-[var(--user-text-muted)] sm:text-xs">
                    Email
                  </p>

                  <p className="break-all font-medium text-[var(--user-title)] sm:text-sm">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <Phone
                  size={14}
                  className="
                    mt-0.5
                    shrink-0
                    text-[var(--user-icon-muted)]
                    sm:h-[17px]
                    sm:w-[17px]
                  "
                />

                <div>
                  <p className="text-[9px] text-[var(--user-text-muted)] sm:text-xs">
                    Primary Phone
                  </p>

                  <p className="font-medium text-[var(--user-title)] sm:text-sm">
                    {user.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <Phone
                  size={14}
                  className="
                    mt-0.5
                    shrink-0
                    text-[var(--user-icon-muted)]
                    sm:h-[17px]
                    sm:w-[17px]
                  "
                />

                <div>
                  <p className="text-[9px] text-[var(--user-text-muted)] sm:text-xs">
                    Secondary Phone
                  </p>

                  <p className="font-medium text-[var(--user-title)] sm:text-sm">
                    {user.secondaryPhoneNumber ??
                      "Not added"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <MapPin
                  size={14}
                  className="
                    mt-0.5
                    shrink-0
                    text-[var(--user-icon-muted)]
                    sm:h-[17px]
                    sm:w-[17px]
                  "
                />

                <div>
                  <p className="text-[9px] text-[var(--user-text-muted)] sm:text-xs">
                    Country
                  </p>

                  <p className="font-medium text-[var(--user-title)] sm:text-sm">
                    {user.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="
            h-8
            self-start
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
            sm:self-auto
            sm:px-6
            sm:text-sm
          "
        >
          Edit Profile
        </button>
      </div>
    </section>
  );
}