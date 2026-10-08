"use client";

type AppSearchPopularProps = {
  searches: string[];

  onSelect: (
    value: string,
  ) => void;
};

export default function AppSearchPopular({
  searches,
  onSelect,
}: AppSearchPopularProps) {
  if (searches.length === 0) {
    return null;
  }

  return (
    <section
      className="
        mt-5
        sm:mt-8
      "
    >
      <div
        className="
          mb-2
          flex
          items-center
          justify-between
          sm:mb-3
        "
      >
        <h2
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.1em]
            text-[var(--foreground-muted)]
            sm:text-[13px]
            sm:tracking-[0.12em]
          "
        >
          Popular Searches
        </h2>

        <div
          className="
            ml-3
            h-px
            flex-1
            bg-[var(--border)]
            sm:ml-4
          "
        />
      </div>

      <div
        className="
          flex
          flex-wrap
          gap-1.5
          sm:gap-2
        "
      >
        {searches.map(
          (search) => (
            <button
              key={search}
              type="button"
              onClick={() =>
                onSelect(
                  search,
                )
              }
              className="
                rounded-full
                border
                border-[var(--border)]
                bg-transparent
                px-2.5
                py-1
                text-[10px]
                font-medium
                text-[var(--foreground-muted)]
                transition-all
                duration-200
                hover:border-[var(--primary)]
                hover:text-[var(--primary)]
                sm:px-3
                sm:py-1.5
                sm:text-[13px]
              "
            >
              {search}
            </button>
          ),
        )}
      </div>
    </section>
  );
}