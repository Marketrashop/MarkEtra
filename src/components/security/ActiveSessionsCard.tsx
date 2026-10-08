"use client";

import {
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import {
  MonitorSmartphone,
} from "lucide-react";

import SessionItem from "./SessionItem";
import EmptySessions from "./EmptySessions";

import {
  getActiveSessions,
  revokeSession,
} from "./security.service";

import type {
  ActiveSession,
} from "./security.types";

function ActiveSessionsSkeleton() {
  return (
    <div
      className="
        space-y-2
        sm:space-y-3
      "
    >
      {Array.from({
        length: 3,
      }).map((_, index) => (
        <div
          key={index}
          className="
            flex
            flex-col
            gap-2.5
            rounded-lg
            border
            border-[var(--user-card-border)]
            bg-[var(--user-surface)]
            p-2.5
            animate-pulse
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
                h-8
                w-8
                shrink-0
                rounded-lg
                bg-[var(--user-card-border)]
                sm:h-9
                sm:w-9
              "
            />

            <div
              className="
                min-w-0
                flex-1
                space-y-1.5
                pt-0.5
                sm:space-y-2
              "
            >
              <div
                className="
                  h-2.5
                  w-32
                  rounded
                  bg-[var(--user-card-border)]
                  sm:h-3
                  sm:w-40
                "
              />

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2.5
                  sm:gap-4
                "
              >
                <div
                  className="
                    h-2
                    w-20
                    rounded
                    bg-[var(--user-card-border)]
                    sm:h-2.5
                    sm:w-24
                  "
                />

                <div
                  className="
                    h-2
                    w-28
                    rounded
                    bg-[var(--user-card-border)]
                    sm:h-2.5
                    sm:w-36
                  "
                />

                <div
                  className="
                    h-2
                    w-24
                    rounded
                    bg-[var(--user-card-border)]
                    sm:h-2.5
                    sm:w-28
                  "
                />
              </div>
            </div>
          </div>

          <div
            className="
              h-8
              w-16
              self-start
              rounded-lg
              bg-[var(--user-card-border)]
              sm:h-9
              sm:w-20
              sm:self-center
            "
          />
        </div>
      ))}
    </div>
  );
}

export default function ActiveSessionsCard() {
  const [
    sessions,
    setSessions,
  ] = useState<
    ActiveSession[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    revokingId,
    setRevokingId,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      setLoading(true);

      const response =
        await getActiveSessions();

      setSessions(
        response.sessions,
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load active sessions.",
      );
    } finally {
      setLoading(false);
    }
  }

async function handleRevoke(
  sessionId: string,
): Promise<boolean> {
  try {
    setRevokingId(
      sessionId,
    );

    const response =
      await revokeSession(
        sessionId,
      );

    toast.success(
      response.message,
    );

    setSessions(
      (previous) =>
        previous.filter(
          (session) =>
            session.id !==
            sessionId,
        ),
    );

    return true;
  } catch (error) {
    console.error(error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Unable to revoke session.",
    );

    return false;
  } finally {
    setRevokingId(
      null,
    );
  }
}

  return (
    <section
      className="
        rounded-lg
        border
        border-[var(--user-card-border)]
        bg-[var(--user-card-bg)]
        p-3
        sm:rounded-[var(--user-radius-lg)]
        sm:p-5
      "
    >
      <div
        className="
          mb-3
          flex
          items-start
          gap-2.5
          sm:mb-4
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
          <MonitorSmartphone
            size={16}
            className="sm:hidden"
          />

          <MonitorSmartphone
            size={18}
            className="hidden sm:block"
          />
        </div>

        <div className="min-w-0">
          <h2
            className="
              text-[12px]
              font-semibold
              text-[var(--user-title)]
              sm:text-sm
            "
          >
            Active Sessions
          </h2>

          <p
            className="
              mt-0.5
              text-[10px]
              leading-4
              text-[var(--user-text-muted)]
              sm:mt-1
              sm:text-xs
              sm:leading-5
            "
          >
            Manage devices signed into your account.
          </p>
        </div>
      </div>

      {loading ? (
        <ActiveSessionsSkeleton />
      ) : sessions.length === 0 ? (
        <EmptySessions />
      ) : (
        <div
          className="
            space-y-2
            sm:space-y-3
          "
        >
          {sessions.map(
            (session) => (
              <SessionItem
                key={session.id}
                session={
                  session
                }
                loading={
                  revokingId ===
                  session.id
                }
                onRevoke={
                  handleRevoke
                }
              />
            ),
          )}
        </div>
      )}
    </section>
  );
}