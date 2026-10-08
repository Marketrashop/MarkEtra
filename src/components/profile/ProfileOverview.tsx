"use client";

import {
  CalendarDays,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { AvatarUploader } from "./AvatarUploader";

type UserStatus =
  | "ACTIVE"
  | "PENDING_VERIFICATION"
  | "SUSPENDED"
  | "DEACTIVATED";

type ProfileOverviewProps = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  secondaryPhoneNumber: string | null;
  country: string;

  avatarKey: string | null;
  avatarUrl: string | null;

  status: UserStatus;
  createdAt: string;

  onAvatarUploaded: (
    avatarKey: string,
    avatarUrl: string,
  ) => void;

  onEdit: () => void;
};

function getBadgeStyles(
  status: UserStatus,
) {
  switch (status) {
    case "ACTIVE":
      return {
        background:
          "var(--user-badge-success-bg)",
        color:
          "var(--user-badge-success-text)",
        label: "Active",
      };

    case "PENDING_VERIFICATION":
      return {
        background:
          "var(--user-badge-warning-bg)",
        color:
          "var(--user-badge-warning-text)",
        label:
          "Pending Verification",
      };

    case "SUSPENDED":
    case "DEACTIVATED":
      return {
        background:
          "var(--user-badge-danger-bg)",
        color:
          "var(--user-badge-danger-text)",
        label:
          status === "SUSPENDED"
            ? "Suspended"
            : "Deactivated",
      };
  }
}

export function ProfileOverview({
  firstName,
  lastName,
  email,
  phoneNumber,
  secondaryPhoneNumber,
  country,
  avatarKey,
  avatarUrl,
  status,
  createdAt,
  onAvatarUploaded,
  onEdit,
}: ProfileOverviewProps) {
  const badge =
    getBadgeStyles(status);

  const fullName =
    `${firstName} ${lastName}`;

  return (
    <section
      className="
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
          flex
          flex-col
          gap-4
          sm:gap-8
          lg:flex-row
          lg:items-center
        "
      >
        <AvatarUploader
          avatarKey={avatarKey}
          avatarUrl={avatarUrl}
          fullName={fullName}
          onUploaded={onAvatarUploaded}
        />

        <div className="flex-1">
          <div
            className="
              flex
              flex-col
              gap-3
              md:flex-row
              md:items-start
              md:justify-between
              sm:gap-4
            "
          >
            <div className="min-w-0">
              <h1
                className="
                  truncate
                  text-lg
                  font-bold
                  text-[var(--user-title)]
                  sm:text-2xl
                "
              >
                {fullName}
              </h1>

              <div
                className="
                  mt-2
                  inline-flex
                  rounded-full
                  px-2
                  py-0.5
                  text-[10px]
                  font-medium
                  sm:mt-3
                  sm:px-3
                  sm:py-1
                  sm:text-sm
                "
                style={{
                  background:
                    badge.background,
                  color:
                    badge.color,
                }}
              >
                {badge.label}
              </div>
            </div>

            <button
              type="button"
              onClick={onEdit}
              className="
                h-8
                self-start
                rounded-lg
                bg-[var(--user-button-bg)]
                px-3.5
                text-[10px]
                font-semibold
                text-[var(--user-button-text)]
                transition
                hover:bg-[var(--user-button-hover)]
                sm:h-auto
                sm:rounded-[var(--user-radius-md)]
                sm:px-5
                sm:py-2.5
                sm:text-sm
              "
            >
              Edit Profile
            </button>
          </div>

          <div
            className="
              mt-4
              grid
              gap-2
              sm:mt-8
              sm:grid-cols-2
              sm:gap-5
            "
          >
            <InfoItem
              icon={
                <>
                  <Mail
                    size={14}
                    className="sm:hidden"
                  />
                  <Mail
                    size={18}
                    className="hidden sm:block"
                  />
                </>
              }
              label="Email"
              value={email}
            />

            <InfoItem
              icon={
                <>
                  <Phone
                    size={14}
                    className="sm:hidden"
                  />
                  <Phone
                    size={18}
                    className="hidden sm:block"
                  />
                </>
              }
              label="Primary Phone"
              value={phoneNumber}
            />

            <InfoItem
              icon={
                <>
                  <Phone
                    size={14}
                    className="sm:hidden"
                  />
                  <Phone
                    size={18}
                    className="hidden sm:block"
                  />
                </>
              }
              label="Secondary Phone"
              value={
                secondaryPhoneNumber ??
                "Not added"
              }
            />

            <InfoItem
              icon={
                <>
                  <MapPin
                    size={14}
                    className="sm:hidden"
                  />
                  <MapPin
                    size={18}
                    className="hidden sm:block"
                  />
                </>
              }
              label="Country"
              value={country}
            />

            <InfoItem
              icon={
                <>
                  <CalendarDays
                    size={14}
                    className="sm:hidden"
                  />
                  <CalendarDays
                    size={18}
                    className="hidden sm:block"
                  />
                </>
              }
              label="Member Since"
              value={new Date(
                createdAt,
              ).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function InfoItem({
  icon,
  label,
  value,
}: InfoItemProps) {
  return (
    <div
      className="
        rounded-lg
        border
        p-2.5
        sm:rounded-[var(--user-radius-md)]
        sm:p-4
      "
      style={{
        borderColor:
          "var(--user-divider)",
        background:
          "var(--user-surface)",
      }}
    >
      <div
        className="
          flex
          items-center
          gap-1.5
          sm:gap-2
        "
      >
        <span className="text-[var(--user-icon-muted)]">
          {icon}
        </span>

        <span
          className="
            text-[10px]
            font-medium
            text-[var(--user-text-muted)]
            sm:text-sm
          "
        >
          {label}
        </span>
      </div>

      <p
        className="
          mt-1
          break-words
          text-[11px]
          font-medium
          text-[var(--user-text)]
          sm:mt-2
          sm:text-base
        "
      >
        {value}
      </p>
    </div>
  );
}