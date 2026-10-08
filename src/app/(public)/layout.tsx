import type { ReactNode } from "react";

import Footer from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

import ScrollToTop from "@/components/ui/ScrollToTop";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Header />

      <main>{children}</main>

      <Footer />

      <ScrollToTop />
    </>
  );
}