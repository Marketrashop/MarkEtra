"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Camera,
  Loader2,
  RotateCcw,
  X,
} from "lucide-react";

type CameraCaptureProps = {
  open: boolean;

  loading?: boolean;

  onCapture: (
    file: File
  ) => void;

  onClose: () => void;
};

export default function CameraCapture({
  open,
  loading = false,
  onCapture,
  onClose,
}: CameraCaptureProps) {
  const videoRef =
    useRef<HTMLVideoElement>(null);

  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const [
    starting,
    setStarting,
  ] = useState(false);

  async function startCamera() {
    try {
      setStarting(true);

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              facingMode:
                "user",
            },
          }
        );

      streamRef.current =
        stream;

      if (videoRef.current) {
        videoRef.current.srcObject =
          stream;

        await videoRef.current.play();
      }
    } finally {
      setStarting(false);
    }
  }

  function stopCamera() {
    streamRef.current
      ?.getTracks()
      .forEach((track) =>
        track.stop()
      );

    streamRef.current =
      null;
  }

  useEffect(() => {
    if (!open) {
      stopCamera();
      return;
    }

    void startCamera();

    return () => {
      stopCamera();
    };
  }, [open]);

  function capture() {
    if (
      !videoRef.current ||
      !canvasRef.current
    ) {
      return;
    }

    const video =
      videoRef.current;

    const canvas =
      canvasRef.current;

    canvas.width =
      video.videoWidth;

    canvas.height =
      video.videoHeight;

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.drawImage(
      video,
      0,
      0
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }

        const file =
          new File(
            [blob],
            "selfie.jpg",
            {
              type: "image/jpeg",
            }
          );

        onCapture(file);

        stopCamera();

        onClose();
      },
      "image/jpeg",
      0.95
    );
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-[var(--user-overlay)]
        p-2.5
        sm:p-4
      "
    >
      <div
        className="
          w-full
          max-w-lg
          rounded-lg
          border
          border-[var(--user-card-border)]
          bg-[var(--user-surface)]
          shadow-xl
          sm:rounded-[var(--user-radius-xl)]
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-[var(--user-divider)]
            p-3
            sm:p-5
          "
        >
          <h2
            className="
              text-[15px]
              font-semibold
              text-[var(--user-title)]
              sm:text-lg
            "
          >
            Capture Selfie
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              text-[var(--user-text-muted)]
              transition-colors
              duration-[var(--user-transition)]
              hover:text-[var(--user-title)]
              sm:h-auto
              sm:w-auto
            "
          >
            <X
              size={18}
              className="
                sm:h-[22px]
                sm:w-[22px]
              "
            />
          </button>
        </div>

        <div
          className="
            p-3
            sm:p-5
          "
        >
          <div
            className="
              overflow-hidden
              rounded-lg
              border
              border-[var(--user-card-border)]
              bg-[var(--user-card-bg)]
              sm:rounded-[var(--user-radius-lg)]
            "
          >
            {starting ? (
              <div
                className="
                  flex
                  aspect-[4/3]
                  items-center
                  justify-center
                "
              >
                <Loader2
                  size={26}
                  className="
                    animate-spin
                    text-[var(--user-icon)]
                    sm:h-[34px]
                    sm:w-[34px]
                  "
                />
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="
                  aspect-[4/3]
                  w-full
                  object-cover
                "
              />
            )}
          </div>

          <div
            className="
              mt-3
              flex
              flex-col
              gap-2
              sm:mt-6
              sm:flex-row
              sm:gap-3
            "
          >
            <button
              type="button"
              onClick={capture}
              disabled={
                loading ||
                starting
              }
              className="
                flex
                h-9
                flex-1
                items-center
                justify-center
                gap-1.5
                rounded-lg
                bg-[var(--user-button-bg)]
                px-3
                text-[11px]
                font-medium
                text-[var(--user-button-text)]
                transition-colors
                duration-[var(--user-transition)]
                hover:bg-[var(--user-button-hover)]
                disabled:opacity-60
                sm:h-auto
                sm:gap-2
                sm:rounded-[var(--user-radius-md)]
                sm:px-5
                sm:py-3
                sm:text-base
              "
            >
              {loading ? (
                <Loader2
                  size={15}
                  className="
                    animate-spin
                    sm:h-[18px]
                    sm:w-[18px]
                  "
                />
              ) : (
                <Camera
                  size={15}
                  className="
                    sm:h-[18px]
                    sm:w-[18px]
                  "
                />
              )}

              Capture
            </button>

            <button
              type="button"
              onClick={() => {
                stopCamera();
                void startCamera();
              }}
              className="
                flex
                h-9
                items-center
                justify-center
                gap-1.5
                rounded-lg
                border
                border-[var(--user-input-border)]
                bg-[var(--user-button-secondary-bg)]
                px-3
                text-[11px]
                font-medium
                text-[var(--user-button-secondary-text)]
                transition-colors
                duration-[var(--user-transition)]
                hover:bg-[var(--user-button-secondary-hover)]
                sm:h-auto
                sm:gap-2
                sm:rounded-[var(--user-radius-md)]
                sm:px-5
                sm:py-3
                sm:text-base
              "
            >
              <RotateCcw
                size={15}
                className="
                  sm:h-[18px]
                  sm:w-[18px]
                "
              />

              Retake
            </button>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="hidden"
        />
      </div>
    </div>
  );
}