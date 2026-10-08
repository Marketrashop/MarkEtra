"use client";

import NavigationLink from "@/components/ui/Preloader/NavigationLink";

import { Heart } from "lucide-react";

export default function EmptyWishlist() {
  return (
    <section
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-lg
        border
        border-[var(--user-card-border)]
        bg-[var(--user-card-bg)]
        px-3
        py-7
        text-center
        shadow-[var(--user-card-shadow)]
        sm:rounded-[var(--user-radius-md)]
        sm:px-6
        sm:py-10
      "
    >
      <div
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-[var(--user-avatar-bg)]
          text-[var(--user-icon-muted)]
          sm:h-14
          sm:w-14
        "
      >
        <Heart
          size={20}
          strokeWidth={2}
          className="sm:hidden"
        />
        <Heart
          size={26}
          strokeWidth={2}
          className="hidden sm:block"
        />
      </div>

      <h2
        className="
          mt-3
          text-[14px]
          font-semibold
          text-[var(--user-title)]
          sm:mt-5
          sm:text-lg
        "
      >
        Your wishlist is empty
      </h2>

      <p
        className="
          mt-1.5
          max-w-md
          px-2
          text-[10px]
          leading-4
          text-[var(--user-text-muted)]
          sm:mt-2
          sm:px-0
          sm:text-sm
          sm:leading-6
        "
      >
        Save products you love so you can
        quickly find them later and add
        them to your cart whenever you are
        ready.
      </p>

      <NavigationLink
        href="/Market-Place"
        className="
          mt-4
          inline-flex
          h-9
          items-center
          justify-center
          rounded-lg
          bg-[#5B5EF7]
          px-4
          text-[11px]
          font-semibold
          text-white
          transition-all
          duration-[var(--user-transition)]
          hover:bg-[#4847D4]
          sm:mt-6
          sm:h-10
          sm:rounded-[var(--user-radius-sm)]
          sm:px-5
          sm:text-sm
        "
      >
        Browse Products
      </NavigationLink>
    </section>
  );
}