"use client";

import { PLANS_FAQ } from "./plans.constants";

export default function PlansFAQ() {
  return (
    <section
      className="
        bg-[var(--background)]
        py-10
        transition-colors
        duration-300
        sm:py-20
        lg:py-24
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-5xl
          px-3
          sm:px-5
          lg:px-8
        "
      >
        <div
          className="
            mx-auto
            max-w-3xl
            text-center
          "
        >
          <h2
            className="
              text-2xl
              font-bold
              leading-tight
              text-[var(--foreground)]
              transition-colors
              duration-300
              sm:text-4xl
            "
          >
            {PLANS_FAQ.title}
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-2xl
              text-[11px]
              leading-5
              text-[var(--foreground-muted)]
              transition-colors
              duration-300
              sm:mt-6
              sm:text-lg
              sm:leading-8
            "
          >
            {PLANS_FAQ.description}
          </p>
        </div>

        <div
          className="
            mx-auto
            mt-8
            max-w-4xl
            space-y-5
            sm:mt-14
            sm:space-y-8
          "
        >
          <div
            className="
              border-b
              border-[var(--border)]
              pb-5
              sm:pb-8
            "
          >
            <h3
              className="
                text-sm
                font-semibold
                leading-5
                text-[var(--foreground)]
                sm:text-xl
                sm:leading-normal
              "
            >
              Can I upgrade my membership later?
            </h3>

            <p
              className="
                mt-2.5
                text-[11px]
                leading-5
                text-[var(--foreground-muted)]
                sm:mt-4
                sm:text-base
                sm:leading-8
              "
            >
              Yes. You can upgrade your membership at any time to access
              additional features and benefits as your business grows.
            </p>
          </div>

          <div
            className="
              border-b
              border-[var(--border)]
              pb-5
              sm:pb-8
            "
          >
            <h3
              className="
                text-sm
                font-semibold
                leading-5
                text-[var(--foreground)]
                sm:text-xl
                sm:leading-normal
              "
            >
              Are there any hidden fees?
            </h3>

            <p
              className="
                mt-2.5
                text-[11px]
                leading-5
                text-[var(--foreground-muted)]
                sm:mt-4
                sm:text-base
                sm:leading-8
              "
            >
              No. Our pricing is transparent. You only pay for the membership
              plan you choose.
            </p>
          </div>

          <div
            className="
              border-b
              border-[var(--border)]
              pb-5
              sm:pb-8
            "
          >
            <h3
              className="
                text-sm
                font-semibold
                leading-5
                text-[var(--foreground)]
                sm:text-xl
                sm:leading-normal
              "
            >
              Can I cancel my subscription?
            </h3>

            <p
              className="
                mt-2.5
                text-[11px]
                leading-5
                text-[var(--foreground-muted)]
                sm:mt-4
                sm:text-base
                sm:leading-8
              "
            >
              Yes. You can cancel your membership according to our Terms of
              Service and Refund Policy.
            </p>
          </div>

          <div>
            <h3
              className="
                text-sm
                font-semibold
                leading-5
                text-[var(--foreground)]
                sm:text-xl
                sm:leading-normal
              "
            >
              Which plan is best for beginners?
            </h3>

            <p
              className="
                mt-2.5
                text-[11px]
                leading-5
                text-[var(--foreground-muted)]
                sm:mt-4
                sm:text-base
                sm:leading-8
              "
            >
              Our Basic Plan is a great starting point for new sellers, while
              the higher tier plans are designed for businesses looking to grow
              faster with additional tools and support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}