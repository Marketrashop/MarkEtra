import { redirect } from "next/navigation";

import {
  CalendarDays,
  CheckCircle2,
  Globe2,
  Mail,
  UserCircle2,
} from "lucide-react";

import ProfileClient from "./ProfileClient";

import { DashboardPage } from "@/components/dashboard";

import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  ).format(date);
}

export default async function ProfilePage() {
  const session =
    await getCurrentSession();

  if (!session) {
    redirect("/");
  }

  const user =
    await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        secondaryPhoneNumber: true,
        country: true,
        avatarKey: true,
        status: true,
        createdAt: true,
      },
    });

  if (!user) {
    redirect("/");
  }

  const profileCompletion = [
    user.firstName,
    user.lastName,
    user.phoneNumber,
    user.secondaryPhoneNumber,
    user.country,
    user.avatarKey,
  ].filter(Boolean).length;

  const completion = Math.round(
    (profileCompletion / 6) * 100,
  );

  return (
    <DashboardPage
      environment="user"
      breadcrumb={[
        {
          label: "My Profile",
        },
      ]}
    >
      <section
        className="
          pt-1
          pb-5
          sm:pt-6
          sm:pb-6
        "
      >
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
                "radial-gradient(circle at top right, rgba(99,102,241,.14), transparent 38%), radial-gradient(circle at bottom left, rgba(59,130,246,.10), transparent 42%)",
            }}
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-3
              sm:gap-5
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div className="max-w-2xl">
              <div
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  border
                  px-1.5
                  py-0.5
                  text-[8px]
                  font-semibold
                  sm:px-2.5
                  sm:py-1
                  sm:text-[11px]
                "
                style={{
                  borderColor:
                    "var(--user-card-border)",
                  background:
                    "rgba(99,102,241,.08)",
                }}
              >
                <UserCircle2
                  size={10}
                  className="sm:h-3 sm:w-3"
                />

                Hello, {user.firstName} 👋
              </div>

              <h1
                className="
                  mt-1.5
                  text-2xl
                  font-extrabold
                  leading-none
                  tracking-tight
                  text-[var(--user-title)]
                  sm:mt-4
                  sm:text-4xl
                "
              >
                Welcome back.
              </h1>

              <p
                className="
                  mt-1.5
                  max-w-xl
                  text-[10px]
                  leading-4
                  text-[var(--user-text-muted)]
                  sm:mt-3
                  sm:text-[15px]
                  sm:leading-7
                "
              >
                Manage your personal details, keep your contact information
                up to date, and make sure your profile is always complete.
              </p>
            </div>

            <div
              className="
                grid
                grid-cols-2
                gap-1.5
                sm:gap-2.5
                lg:w-[430px]
              "
            >
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "Verified",
                },
                {
                  icon: Globe2,
                  label: "Country",
                  value: user.country,
                },
                {
                  icon: CalendarDays,
                  label: "Member Since",
                  value: formatDate(
                    user.createdAt,
                  ),
                },
                {
                  icon: CheckCircle2,
                  label: "Profile",
                  value: `${completion}% Complete`,
                },
              ].map(
                ({
                  icon: Icon,
                  label,
                  value,
                }) => (
                  <div
                    key={label}
                    className="
                      rounded-lg
                      border
                      p-2
                      sm:rounded-2xl
                      sm:p-4
                    "
                    style={{
                      borderColor:
                        "var(--user-card-border)",
                      background:
                        "rgba(255,255,255,.03)",
                    }}
                  >
                    <Icon
                      size={12}
                      className="
                        text-[var(--user-primary)]
                        sm:h-4
                        sm:w-4
                      "
                    />

                    <p
                      className="
                        mt-1
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.06em]
                        text-[var(--user-text-muted)]
                        sm:mt-2
                        sm:text-[10px]
                        sm:tracking-[0.08em]
                      "
                    >
                      {label}
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-[10px]
                        font-semibold
                        leading-4
                        text-[var(--user-title)]
                        sm:text-sm
                      "
                    >
                      {value}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <div
          className="
            mt-4
            sm:mt-8
          "
        >
          <ProfileClient
            user={{
              ...user,
              createdAt:
                user.createdAt.toISOString(),
            }}
          />
        </div>
      </section>
    </DashboardPage>
  );
}