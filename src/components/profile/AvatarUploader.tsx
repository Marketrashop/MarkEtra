"use client";

import { useRef, useState } from "react";

import Image from "next/image";

import { Camera, Loader2, User } from "lucide-react";

import { toast } from "sonner";

import { uploadAvatar } from "./profile.service";

type AvatarUploaderProps = {
  avatarKey: string | null;
  avatarUrl: string | null;
  fullName: string;
  onUploaded: (
    avatarKey: string,
    avatarUrl: string,
  ) => void;
};

export function AvatarUploader({
  avatarKey,
  avatarUrl,
  fullName,
  onUploaded,
}: AvatarUploaderProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  function getInitials() {
    return fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
  }

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);

      const result =
        await uploadAvatar(file);

      onUploaded(
        result.avatarKey,
        result.avatarUrl,
      );

      toast.success(
        "Avatar updated successfully.",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to upload avatar.",
      );
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  }

  return (
    <div className="relative w-fit">
      <div
        className="
          relative
          flex
          h-[var(--profile-avatar-size-mobile)]
          w-[var(--profile-avatar-size-mobile)]
          items-center
          justify-center
          overflow-hidden
          rounded-full
          border
          bg-[var(--user-avatar-bg)]
          text-[var(--user-title)]
          shadow-sm
          md:h-[var(--profile-avatar-size-desktop)]
          md:w-[var(--profile-avatar-size-desktop)]
        "
        style={{
          borderColor:
            "var(--user-avatar-border)",
        }}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={fullName}
            fill
            className="object-cover"
          />
        ) : (
          <span
            className="
              text-base
              font-semibold
              md:text-3xl
            "
          >
            {getInitials() || (
              <User
                size={24}
                className="md:hidden"
              />
            )}

            {getInitials() ? null : (
              <User
                size={34}
                className="hidden md:block"
              />
            )}
          </span>
        )}
      </div>

      <button
        type="button"
        disabled={uploading}
        onClick={() =>
          inputRef.current?.click()
        }
        className="
          absolute
          bottom-0.5
          right-0.5
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
          shadow-md
          transition
          hover:scale-105
          disabled:cursor-not-allowed
          disabled:opacity-60
          md:bottom-1
          md:right-1
          md:h-10
          md:w-10
        "
        style={{
          background:
            "var(--profile-avatar-camera-bg)",
          color:
            "var(--profile-avatar-camera-color)",
        }}
      >
        {uploading ? (
          <>
            <Loader2
              className="
                animate-spin
                md:hidden
              "
              size={14}
            />

            <Loader2
              className="
                hidden
                animate-spin
                md:block
              "
              size={18}
            />
          </>
        ) : (
          <>
            <Camera
              className="md:hidden"
              size={14}
            />

            <Camera
              className="hidden md:block"
              size={18}
            />
          </>
        )}
      </button>

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
      />
    </div>
  );
}