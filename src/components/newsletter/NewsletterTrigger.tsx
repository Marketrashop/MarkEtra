"use client";

import {
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import NewsletterPopup from "./NewsletterPopup";
import NewsletterArtwork from "./NewsletterArtwork";
import NewsletterForm from "./NewsletterForm";

const STORAGE_KEY =
  "marketra-hide-newsletter";

type NewsletterTriggerProps = {
  ready: boolean;
};

export default function NewsletterTrigger({
  ready,
}: NewsletterTriggerProps) {
  const [
    open,
    setOpen,
  ] = useState(false);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const hidden =
      localStorage.getItem(
        STORAGE_KEY,
      ) === "true";

    if (!hidden) {
      setOpen(true);
    }
  }, [ready]);

  function handleClose() {
    setOpen(false);
  }

  async function handleSubscribe(
    email: string,
    dontShowAgain: boolean,
  ) {
    if (!email.trim()) {
      toast.error(
        "Please enter your email address.",
      );

      return;
    }

    if (dontShowAgain) {
      localStorage.setItem(
        STORAGE_KEY,
        "true",
      );
    }

    toast.success(
      "Thanks for subscribing! You'll be the first to hear about new products and exclusive offers.",
    );

    setOpen(false);
  }

  return (
    <NewsletterPopup
      open={open}
      onClose={handleClose}
    >
      <NewsletterArtwork />

      <NewsletterForm
        onClose={handleClose}
        onSubscribe={
          handleSubscribe
        }
      />
    </NewsletterPopup>
  );
}