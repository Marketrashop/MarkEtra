"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
  return (
<Toaster
  position="top-center"
  offset={24}
  closeButton
  duration={2200}
  richColors={false}
/>
  );
}