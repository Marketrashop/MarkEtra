"use client";

type ProductSizePickerProps = {
  sizes: string[];

  selectedSize: string | null;

  disabled?: boolean;

  onChange: (
    size: string
  ) => void;
};

export default function ProductSizePicker({
  sizes,
  selectedSize,
  disabled = false,
  onChange,
}: ProductSizePickerProps) {
  const uniqueSizes = [
    ...new Set(
      sizes
        .map(
          (size) =>
            size.trim()
        )
        .filter(Boolean)
    ),
  ];

  if (
    uniqueSizes.length === 0
  ) {
    return null;
  }

  return (
    <section
      className="
        space-y-3
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <h3
          className="
            text-sm
            font-medium
            text-[var(--foreground)]
          "
        >
          Size
        </h3>

        {selectedSize && (
          <span
            className="
              text-sm
              text-[var(--muted-foreground)]
            "
          >
            {selectedSize}
          </span>
        )}
      </div>

      <div
        className="
          flex
          flex-wrap
          gap-3
        "
      >
        {uniqueSizes.map(
          (size) => {
            const active =
              size ===
              selectedSize;

            return (
              <button
                key={size}
                type="button"
                disabled={
                  disabled
                }
                onClick={() =>
                  onChange(size)
                }
                className={`
                  min-w-12
                  rounded-[var(--radius-md)]
                  border
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition
                  ${
                    active
                      ? "border-black bg-black text-white"
                      : "border-[var(--border)] bg-transparent hover:border-black"
                  }
                  ${
                    disabled
                      ? "cursor-not-allowed opacity-60"
                      : ""
                  }
                `}
              >
                {size}
              </button>
            );
          }
        )}
      </div>
    </section>
  );
}