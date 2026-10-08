import type { Metadata } from "next";

import {
  AuthLayout,
  SuccessContent,
} from "@/components/auth";

export const metadata: Metadata = {
  title: "Success",

  description:
    "Your request has been completed successfully.",

  robots: {
    index: false,
    follow: false,
  },
};

export default function SuccessPage() {
  return (
 <AuthLayout>
  <SuccessContent
    title="Success!"
    description="Your request has been completed successfully."
    buttonLabel="Return Home"
    buttonHref="/"
  />
</AuthLayout>
  );
}