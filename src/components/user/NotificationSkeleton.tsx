"use client";

export default function NotificationSkeleton() {
  return (
    <div
      className="
        space-y-2
        p-2
        sm:space-y-3
        sm:p-3
      "
    >
      {Array.from({ length: 5 }).map(
        (_, index) => (
          <div
            key={index}
            className="
              flex
              items-start
              gap-2.5
              rounded-lg
              p-2.5
              sm:gap-3
              sm:rounded-xl
              sm:p-3
            "
          >
            <div
              className="
                h-8
                w-8
                shrink-0
                animate-pulse
                rounded-full
                bg-[var(--border)]
                sm:h-11
                sm:w-11
              "
            />

            <div className="min-w-0 flex-1">
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-2.5
                  sm:gap-4
                "
              >
                <div
                  className="
                    min-w-0
                    space-y-1.5
                    sm:space-y-2
                  "
                >
                  <div
                    className="
                      h-2.5
                      w-28
                      animate-pulse
                      rounded
                      bg-[var(--border)]
                      sm:h-3
                      sm:w-40
                    "
                  />

                  <div
                    className="
                      h-2.5
                      w-40
                      animate-pulse
                      rounded
                      bg-[var(--border)]
                      sm:h-3
                      sm:w-56
                    "
                  />

                  <div
                    className="
                      h-2.5
                      w-24
                      animate-pulse
                      rounded
                      bg-[var(--border)]
                      sm:h-3
                      sm:w-32
                    "
                  />
                </div>

                <div
                  className="
                    h-2.5
                    w-7
                    shrink-0
                    animate-pulse
                    rounded
                    bg-[var(--border)]
                    sm:h-3
                    sm:w-10
                  "
                />
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  );
}