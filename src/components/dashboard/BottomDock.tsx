"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCartContext } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, Home, Loader2, ShoppingCart, Store, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useNavigationLoader } from "@/components/ui/Preloader/NavigationLoaderProvider";
import Tooltip from "@/components/ui/Tooltip";

import { cn } from "@/lib/utils";

import { toast } from "sonner";

const userItems = [
  {
    href: "/Dashboard",
    label: "Dashboard",
    icon: Home,
  },

  {
    href: "/Cart",
    label: "Cart",
    icon: ShoppingCart,
  },

  {
    href: "/Market-Place",
    label: "Market Place",
    icon: Store,
  },

  {
    href: "/wishlist",
    label: "Wishlist",
    icon: Heart,
  },
];

const adminItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: Home,
  },

  {
    href: "/admin/deposits",
    label: "Deposits",
    icon: ArrowDownLeft,
  },

  {
  href: "/admin/products",
  label: "Add products",
  icon: Plus,
},

  {
    href: "/admin/withdrawals",
    label: "Withdrawals",
    icon: ArrowUpRight,
  },
];

type BottomDockProps = {
  environment:
    | "user"
    | "admin";

  moreButton?: ReactNode;

  className?: string;
};

export default function BottomDock({
  environment,
  moreButton,
  className,
}: BottomDockProps) {
const pathname = usePathname();

useEffect(() => {
  setNavigatingTo(null);
}, [pathname]);

const router = useRouter();

const {
  startNavigation,
} = useNavigationLoader();

const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

useEffect(() => {
  if (environment === "user") {
    router.prefetch("/Dashboard");
    router.prefetch("/Market-Place");
    router.prefetch("/wishlist");
  } else {
    router.prefetch("/admin/dashboard");
    router.prefetch("/admin/deposits");
    router.prefetch("/admin/withdrawals");
  }
}, [environment, router]);

  const {
    user,
  } = useAuth();


  const {
  itemCount,
  openCart,
} = useCartContext();

const {
  itemCount: wishlistCount,
} = useWishlist();

const isCheckoutPage =
  pathname ===
    "/checkout" ||
  pathname.startsWith(
    "/checkout/",
  );


  if (
    environment ===
      "user" &&
    isCheckoutPage
  ) {
    return null;
  }

  const items =
    environment ===
    "admin"
      ? adminItems
      : userItems;

  return (
    <div
      className={cn(
        `
          fixed
          inset-x-0
          bottom-[max(0.1rem,env(safe-area-inset-bottom))]
          z-30
          flex
          justify-center
          px-4
          pointer-events-none

          sm:bottom-[max(1.25rem,env(safe-area-inset-bottom))]

          sm:px-6

          lg:px-8
        `,
        className,
      )}
    >
      <div
        className="
          pointer-events-auto

          flex

          h-14

          w-full

          max-w-md

          items-center

          justify-around

          rounded-full

          border

          border-[var(--dock-border)]

          bg-[var(--dock-bg)]

          px-3

          shadow-[0_16px_40px_var(--dock-shadow)]

          backdrop-blur-3xl

          transition-colors
          duration-300

          sm:h-15

          sm:max-w-xl

          sm:px-5
        "
      >
        {items.map(
          ({
            href,
            label,
            icon: Icon,
          }) => {
            const active =
              pathname ===
                href ||
              (href !==
                "/Dashboard" &&
                href !==
                  "/Admin" &&
                pathname.startsWith(
                  `${href}/`,
                ));

const isNavigating =
  navigatingTo === href;

            return (
              <Tooltip
                key={href}
                label={label}
              >
                {label ===
                "Cart" ? (
                  <button
                    type="button"
                    aria-label={
                      label
                    }
                    onClick={
                      openCart
                    }
                    className={cn(
                      `
                        group

                        relative

                        flex

                        h-10

                        w-10

                        items-center

                        justify-center

                        rounded-full

                        border-2

                        border-[var(--dock-item-border)]

                        bg-[var(--dock-item-bg)]

                        transition-all
                        duration-300

                        sm:h-11

                        sm:w-11
                      `,
                      active
                        ? `
                            border-[var(--dock-active-bg)]

                            bg-[var(--dock-active-bg)]

                            text-[var(--dock-active-text)]

                            shadow-[0_8px_20px_var(--dock-active-shadow)]
                          `
                        : `
                            text-[var(--dock-icon)]

                            hover:border-[var(--dock-hover-border)]

                            hover:bg-[var(--dock-hover)]

                            hover:text-[var(--dock-icon-hover)]
                          `,
                    )}
                  >
                    <Icon
                      size={
                        20
                      }
                      strokeWidth={
                        2
                      }
                      className={cn(
                        active
                          ? "text-[var(--dock-active-text)]"
                          : `
                              text-[var(--dock-icon)]

                              transition-colors
                              duration-300

                              group-hover:text-[var(--dock-icon-hover)]
                            `,
                      )}
                    />

                    {itemCount >
                      0 && (
                      <span
                        className="
                          absolute

                          -right-2

                          -top-2

                          flex

                          min-h-[20px]

                          min-w-[20px]

                          items-center

                          justify-center

                          rounded-full

                          bg-[var(--cart-badge-bg)]

                          px-1.5

                          text-[10px]

                          font-bold

                          leading-none

                          text-[var(--cart-badge-text)]

                          shadow-sm

                          transition-colors
                          duration-300
                        "
                        style={{
                          border:
                            "1px solid var(--cart-badge-border)",
                        }}
                      >
                        {itemCount >
                        99
                          ? "99+"
                          : itemCount}
                      </span>
                    )}
                  </button>
                ) : label ===
                  "Wishlist" ? (
                  <button
                    type="button"
                    aria-label={
                      label
                    }
                    onClick={() => {
if (user) {
if (pathname !== "/wishlist") {
  startNavigation();

  setNavigatingTo("/wishlist");

  router.push("/wishlist");
}

  return;
}

                      toast.info(
                        "Sign in to save products and access your wishlist.",
                      );

startNavigation();

router.push(
  "/Auth?redirect=/wishlist",
);
                    }}
                    className={cn(
                      `
                        group

                        relative

                        flex

                        h-10

                        w-10

                        items-center

                        justify-center

                        rounded-full

                        border-2

                        border-[var(--dock-item-border)]

                        bg-[var(--dock-item-bg)]

                        transition-all
                        duration-300

                        sm:h-11

                        sm:w-11
                      `,
                      active
                        ? `
                            border-[var(--dock-active-bg)]

                            bg-[var(--dock-active-bg)]

                            text-[var(--dock-active-text)]

                            shadow-[0_8px_20px_var(--dock-active-shadow)]
                          `
                        : `
                            text-[var(--dock-icon)]

                            hover:border-[var(--dock-hover-border)]

                            hover:bg-[var(--dock-hover)]

                            hover:text-[var(--dock-icon-hover)]
                          `,
                    )}
                  >
{isNavigating ? (
  <Loader2
    size={20}
    className="animate-spin"
  />
) : (
  <Icon
    size={20}
    strokeWidth={2}
    className={cn(
      active
        ? "text-[var(--dock-active-text)]"
        : `
            text-[var(--dock-icon)]

            transition-colors
            duration-300

            group-hover:text-[var(--dock-icon-hover)]
          `,
    )}
  />
)}

                    {user &&
                      wishlistCount >
                        0 && (
                        <span
                          className="
                            absolute

                            -right-2

                            -top-2

                            flex

                            min-h-[18px]

                            min-w-[18px]

                            items-center

                            justify-center

                            rounded-full

                            bg-[var(--cart-badge-bg)]

                            px-1.5

                            text-[9px]

                            font-bold

                            leading-none

                            text-[var(--cart-badge-text)]

                            shadow-sm

                            transition-colors
                            duration-300
                          "
                          style={{
                            border:
                              "1px solid var(--cart-badge-border)",
                          }}
                        >
                          {wishlistCount >
                          99
                            ? "99+"
                            : wishlistCount}
                        </span>
                      )}
                  </button>
) : (
  <button
    type="button"
    aria-label={label}
onClick={() => {
if (pathname !== href) {
  startNavigation();

  setNavigatingTo(href);

  router.push(href);
}
}}
    className={cn(
      `
        group

        flex

        h-10

        w-10

        items-center

        justify-center

        rounded-full

        border-2

        border-[var(--dock-item-border)]

        bg-[var(--dock-item-bg)]

        transition-all
        duration-300

        sm:h-11

        sm:w-11
      `,
      active
        ? `
            border-[var(--dock-active-bg)]

            bg-[var(--dock-active-bg)]

            text-[var(--dock-active-text)]

            shadow-[0_8px_20px_var(--dock-active-shadow)]
          `
        : `
            text-[var(--dock-icon)]

            hover:border-[var(--dock-hover-border)]

            hover:bg-[var(--dock-hover)]

            hover:text-[var(--dock-icon-hover)]
          `,
    )}
  >
{isNavigating ? (
  <Loader2
    size={20}
    className="animate-spin"
  />
) : (
  <Icon
    size={20}
    strokeWidth={2}
    className={cn(
      active
        ? "text-[var(--dock-active-text)]"
        : `
            text-[var(--dock-icon)]

            transition-colors
            duration-300

            group-hover:text-[var(--dock-icon-hover)]
          `,
    )}
  />
)}
  </button>
)}
              </Tooltip>
            );
          },
        )}

        {moreButton && (
          <Tooltip
            label={
              environment ===
              "admin"
                ? "Admin Menu"
                : "Profile & Settings"
            }
          >
            {moreButton}
          </Tooltip>
        )}
      </div>
    </div>
  );
}