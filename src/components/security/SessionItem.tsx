"use client";

import {
  useState,
} from "react";

import {
  Monitor,
  Smartphone,
  Globe,
  MapPin,
  Clock3,
  LogOut,
  AlertTriangle,
  X,
  Loader2,
} from "lucide-react";

import {
  parseUserAgent,
} from "@/lib/device/parse-user-agent";

import type {
  ActiveSession,
} from "./security.types";

type SessionItemProps = {
  session: ActiveSession;

  loading?: boolean;

  onRevoke: (
    sessionId: string,
  ) => Promise<boolean>;
};

function getLocationLabel(
  session: ActiveSession,
): string {
  const location =
    session.location;

  if (!location) {
    return "Location unavailable";
  }

  const parts = [
    location.city,
    location.region,
    location.country,
  ].filter(
    (
      value,
    ): value is string =>
      Boolean(value),
  );

  if (parts.length > 0) {
    return parts.join(
      ", ",
    );
  }

  if (
    location.countryCode
  ) {
    return location.countryCode;
  }

  return "Location unavailable";
}

export default function SessionItem({
  session,
  loading = false,
  onRevoke,
}: SessionItemProps) {
  const [
    showConfirmModal,
    setShowConfirmModal,
  ] = useState(false);

  const [
    revoking,
    setRevoking,
  ] = useState(false);

  const isMobile =
    session.userAgent
      ?.toLowerCase()
      .includes("mobile") ??
    false;

  const deviceName =
    parseUserAgent(
      session.userAgent,
    );

  const locationLabel =
    getLocationLabel(
      session,
    );

  function handleRevokeClick() {
    if (
      loading ||
      revoking
    ) {
      return;
    }

    setShowConfirmModal(true);
  }

  async function handleConfirmRevoke() {
    if (
      loading ||
      revoking
    ) {
      return;
    }

    try {
      setRevoking(true);

      const success =
        await onRevoke(
          session.id,
        );

      if (success) {
        setShowConfirmModal(
          false,
        );
      }
    } finally {
      setRevoking(false);
    }
  }

  function handleCloseModal() {
    if (revoking) {
      return;
    }

    setShowConfirmModal(false);
  }

  return (
    <>
      <div
        className="
          flex
          flex-col
          gap-2.5
          rounded-lg
          border
          border-[var(--user-card-border)]
          bg-[var(--user-surface)]
          p-2.5
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:gap-3
          sm:rounded-[var(--user-radius-md)]
          sm:p-3
        "
      >
        <div
          className="
            flex
            min-w-0
            items-start
            gap-2.5
            sm:gap-3
          "
        >
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-[var(--user-button-bg)]/10
              text-[var(--user-button-bg)]
              sm:h-9
              sm:w-9
            "
          >
            {isMobile ? (
              <>
                <Smartphone
                  size={16}
                  className="sm:hidden"
                />

                <Smartphone
                  size={18}
                  className="hidden sm:block"
                />
              </>
            ) : (
              <>
                <Monitor
                  size={16}
                  className="sm:hidden"
                />

                <Monitor
                  size={18}
                  className="hidden sm:block"
                />
              </>
            )}
          </div>

          <div
            className="
              min-w-0
              space-y-0.5
              sm:space-y-1
            "
          >
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-1.5
                sm:gap-2
              "
            >
              <p
                className="
                  min-w-0
                  truncate
                  text-[11px]
                  font-semibold
                  text-[var(--user-title)]
                  sm:text-sm
                "
              >
                {deviceName}
              </p>

{session.current ? (
<span
  className="
    inline-flex
    items-center
    gap-1.5
    rounded-full
    bg-purple-500/20
    px-2.5
    py-1
    text-xs
    font-medium
  "
  style={{
    color: "var(--user-device-badge-text)",
  }}
>
  <span
    className="
      h-1.5
      w-1.5
      rounded-full
    "
    style={{
      backgroundColor: "var(--user-device-badge-text)",
    }}
  />

  THIS DEVICE
</span>
) : session.active ? (
  <span
    className="
      inline-flex
      items-center
      gap-1.5
      rounded-full
      bg-emerald-500/10
      px-2.5
      py-1
      text-xs
      font-medium
      text-emerald-600
      dark:text-emerald-400
    "
  >
    <span
      className="
        h-1.5
        w-1.5
        rounded-full
        bg-emerald-500
      "
    />

    ACTIVE
  </span>
) : (
  <span
    className="
      inline-flex
      items-center
      gap-1.5
      rounded-full
      bg-[var(--user-surface)]
      px-2.5
      py-1
      text-xs
      font-medium
      text-[var(--user-text-muted)]
    "
  >
    <span
      className="
        h-1.5
        w-1.5
        rounded-full
        bg-[var(--user-text-muted)]
      "
    />

    INACTIVE
  </span>
)}
            </div>

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-x-2.5
                gap-y-0.5
                text-[9px]
                text-[var(--user-text-muted)]
                sm:gap-x-4
                sm:gap-y-1
                sm:text-xs
              "
            >
              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                "
              >
                <Globe
                  size={11}
                  className="sm:hidden"
                />

                <Globe
                  size={13}
                  className="hidden sm:block"
                />

                {session.ipAddress ??
                  "Unknown IP"}
              </span>

              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                "
              >
                <MapPin
                  size={11}
                  className="sm:hidden"
                />

                <MapPin
                  size={13}
                  className="hidden sm:block"
                />

                {locationLabel}
              </span>

              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                "
              >
                <Clock3
                  size={11}
                  className="sm:hidden"
                />

                <Clock3
                  size={13}
                  className="hidden sm:block"
                />

                {new Date(
                  session.lastActivityAt,
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {!session.current && (
          <button
            type="button"
            disabled={
              loading ||
              revoking
            }
            onClick={
              handleRevokeClick
            }
            className="
              inline-flex
              h-8
              items-center
              justify-center
              gap-1.5
              self-start
              rounded-lg
              border
              border-[var(--user-card-border)]
              px-2.5
              text-[10px]
              font-medium
              text-[var(--user-danger)]
              transition-colors
              duration-[var(--user-transition)]
              hover:bg-[var(--user-danger)]/10
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:h-9
              sm:gap-2
              sm:self-center
              sm:px-3
              sm:text-xs
            "
          >
            <LogOut
              size={12}
              className="sm:hidden"
            />

            <LogOut
              size={14}
              className="hidden sm:block"
            />

            Revoke
          </button>
        )}
      </div>

      {showConfirmModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
            backdrop-blur-sm
          "
          role="presentation"
          onMouseDown={(
            event,
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              handleCloseModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="revoke-session-title"
            aria-describedby="revoke-session-description"
            className="
              w-full
              max-w-[360px]
              rounded-xl
              border
              border-[var(--user-card-border)]
              bg-[var(--user-card-bg)]
              p-4
              shadow-2xl
              sm:rounded-[var(--user-radius-lg)]
              sm:p-5
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-3
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-2.5
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-[var(--user-danger)]/10
                    text-[var(--user-danger)]
                    sm:h-9
                    sm:w-9
                  "
                >
                  <AlertTriangle
                    size={17}
                  />
                </div>

                <div className="min-w-0">
                  <h3
                    id="revoke-session-title"
                    className="
                      text-[12px]
                      font-semibold
                      text-[var(--user-title)]
                      sm:text-sm
                    "
                  >
                    Revoke Session?
                  </h3>

                  <p
                    id="revoke-session-description"
                    className="
                      mt-1
                      text-[10px]
                      leading-4
                      text-[var(--user-text-muted)]
                      sm:text-xs
                      sm:leading-5
                    "
                  >
                    This will sign out this
                    device from your account.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={revoking}
                onClick={
                  handleCloseModal
                }
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-[var(--user-text-muted)]
                  transition-colors
                  duration-[var(--user-transition)]
                  hover:bg-[var(--user-surface)]
                  hover:text-[var(--user-title)]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>

            <div
              className="
                mt-4
                rounded-lg
                border
                border-[var(--user-card-border)]
                bg-[var(--user-surface)]
                p-3
              "
            >
              <p
                className="
                  text-[11px]
                  font-semibold
                  text-[var(--user-title)]
                  sm:text-xs
                "
              >
                {deviceName}
              </p>

              <div
                className="
                  mt-1.5
                  flex
                  flex-wrap
                  gap-x-3
                  gap-y-1
                  text-[9px]
                  text-[var(--user-text-muted)]
                  sm:text-[10px]
                "
              >
                <span>
                  {session.ipAddress ??
                    "Unknown IP"}
                </span>

                <span>
                  {locationLabel}
                </span>
              </div>
            </div>

            <div
              className="
                mt-4
                flex
                flex-col-reverse
                gap-2
                sm:flex-row
                sm:justify-end
              "
            >
              <button
                type="button"
                disabled={revoking}
                onClick={
                  handleCloseModal
                }
                className="
                  inline-flex
                  h-9
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-[var(--user-card-border)]
                  px-3
                  text-[10px]
                  font-medium
                  text-[var(--user-title)]
                  transition-colors
                  duration-[var(--user-transition)]
                  hover:bg-[var(--user-surface)]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:text-xs
                "
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={revoking}
                onClick={
                  handleConfirmRevoke
                }
                className="
                  inline-flex
                  h-9
                  items-center
                  justify-center
                  gap-1.5
                  rounded-lg
                  bg-[var(--user-danger)]
                  px-3
                  text-[10px]
                  font-medium
                  text-white
                  transition-opacity
                  duration-[var(--user-transition)]
                  hover:opacity-90
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:text-xs
                "
              >
                {revoking ? (
                  <>
                    <Loader2
                      size={13}
                      className="animate-spin"
                    />

                    Revoking...
                  </>
                ) : (
                  <>
                    <LogOut
                      size={13}
                    />

                    Revoke Session
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}