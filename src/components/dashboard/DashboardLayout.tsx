"use client";

import {
  ReactNode,
  useCallback,
  useState,
} from "react";

import {
  Search,
} from "lucide-react";

import Logo from "@/components/layout/Header/Logo";
import PublicTopBar from "@/components/layout/Header/TopBar";

import BottomDock from "./BottomDock";
import MoreMenu from "./MoreMenu";
import TopBar from "./TopBar";
import DashboardContent from "./DashboardContent";
import DashboardFooter from "./DashboardFooter";

import NotificationDropdown from "../user/NotificationDropdown";
import UserChip from "../user/UserChip";

import {
  getCloudinaryImageUrl,
} from "@/lib/cloudinary";

import {
  CartDrawer,
} from "@/components/Cart";

import {
  useCartContext,
} from "@/context/CartContext";

import {
  useSearchContext,
} from "@/context/AppSearchContext";

type DashboardUser = {
  firstName: string;
  lastName: string;
  email: string;
  avatarKey: string | null;
};

type DashboardLayoutProps = {
  children: ReactNode;

  environment:
    | "user"
    | "admin";

  user?: DashboardUser;

  topBarCenter?: ReactNode;

  topBarRight?: ReactNode;
};

export default function DashboardLayout({
  children,
  environment,
  user,
  topBarCenter,
  topBarRight,
}: DashboardLayoutProps) {
  const [
    avatarKey,
    setAvatarKey,
  ] = useState(
    user?.avatarKey ?? null,
  );

  const [
    moreMenuOpen,
    setMoreMenuOpen,
  ] = useState(false);

  const openMoreMenu = useCallback(() => {
    setMoreMenuOpen(true);
  }, []);

  const closeMoreMenu = useCallback(() => {
    setMoreMenuOpen(false);
  }, []);

  const {
    cartOpen,
    closeCart,
  } = useCartContext();

  const {
    openSearch,
  } = useSearchContext();

  return (
    <div
      className="
        flex
        min-h-screen
        flex-col
        bg-[var(--background)]
        text-[var(--foreground)]
        transition-colors
        duration-300
      "
    >
      <PublicTopBar
        environment={environment}
      />

      <TopBar
        left={
          <Logo />
        }
        center={
          topBarCenter ?? (
            <button
              type="button"
              onClick={openSearch}
              className="
                group
                flex
                h-9
                w-full
                max-w-[360px]
                items-center
                gap-2
                rounded-lg
                border
                border-[var(--border)]
                bg-[var(--surface)]
                px-2.5
                text-[10px]
                text-[var(--foreground-muted)]
                transition-all
                duration-200
                hover:border-[var(--primary)]
                hover:bg-[var(--muted)]
                hover:text-[var(--primary)]
                sm:h-11
                sm:gap-3
                sm:rounded-xl
                sm:px-4
                sm:text-sm
              "
            >
              <Search
                size={14}
                className="
                  shrink-0
                  transition-colors
                  duration-200
                  group-hover:text-[var(--primary)]
                  sm:h-[18px]
                  sm:w-[18px]
                "
              />

              <span>
                Search products...
              </span>
            </button>
          )
        }
        right={
          topBarRight ?? (
            <>
              <NotificationDropdown />

              <UserChip
                image={getCloudinaryImageUrl(
                  avatarKey,
                  "c_fill,w_160,h_160,f_auto,q_auto",
                )}
                firstName={user?.firstName}
                lastName={user?.lastName}
                onClick={openMoreMenu}
              />
            </>
          )
        }
      />

      <DashboardContent
        className="
          flex-1
        "
      >
        {children}
      </DashboardContent>

      <DashboardFooter />

      <BottomDock
        environment={environment}
        moreButton={
          <UserChip
            image={getCloudinaryImageUrl(
              avatarKey,
              "c_fill,w_160,h_160,f_auto,q_auto",
            )}
            firstName={user?.firstName}
            lastName={user?.lastName}
            onClick={openMoreMenu}
          />
        }
      />

      <MoreMenu
        open={moreMenuOpen}
        onClose={closeMoreMenu}
        user={{
          ...user!,
          avatarKey,
        }}
        environment={environment}
        onAvatarChanged={setAvatarKey}
      />

      {environment ===
        "user" && (
        <CartDrawer
          open={
            cartOpen
          }
          onClose={
            closeCart
          }
          environment="user"
        />
      )}
    </div>
  );
}