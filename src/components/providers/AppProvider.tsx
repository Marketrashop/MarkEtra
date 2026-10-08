"use client";

import type {
  ReactNode,
} from "react";

import ThemeProvider from "./ThemeProvider";

import {
  AuthProvider,
} from "@/context/AuthContext";

import {
  CartProvider,
} from "@/context/CartContext";

import {
  CheckoutProvider,
} from "@/context/CheckoutContext";

import {
  SearchProvider,
} from "@/context/AppSearchContext";

import {
  WishlistProvider,
} from "@/context/WishlistContext";

import {
  SubscriptionProvider,
} from "@/context/SubscriptionContext";

import {
  PremiumToastProvider,
} from "@/components/ui/PremiumToast";

import {
  ExperienceProvider,
} from "@/components/ui/ExperienceOverlay";

import {
  RealtimeProvider,
} from "@upstash/realtime/client";

type AppProviderProps = {
  children: ReactNode;
};

export default function AppProvider({
  children,
}: AppProviderProps) {
  return (
    <ThemeProvider>
      <ExperienceProvider>
        <PremiumToastProvider>
          <AuthProvider>
<RealtimeProvider
  api={{
    url: "/api/realtime",
    withCredentials: true,
  }}
>
              <WishlistProvider>
                <SubscriptionProvider>
                  <CartProvider>
                    <CheckoutProvider>
                      <SearchProvider>
                        {children}
                      </SearchProvider>
                    </CheckoutProvider>
                  </CartProvider>
                </SubscriptionProvider>
              </WishlistProvider>
            </RealtimeProvider>
          </AuthProvider>
        </PremiumToastProvider>
      </ExperienceProvider>
    </ThemeProvider>
  );
}