"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import {
  Loader2,
  UserRound,
  X,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  createAffiliateInterest,
  type CreateAffiliateInterestInput,
} from "@/services/admin-affiliate-interest.client";

import {
  getAffiliateTestBuyers,
} from "@/components/admin/affiliate-test-buyers/test-buyer.service";

import type {
  AffiliateTestBuyer,
} from "@/components/admin/affiliate-test-buyers/types";

import type {
  AdminAffiliateInterest,
  AdminAffiliateListing,
} from "@/types/admin-affiliate.types";

import { getCloudinaryImageUrl } from "@/lib/cloudinary/url";

type AffiliateCreateInterestDialogProps = {
  listing:
    | AdminAffiliateListing
    | null;

  open: boolean;

  onClose: () => void;

  onCreated?: (
    interest: AdminAffiliateInterest,
  ) => void;
};

export default function AffiliateCreateInterestDialog({
  listing,
  open,
  onClose,
  onCreated,
}: AffiliateCreateInterestDialogProps) {
  const [
    buyers,
    setBuyers,
  ] = useState<
    AffiliateTestBuyer[]
  >([]);

  const [
    selectedBuyerId,
    setSelectedBuyerId,
  ] = useState("");

  const [
    offeredPrice,
    setOfferedPrice,
  ] = useState("");

  const [
    loadingBuyers,
    setLoadingBuyers,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedBuyerId("");
    setOfferedPrice("");

    async function loadBuyers() {
      try {
        setLoadingBuyers(
          true,
        );

        const response =
          await getAffiliateTestBuyers();

        setBuyers(
          response.data,
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load test buyers.",
        );
      } finally {
        setLoadingBuyers(
          false,
        );
      }
    }

    void loadBuyers();
  }, [open]);

  if (!open || !listing) {
    return null;
  }

  const currentListing =
    listing;

  const selectedBuyer =
    buyers.find(
      (buyer) =>
        buyer.id ===
        selectedBuyerId,
    ) ?? null;

  const numericPrice =
    Number(
      offeredPrice,
    );

  const canSubmit =
    Boolean(
      selectedBuyerId &&
        offeredPrice.trim() &&
        Number.isFinite(
          numericPrice,
        ) &&
        numericPrice > 0 &&
        !saving,
    );

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    const input: CreateAffiliateInterestInput = {
      affiliateListingId:
        currentListing.id,

      testBuyerId:
        selectedBuyerId,

      offeredPrice:
        numericPrice,
    };

    try {
      setSaving(true);

      const interest =
        await createAffiliateInterest(
          input,
        );

      onCreated?.(
        interest,
      );

      toast.success(
        "Buyer interest created successfully.",
      );

      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create buyer interest.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      role="presentation"
      onMouseDown={(
        event,
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
      className="
        fixed
        inset-0
        z-[130]
        flex
        items-center
        justify-center
        bg-black/45
        p-2
        backdrop-blur-sm
        sm:p-3
      "
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-affiliate-interest-title"
        onSubmit={
          handleSubmit
        }
        className="
          w-full
          max-w-sm
          rounded-lg
          border
          p-3
          shadow-2xl
          sm:rounded-xl
          sm:p-4
        "
        style={{
          background:
            "var(--surface)",

          borderColor:
            "var(--border)",
        }}
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-2
            sm:gap-3
          "
        >
          <div className="min-w-0">
            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.08em]
                sm:text-[9px]
              "
              style={{
                color:
                  "var(--foreground-muted)",
              }}
            >
              Buyer Interest
            </p>

<h2
  id="create-affiliate-interest-title"
  className="
    mt-0.5
    truncate
    text-[10px]
    font-bold
    sm:text-sm
  "
  style={{
    color:
      "var(--foreground)",
  }}
>
  Create Interest
</h2>

            <p
              className="
                mt-0.5
                line-clamp-2
                text-[9px]
                leading-3.5
                sm:mt-1
                sm:text-[10px]
                sm:leading-4
              "
              style={{
                color:
                  "var(--foreground-muted)",
              }}
            >
              {listing.product.name}
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              saving
            }
            className="
              flex
              h-6
              w-6
              shrink-0
              items-center
              justify-center
              rounded-md
              border
              transition
              hover:bg-[var(--surface-hover)]
              disabled:opacity-50
              sm:h-7
              sm:w-7
            "
            style={{
              background:
                "var(--surface)",

              color:
                "var(--foreground-muted)",

              borderColor:
                "var(--border)",
            }}
            aria-label="Close"
          >
            <X
              size={12}
              className="sm:hidden"
            />

            <X
              size={14}
              className="hidden sm:block"
            />
          </button>
        </div>

        <div
          className="
            mt-3
            space-y-2.5
            sm:mt-4
            sm:space-y-3
          "
        >
          <div>
            <label
              htmlFor="affiliate-test-buyer"
              className="
                mb-0.5
                block
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.06em]
                sm:mb-1
                sm:text-[9px]
              "
              style={{
                color:
                  "var(--foreground-muted)",
              }}
            >
              Test Buyer
            </label>

            <select
              id="affiliate-test-buyer"
              value={
                selectedBuyerId
              }
              onChange={(
                event,
              ) =>
                setSelectedBuyerId(
                  event.target
                    .value,
                )
              }
              disabled={
                loadingBuyers ||
                saving
              }
              className="
                h-8
                w-full
                rounded-md
                border
                bg-transparent
                px-2
                text-[9px]
                outline-none
                transition
                focus:border-[var(--primary)]
                sm:h-9
                sm:px-2.5
                sm:text-[10px]
              "
              style={{
                borderColor:
                  "var(--border)",

                color:
                  "var(--foreground)",
              }}
            >
              <option
                value=""
              >
                {loadingBuyers
                  ? "Loading buyers..."
                  : "Select a test buyer"}
              </option>

              {buyers.map(
                (buyer) => (
                  <option
                    key={
                      buyer.id
                    }
                    value={
                      buyer.id
                    }
                  >
                    {
                      buyer.name
                    }
                    {" • "}
                    {
                      buyer.phone
                    }
                  </option>
                ),
              )}
            </select>
          </div>

          {selectedBuyer && (
            <div
              className="
                flex
                items-center
                gap-2
                rounded-md
                border
                px-2
                py-1.5
                sm:gap-2.5
                sm:rounded-lg
                sm:px-2.5
                sm:py-2
              "
              style={{
                background:
                  "var(--surface-hover)",

                borderColor:
                  "var(--border)",
              }}
            >
              <BuyerAvatar
                buyer={
                  selectedBuyer
                }
              />

              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-[9px]
                    font-semibold
                    sm:text-[10px]
                  "
                  style={{
                    color:
                      "var(--foreground)",
                  }}
                >
                  {
                    selectedBuyer.name
                  }
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-[8px]
                    sm:text-[9px]
                  "
                  style={{
                    color:
                      "var(--foreground-muted)",
                  }}
                >
                  {
                    selectedBuyer.phone
                  }

                  {selectedBuyer.email
                    ? ` • ${selectedBuyer.email}`
                    : ""}
                </p>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="affiliate-offered-price"
              className="
                mb-0.5
                block
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.06em]
                sm:mb-1
                sm:text-[9px]
              "
              style={{
                color:
                  "var(--foreground-muted)",
              }}
            >
              Offered Price
            </label>

            <div
              className="
                flex
                h-8
                items-center
                rounded-md
                border
                px-2
                sm:h-9
                sm:px-2.5
              "
              style={{
                borderColor:
                  "var(--border)",

                background:
                  "var(--surface)",
              }}
            >
              <span
                className="
                  mr-1
                  text-[9px]
                  font-semibold
                  sm:text-[10px]
                "
                style={{
                  color:
                    "var(--foreground-muted)",
                }}
              >
                $
              </span>

              <input
                id="affiliate-offered-price"
                type="number"
                min="0.01"
                step="0.01"
                value={
                  offeredPrice
                }
                onChange={(
                  event,
                ) =>
                  setOfferedPrice(
                    event.target
                      .value,
                  )
                }
                placeholder="0.00"
                disabled={
                  saving
                }
                className="
                  h-full
                  min-w-0
                  flex-1
                  bg-transparent
                  text-[9px]
                  outline-none
                  sm:text-[10px]
                "
                style={{
                  color:
                    "var(--foreground)",
                }}
              />
            </div>

            <p
              className="
                mt-0.5
                text-[8px]
                sm:mt-1
                sm:text-[9px]
              "
              style={{
                color:
                  "var(--foreground-muted)",
              }}
            >
              Store price: $
              {listing.product.price.toFixed(
                2,
              )}
            </p>
          </div>
        </div>

        <div
          className="
            mt-3
            flex
            justify-end
            gap-1.5
            sm:mt-4
            sm:gap-2
          "
        >
          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              saving
            }
            className="
              h-7
              rounded-md
              border
              px-2.5
              text-[9px]
              font-semibold
              transition
              hover:bg-[var(--surface-hover)]
              disabled:opacity-50
              sm:h-8
              sm:px-3
              sm:text-[10px]
            "
            style={{
              background:
                "var(--surface)",

              color:
                "var(--foreground-muted)",

              borderColor:
                "var(--border)",
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              !canSubmit
            }
            className="
              inline-flex
              h-7
              items-center
              justify-center
              gap-1
              rounded-md
              border
              px-2.5
              text-[9px]
              font-semibold
              transition
              hover:bg-[var(--surface-hover)]
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:h-8
              sm:gap-1.5
              sm:px-3
              sm:text-[10px]
            "
            style={{
              background:
                "var(--surface)",

              color:
                "var(--foreground-muted)",

              borderColor:
                "var(--border)",
            }}
          >
            {saving ? (
              <>
                <Loader2
                  size={11}
                  className="animate-spin sm:hidden"
                />

                <Loader2
                  size={12}
                  className="hidden animate-spin sm:block"
                />

                Creating...
              </>
            ) : (
              "Create Interest"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function BuyerAvatar({
  buyer,
}: {
  buyer: AffiliateTestBuyer;
}) {
  const imageUrl =
    buyer.imageKey
      ? getCloudinaryImageUrl(
          buyer.imageKey,
        )
      : null;

  return (
    <div
      className="
        relative
        flex
        h-7
        w-7
        shrink-0
        items-center
        justify-center
        overflow-hidden
        rounded-full
        bg-[var(--surface)]
        sm:h-8
        sm:w-8
      "
    >
      {imageUrl ? (
        <Image
          src={
            imageUrl
          }
          alt={
            buyer.name
          }
          fill
          sizes="32px"
          className="object-cover"
        />
      ) : (
        <UserRound
          size={13}
          className="text-[var(--foreground-muted)] sm:h-3.5 sm:w-3.5"
        />
      )}
    </div>
  );
}