"use client";

type ProductColorPickerProps = {
  colors: string[];

  selectedColor: string | null;

  disabled?: boolean;

  onChange: (
    color: string
  ) => void;
};

export default function ProductColorPicker({
  colors,
  selectedColor,
  disabled = false,
  onChange,
}: ProductColorPickerProps) {
  const uniqueColors = [
    ...new Set(
      colors
        .map(
          (color) =>
            color.trim()
        )
        .filter(Boolean)
    ),
  ];

  if (
    uniqueColors.length === 0
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
          Color
        </h3>

        {selectedColor && (
          <span
            className="
              text-sm
              text-[var(--muted-foreground)]
            "
          >
            {selectedColor}
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
        {uniqueColors.map(
          (color) => {
            const active =
              color ===
              selectedColor;

            return (
              <button
                key={color}
                type="button"
                disabled={
                  disabled
                }
                onClick={() =>
                  onChange(color)
                }
                className={`
                  rounded-full
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
                {color}
              </button>
            );
          }
        )}
      </div>
    </section>
  );
}