import type { Metadata } from "next";

import { ContactPage } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact | MarkEtra",

  description:
    "Get in touch with MarkEtra for questions, partnerships, support, or business inquiries. We'd love to hear from you.",
};

export default function Contact() {
  return <ContactPage />;
}