"use client";

import SecurityHeader from "./SecurityHeader";
import ChangePasswordCard from "./ChangePasswordCard";
import ActiveSessionsCard from "./ActiveSessionsCard";

export default function SecurityPage() {
  return (
    <div
      className="
        mx-auto
        flex
        w-full
        max-w-4xl
        flex-col
        gap-3
        sm:gap-5
      "
    >
      <SecurityHeader />

      <ChangePasswordCard />

      <ActiveSessionsCard />
    </div>
  );
}