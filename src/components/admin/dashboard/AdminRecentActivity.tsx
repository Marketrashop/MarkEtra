import Link from "next/link";

import {
  ArrowRight,
  Clock3,
} from "lucide-react";

type Activity = {
  id: string;
  action: string;
  entity: string;
  description: string | null;
  createdAt: Date;
  admin: {
    firstName: string;
    lastName: string;
  };
};

type AdminRecentActivityProps = {
  activities: Activity[];
};

export default function AdminRecentActivity({
  activities,
}: AdminRecentActivityProps) {
  return (
    <section
      className="
        mb-15
        rounded-lg
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-card-bg)]
        p-2.5
        shadow-[var(--admin-card-shadow)]
        sm:mb-20
        sm:rounded-[var(--admin-card-radius)]
        sm:p-[var(--admin-card-padding)]
      "
    >
      <div
        className="
          mb-2.5
          flex
          items-center
          justify-between
          gap-2
          sm:mb-4
          sm:gap-3
        "
      >
        <div className="min-w-0">
          <h2
            className="
              text-[12px]
              font-semibold
              text-[var(--admin-title)]
              sm:text-base
            "
          >
            Recent Activity
          </h2>

          <p
            className="
              mt-0.5
              text-[9px]
              leading-3.5
              text-[var(--admin-muted)]
              sm:mt-1
              sm:text-xs
              sm:leading-4
            "
          >
            Latest administrator actions.
          </p>
        </div>

        <Link
          href="/admin/activity"
          className="
            flex
            shrink-0
            items-center
            gap-0.5
            text-[9px]
            font-medium
            text-[var(--admin-primary)]
            transition-opacity
            duration-[var(--admin-transition)]
            hover:opacity-80
            sm:gap-1
            sm:text-xs
          "
        >
          View All
          <ArrowRight
            size={11}
            className="
              sm:h-3.5
              sm:w-3.5
            "
          />
        </Link>
      </div>

      {activities.length === 0 ? (
        <div
          className="
            rounded-md
            border
            border-[var(--admin-surface-border)]
            bg-[var(--admin-surface-bg)]
            py-5
            text-center
            sm:rounded-[var(--admin-surface-radius)]
            sm:py-8
          "
        >
          <div
            className="
              mx-auto
              mb-2
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-[var(--admin-stat-border)]
              bg-[var(--admin-stat-bg)]
              sm:mb-3
              sm:h-10
              sm:w-10
            "
          >
            <Clock3
              size={14}
              className="
                text-[var(--admin-primary)]
                sm:h-[18px]
                sm:w-[18px]
              "
            />
          </div>

          <p
            className="
              text-[10px]
              font-medium
              text-[var(--admin-title)]
              sm:text-sm
            "
          >
            No recent activity.
          </p>
        </div>
      ) : (
        <div className="space-y-1.5 sm:space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="
                rounded-md
                border
                border-[var(--admin-surface-border)]
                bg-[var(--admin-surface-bg)]
                p-2
                sm:rounded-[var(--admin-surface-radius)]
                sm:p-3
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-2
                  sm:gap-3
                "
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="
                      text-[10px]
                      font-semibold
                      leading-3.5
                      text-[var(--admin-title)]
                      sm:text-sm
                      sm:leading-4
                    "
                  >
                    {activity.action.replaceAll("_", " ")}
                  </p>

                  {activity.description && (
                    <p
                      className="
                        mt-0.5
                        text-[9px]
                        leading-3.5
                        text-[var(--admin-muted)]
                        sm:mt-1
                        sm:text-xs
                        sm:leading-4
                      "
                    >
                      {activity.description}
                    </p>
                  )}

                  <p
                    className="
                      mt-1
                      text-[8px]
                      leading-3
                      text-[var(--admin-muted)]
                      sm:mt-2
                      sm:text-[11px]
                      sm:leading-4
                    "
                  >
                    {activity.admin.firstName}{" "}
                    {activity.admin.lastName}
                  </p>
                </div>

                <time
                  className="
                    shrink-0
                    text-[8px]
                    leading-3
                    text-[var(--admin-muted)]
                    sm:text-[11px]
                    sm:leading-4
                  "
                  dateTime={activity.createdAt.toISOString()}
                >
                  {activity.createdAt.toLocaleDateString()}
                </time>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}