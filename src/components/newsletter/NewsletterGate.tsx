"use client";

import {
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import {
  NewsletterArtwork,
  NewsletterForm,
  NewsletterPopup,
} from ".";

const NEWSLETTER_SUBSCRIBED_KEY =
  "newsletter-subscribed";

const NEWSLETTER_DISMISSED_KEY =
  "newsletter-dismissed";

const NEWSLETTER_LAST_CLOSED_KEY =
  "newsletter-last-closed";

const THREE_DAYS_IN_MS =
  3 * 24 * 60 * 60 * 1000;

export default function NewsletterGate() {
  const [open, setOpen] =
    useState(false);

  useEffect(() => {
    let timer: ReturnType<
      typeof setTimeout
    >;

    function handlePreloaderComplete() {
      timer = setTimeout(() => {
        if (
          localStorage.getItem(
            NEWSLETTER_SUBSCRIBED_KEY,
          )
        ) {
          return;
        }

        if (
          localStorage.getItem(
            NEWSLETTER_DISMISSED_KEY,
          )
        ) {
          return;
        }

        const lastClosed =
          Number(
            localStorage.getItem(
              NEWSLETTER_LAST_CLOSED_KEY,
            ),
          );

        if (
          lastClosed &&
          Date.now() -
            lastClosed <
            THREE_DAYS_IN_MS
        ) {
          return;
        }

        setOpen(true);
      }, 10000);
    }

    window.addEventListener(
      "marketra:preloader-complete",
      handlePreloaderComplete,
    );

    return () => {
      window.removeEventListener(
        "marketra:preloader-complete",
        handlePreloaderComplete,
      );

      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  function handleClose(
    saveCooldown = true,
  ) {
    if (saveCooldown) {
      localStorage.setItem(
        NEWSLETTER_LAST_CLOSED_KEY,
        Date.now().toString(),
      );
    }

    setOpen(false);
  }

  return (
    <NewsletterPopup
      open={open}
      onClose={() =>
        handleClose()
      }
    >
      <NewsletterArtwork />

      <NewsletterForm
        onClose={() =>
          handleClose()
        }
        onSubscribe={(
          _email,
          dontShowAgain,
        ) => {
          localStorage.setItem(
            NEWSLETTER_SUBSCRIBED_KEY,
            "true",
          );

          if (dontShowAgain) {
            localStorage.setItem(
              NEWSLETTER_DISMISSED_KEY,
              "true",
            );
          }

          toast.success(
            "Thanks for subscribing! You'll be the first to hear about new products and exclusive offers.",
          );

          handleClose(false);
        }}
      />
    </NewsletterPopup>
  );
}