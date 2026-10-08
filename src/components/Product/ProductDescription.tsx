"use client";

type ProductDescriptionProps = {
  description: string;
};

export default function ProductDescription({
  description,
}: ProductDescriptionProps) {
  return (
    <section
      className="
        rounded-lg
        border
        border-[var(--border)]
        bg-[var(--surface)]
        p-3
        transition-colors
        duration-300
        lg:rounded-xl
        lg:p-4
      "
    >
      <h2
        className="
          text-[14px]
          font-semibold
          tracking-[-0.02em]
          text-[var(--foreground)]
          lg:text-[16px]
        "
      >
        Product Description
      </h2>

      <div
        className="
          mt-2
          space-y-2
          text-[12px]
          leading-5
          text-[var(--foreground-muted)]
          lg:mt-3
          lg:space-y-3
          lg:text-[13px]
          lg:leading-6
        "
      >
        {description
          .split("\n")
          .filter(Boolean)
          .map((paragraph, index) => (
            <p key={index}>
              {paragraph}
            </p>
          ))}
      </div>
    </section>
  );
}