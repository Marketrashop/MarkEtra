import Link from "next/link";

import {
  ArrowRight,
  Package,
} from "lucide-react";

type Listing = {
  id: string;

  submittedAt: Date | null;

  user: {
    firstName: string;

    lastName: string;
  };

  product: {
    id: string;

    name: string;
  };
};

type AdminAffiliateProductsProps = {
  listings: Listing[];
};

export default function AdminAffiliateProducts({
  listings,
}: AdminAffiliateProductsProps) {
  return (
    <section
      className="
        rounded-lg
        border
        border-[var(--admin-card-border)]
        bg-[var(--admin-card-bg)]
        p-2.5
        shadow-[var(--admin-card-shadow)]
        sm:rounded-[var(--admin-card-radius)]
        sm:p-[var(--admin-card-padding)]
      "
    >
      <div
        className="
          mb-2.5
          flex
          items-center
          justify-between
          gap-2
          sm:mb-4
          sm:gap-3
        "
      >
        <div className="min-w-0">
          <h2
            className="
              text-[12px]
              font-semibold
              text-[var(--admin-title)]
              sm:text-base
            "
          >
            Affiliate Products
          </h2>

          <p
            className="
              mt-0.5
              text-[9px]
              leading-3.5
              text-[var(--admin-muted)]
              sm:mt-1
              sm:text-xs
              sm:leading-4
            "
          >
            Awaiting review.
          </p>
        </div>

        <Link
          href="/admin/affiliate"
          className="
            flex
            shrink-0
            items-center
            gap-0.5
            text-[9px]
            font-medium
            text-[var(--admin-primary)]
            transition-opacity
            duration-[var(--admin-transition)]
            hover:opacity-80
            sm:gap-1
            sm:text-xs
          "
        >
          View All

          <ArrowRight
            size={11}
            className="
              sm:h-3.5
              sm:w-3.5
            "
          />
        </Link>
      </div>

      {listings.length === 0 ? (
        <div
          className="
            rounded-md
            border
            border-[var(--admin-surface-border)]
            bg-[var(--admin-surface-bg)]
            py-5
            text-center
            sm:rounded-[var(--admin-surface-radius)]
            sm:py-8
          "
        >
          <div
            className="
              mx-auto
              mb-2
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-[var(--admin-stat-border)]
              bg-[var(--admin-stat-bg)]
              sm:mb-3
              sm:h-10
              sm:w-10
            "
          >
            <Package
              size={14}
              className="
                text-[var(--admin-primary)]
                sm:h-[18px]
                sm:w-[18px]
              "
            />
          </div>

          <p
            className="
              text-[10px]
              font-medium
              text-[var(--admin-title)]
              sm:text-sm
            "
          >
            No products awaiting review.
          </p>
        </div>
      ) : (
        <div
          className="
            divide-y
            divide-[var(--admin-card-border)]
          "
        >
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/admin/affiliate/${listing.id}`}
              className="
                flex
                items-center
                justify-between
                gap-2
                py-2
                transition-opacity
                duration-[var(--admin-transition)]
                hover:opacity-80
                sm:gap-4
                sm:py-3
              "
            >
              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                <p
                  className="
                    truncate
                    text-[10px]
                    font-semibold
                    text-[var(--admin-title)]
                    sm:text-sm
                  "
                >
                  {listing.product.name}
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-[8px]
                    leading-3
                    text-[var(--admin-muted)]
                    sm:mt-1
                    sm:text-xs
                    sm:leading-4
                  "
                >
                  Submitted by{" "}
                  {listing.user.firstName}{" "}
                  {listing.user.lastName}
                </p>
              </div>

              <ArrowRight
                size={12}
                className="
                  shrink-0
                  text-[var(--admin-muted)]
                  sm:h-4
                  sm:w-4
                "
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}