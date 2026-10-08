export default function SectionDivider() {
  return (
    <div
      className="
        relative
        z-20
        m-0
        h-0
        w-full
        p-0
        pointer-events-none
      "
    >
      {/* Main hairline */}
      <div
        className="
          absolute
          left-1/2
          top-0
          h-px
          w-[96%]
          -translate-x-1/2
          sm:w-[90%]
          lg:w-[82%]
        "
        style={{
          background:
            "linear-gradient(to right, transparent, color-mix(in srgb, var(--primary) 22%, transparent), transparent)",
        }}
      />

      {/* Center accent */}
      <div
        className="
          absolute
          left-1/2
          top-0
          z-[1]
          h-1.5
          w-1.5
          -translate-x-1/2
          -translate-y-1/2
          rotate-45
          rounded-[1px]
        "
        style={{
          background:
            "var(--primary)",
          boxShadow:
            "0 0 12px color-mix(in srgb, var(--primary) 35%, transparent)",
        }}
      />
    </div>
  );
}