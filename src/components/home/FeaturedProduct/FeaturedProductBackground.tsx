export default function FeaturedProductBackground() {
  return (
    <div
      aria-hidden="true"
      className="
        absolute
        left-0
        z-0

        top-[720px]
        bottom-0

        w-[102%]

        sm:top-[390px]
        sm:w-[98%]

        md:top-[160px]
        md:bottom-[22px]
        md:w-[92%]

        lg:top-[90px]
        lg:bottom-0
        lg:w-[56%]

        xl:w-[54%]

        2xl:w-[52%]

        overflow-hidden
      "
      style={{
        backgroundColor: "var(--featured-panel)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "var(--featured-panel-pattern)",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
          backgroundSize: "auto",
        }}
      />
    </div>
  );
}