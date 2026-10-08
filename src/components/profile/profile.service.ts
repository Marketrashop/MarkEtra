export type UploadAvatarResult = {
  avatarKey: string;
  avatarUrl: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function uploadAvatar(
  file: File,
): Promise<UploadAvatarResult> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error(
      "Please upload a JPG, PNG or WebP image.",
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      "Image size must not exceed 5 MB.",
    );
  }

  const formData = new FormData();

  formData.append("avatar", file);

  const response = await fetch(
    "/api/profile/avatar",
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ??
        "Unable to upload avatar.",
    );
  }

  return {
    avatarKey: data.avatarKey,
    avatarUrl: data.avatarUrl,
  };
}