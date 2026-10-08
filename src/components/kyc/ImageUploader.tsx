"use client";

import Image from "next/image";

import {
  ImagePlus,
  Loader2,
  Trash2,
} from "lucide-react";

type ImageUploaderProps = {
  label: string;

  description?: string;

  preview: string | null;

  loading?: boolean;

  required?: boolean;

  accept?: string;

  onSelect: (
    file: File
  ) => Promise<void>;

  onRemove: () => void;
};

export default function ImageUploader({
  label,
  description,
  preview,
  loading = false,
  required = false,
  accept = "image/*",
  onSelect,
  onRemove,
}: ImageUploaderProps) {
  return (
    <div
      className="
        space-y-1.5
        sm:space-y-2
      "
    >
      <div>
        <h3
          className="
            text-[11px]
            font-semibold
            text-[var(--user-title)]
            sm:text-sm
          "
        >
          {label}

          {required && (
            <span
              className="
                ml-1
                text-[var(--user-danger)]
              "
            >
              *
            </span>
          )}
        </h3>

        {description && (
          <p
            className="
              mt-0.5
              text-[9px]
              leading-4
              text-[var(--user-text-muted)]
              sm:mt-1
              sm:text-xs
              sm:leading-normal
            "
          >
            {description}
          </p>
        )}
      </div>

      {preview ? (
        <div
          className="
            relative
            overflow-hidden
            rounded-lg
            border
            border-[var(--user-card-border)]
            bg-[var(--user-card-bg)]
            sm:rounded-xl
          "
        >
          <div
            className="
              relative
              h-28
              w-full
              sm:h-40
              md:h-44
              lg:h-48
            "
          >
            <Image
              src={preview}
              alt={label}
              fill
              className="object-cover"
            />
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="
              absolute
              right-1.5
              top-1.5
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              bg-[var(--user-danger-bg)]
              text-[var(--user-danger)]
              transition-colors
              duration-[var(--user-transition)]
              hover:bg-[var(--user-danger-hover)]
              sm:right-2
              sm:top-2
              sm:h-8
              sm:w-8
            "
          >
            <Trash2
              size={14}
              className="
                sm:h-4
                sm:w-4
              "
            />
          </button>
        </div>
      ) : (
        <label
          className="
            flex
            h-28
            w-full
            cursor-pointer
            flex-col
            items-center
            justify-center
            rounded-lg
            border-2
            border-dashed
            border-[var(--user-card-border)]
            bg-[var(--user-card-bg)]
            px-3
            text-center
            transition-colors
            duration-[var(--user-transition)]
            hover:border-[var(--user-input-border-focus)]
            sm:h-40
            sm:rounded-xl
            sm:px-4
            md:h-44
            lg:h-48
          "
        >
          <input
            type="file"
            accept={accept}
            className="hidden"
            disabled={loading}
            onChange={async (event) => {
              const file =
                event.target.files?.[0];

              if (!file) {
                return;
              }

              await onSelect(file);

              event.target.value = "";
            }}
          />

          {loading ? (
            <>
              <Loader2
                size={18}
                className="
                  animate-spin
                  text-[var(--user-icon)]
                  sm:h-[22px]
                  sm:w-[22px]
                "
              />

              <p
                className="
                  mt-1.5
                  text-[10px]
                  text-[var(--user-text)]
                  sm:mt-2
                  sm:text-sm
                "
              >
                Uploading...
              </p>
            </>
          ) : (
            <>
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-[var(--user-surface)]
                  sm:h-10
                  sm:w-10
                "
              >
                <ImagePlus
                  size={16}
                  className="
                    text-[var(--user-icon)]
                    sm:h-[18px]
                    sm:w-[18px]
                  "
                />
              </div>

              <p
                className="
                  mt-1.5
                  text-[10px]
                  font-medium
                  text-[var(--user-title)]
                  sm:mt-2
                  sm:text-sm
                "
              >
                Upload image
              </p>

              <p
                className="
                  mt-0.5
                  text-[8px]
                  text-[var(--user-text-muted)]
                  sm:mt-1
                  sm:text-xs
                "
              >
                PNG • JPG • WEBP
              </p>
            </>
          )}
        </label>
      )}
    </div>
  );
}