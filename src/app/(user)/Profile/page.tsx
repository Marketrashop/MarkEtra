import type { Metadata } from "next";

import ProfilePage from "@/components/profile/ProfilePage";

export const metadata: Metadata = {
  title: "My Profile",
  description:
    "Manage your personal information, profile photo, and account settings.",
};

export default function Page() {
  return <ProfilePage />;
}