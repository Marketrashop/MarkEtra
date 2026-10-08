export default function FooterNewsletter() {
  return (
    <div className="w-full min-w-0">
      <h3 className="relative mb-6 inline-block pb-5 text-[22px] font-semibold tracking-tight text-[var(--foreground)]">
        Newsletter

        <span className="absolute bottom-0 left-0 h-[2px] w-48 rounded-full bg-[var(--accent-divider)]" />
      </h3>

      <p className="mb-8 max-w-[300px] text-[16px] font-medium leading-8 text-[var(--foreground-muted)]">
        Subscribe to our newsletter and stay updated with the
        latest news, updates, and exclusive offers.
      </p>

      <form
        className="
          flex
          w-full
          max-w-full
          min-w-0
          overflow-hidden
          rounded-md
          border
          border-[var(--primary)]
          bg-[var(--surface-footer-bottom)]
        "
      >
        <input
          type="email"
          placeholder="Enter your mail..."
          className="
            h-12
            min-w-0
            flex-1
            bg-transparent
            px-5
            text-[15px]
            font-medium
            text-[var(--foreground)]
            placeholder:text-[var(--foreground-muted)]
            focus:outline-none
          "
        />

        <button
          type="submit"
          className="
            flex
            h-12
            shrink-0
            items-center
            justify-center
            whitespace-nowrap
            bg-[#5B5EF7]
            px-5
            sm:px-7
            text-[15px]
            font-semibold
            text-white
            transition-colors
            duration-200
            hover:bg-[#6B6EFF]
          "
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}