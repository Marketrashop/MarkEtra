"use client";

import { MessageCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <div
      className="
        space-y-4
        sm:space-y-6
      "
    >
      <header>
        <h1
          className="
            text-[18px]
            font-bold
            text-[var(--foreground)]
            sm:text-2xl
          "
        >
          Help Center
        </h1>

        <p
          className="
            mt-1
            max-w-2xl
            text-[11px]
            leading-5
            text-[var(--foreground-muted)]
            sm:mt-2
            sm:text-sm
            sm:leading-normal
          "
        >
          Need assistance? Our support team is available through live chat.
          Click the chat bubble in the bottom right corner of your screen to
          start a conversation. We typically respond as quickly as possible.
        </p>
      </header>

      <section
        className="
          rounded-[var(--card-radius)]
          border
          border-[var(--border)]
          bg-[var(--surface-card)]
          p-3
          shadow-[var(--shadow-sm)]
          sm:p-6
        "
      >
        <div
          className="
            flex
            items-start
            gap-2.5
            sm:gap-4
          "
        >
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[color-mix(in_srgb,var(--primary)_12%,transparent)]
              text-[var(--primary)]
              sm:h-12
              sm:w-12
            "
          >
            <MessageCircle
              className="
                h-4.5
                w-4.5
                sm:h-6
                sm:w-6
              "
            />
          </div>

          <div
            className="
              min-w-0
              space-y-1.5
              sm:space-y-2
            "
          >
            <h2
              className="
                text-[13px]
                font-semibold
                text-[var(--foreground)]
                sm:text-lg
              "
            >
              Live Chat Support
            </h2>

            <p
              className="
                text-[10px]
                leading-5
                text-[var(--foreground-muted)]
                sm:text-sm
                sm:leading-6
              "
            >
              Our support team is ready to help with your account, orders,
              deposits, withdrawals, affiliate products, or any other questions.
              Simply open the live chat widget to begin chatting with us.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}