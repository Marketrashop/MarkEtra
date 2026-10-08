import type { Metadata } from "next";
import {
  Geist,
  Poppins,
} from "next/font/google";

import "./globals.css";

import {
  AppSearch,
} from "@/components/AppSearch";
import AppProvider from "@/components/providers/AppProvider";
import { AppPreloader } from "@/components/ui/Preloader";
import AppToaster from "@/components/ui/AppToaster";
import { SITE } from "@/constants/site";
import { cn } from "@/lib/utils";
import NavigationLoaderProvider from "@/components/ui/Preloader/NavigationLoaderProvider";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: [
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
  ],
  variable:
    "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://marketra.shop",
  ),

  title: {
    default: "MarkEtra",
    template:
      "%s | MarkEtra",
  },

  description:
    SITE.description,

  openGraph: {
    type: "website",
    url: "https://marketra.shop",
    siteName:
      "MarkEtra",
    title:
      "MarkEtra",
    description:
      SITE.description,
    images: [
      {
        url: "/assets/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "MarkEtra",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",
    title:
      "MarkEtra",
    description:
      SITE.description,
    images: [
      "/assets/images/og-image.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "font-sans",
        geist.variable,
      )}
    >
      <body
        className={`${poppins.variable} antialiased`}
      >
<AppProvider>
  <NavigationLoaderProvider>
    <AppSearch />

    <AppPreloader>
      {children}
    </AppPreloader>

    <AppToaster />
  </NavigationLoaderProvider>
</AppProvider>
      </body>
    </html>
  );
}