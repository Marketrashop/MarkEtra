"use client";

import { useMemo, useState } from "react";

import { DangerZone } from "./DangerZone";
import { EditProfileDialog } from "./EditProfileDialog";
import ProfileHeader from "./ProfileHeader";

import type {
  ProfileFormValues,
  ProfileUser,
} from "./profile.types";

type Props = {
  user: ProfileUser;
};

export default function ProfileClient({
  user,
}: Props) {
  const [profile, setProfile] =
    useState(user);

  const [editOpen, setEditOpen] =
    useState(false);

  const formValues =
    useMemo<ProfileFormValues>(
      () => ({
        firstName:
          profile.firstName,

        lastName:
          profile.lastName,

        phoneNumber:
          profile.phoneNumber,

        secondaryPhoneNumber:
          profile.secondaryPhoneNumber ??
          "",

        country:
          profile.country,
      }),
      [profile],
    );

  function handleProfileUpdated(
    values: ProfileFormValues,
  ) {
    setProfile((previous) => ({
      ...previous,

      firstName:
        values.firstName,

      lastName:
        values.lastName,

      phoneNumber:
        values.phoneNumber,

      secondaryPhoneNumber:
        values.secondaryPhoneNumber ||
        null,

      country:
        values.country,
    }));

    setEditOpen(false);
  }

  return (
    <div
      className="
        flex
        w-full
        flex-col
        gap-4
        sm:gap-8
      "
    >
      <ProfileHeader
        user={profile}
        onEdit={() =>
          setEditOpen(true)
        }
      />

      <EditProfileDialog
        open={editOpen}
        onClose={() =>
          setEditOpen(false)
        }
        initialValues={
          formValues
        }
        onSuccess={
          handleProfileUpdated
        }
      />

      <DangerZone />
    </div>
  );
}