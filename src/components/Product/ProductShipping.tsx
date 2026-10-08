"use client";

import {
  Truck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

type ProductShippingProps = {
  shippingMethod: string;

  estimatedDelivery: string;

  returnPolicy: string;
};

export default function ProductShipping({
  shippingMethod,
  estimatedDelivery,
  returnPolicy,
}: ProductShippingProps) {
  return (
    <div
      className="
        mt-6
        rounded-lg
        border
        border-[var(--border)]
        bg-[var(--surface)]
        p-3
        sm:rounded-xl
        sm:p-3.5
        lg:p-3
      "
    >
      <div
        className="
          space-y-3
          sm:space-y-3.5
        "
      >
        {/* Shipping */}

        <div
          className="
            flex
            items-start
            gap-2.5
            sm:gap-3
          "
        >
          <div
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-md
              bg-[var(--primary)]/10
              text-[var(--primary)]
              sm:h-8
              sm:w-8
            "
          >
            <Truck
              size={15}
              strokeWidth={2.2}
            />
          </div>

          <div>
            <h3
              className="
                text-[12px]
                font-semibold
                text-[var(--foreground)]
                sm:text-[13px]
              "
            >
              Shipping
            </h3>

            <p
              className="
                mt-0.5
                text-[11px]
                leading-5
                text-[var(--foreground-muted)]
                sm:text-[12px]
              "
            >
              {shippingMethod}
            </p>

            <p
              className="
                mt-0.5
                text-[10px]
                font-medium
                text-[var(--primary)]
                sm:text-[11px]
              "
            >
              Estimated delivery: {estimatedDelivery}
            </p>
          </div>
        </div>

        {/* Returns */}

        <div
          className="
            flex
            items-start
            gap-2.5
            sm:gap-3
          "
        >
          <div
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-md
              bg-[var(--primary)]/10
              text-[var(--primary)]
              sm:h-8
              sm:w-8
            "
          >
            <RotateCcw
              size={15}
              strokeWidth={2.2}
            />
          </div>

          <div>
            <h3
              className="
                text-[12px]
                font-semibold
                text-[var(--foreground)]
                sm:text-[13px]
              "
            >
              Returns
            </h3>

            <p
              className="
                mt-0.5
                text-[11px]
                leading-5
                text-[var(--foreground-muted)]
                sm:text-[12px]
              "
            >
              {returnPolicy}
            </p>
          </div>
        </div>

        {/* Buyer Protection */}

        <div
          className="
            flex
            items-start
            gap-2.5
            sm:gap-3
          "
        >
          <div
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-md
              bg-[var(--primary)]/10
              text-[var(--primary)]
              sm:h-8
              sm:w-8
            "
          >
            <ShieldCheck
              size={15}
              strokeWidth={2.2}
            />
          </div>

          <div>
            <h3
              className="
                text-[12px]
                font-semibold
                text-[var(--foreground)]
                sm:text-[13px]
              "
            >
              Buyer Protection
            </h3>

            <p
              className="
                mt-0.5
                text-[11px]
                leading-5
                text-[var(--foreground-muted)]
                sm:text-[12px]
              "
            >
              Every purchase is protected through our secure checkout process
              and verified merchant network.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}