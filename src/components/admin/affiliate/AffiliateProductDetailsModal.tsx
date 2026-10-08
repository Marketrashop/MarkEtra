"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";

import {
  CalendarDays,
  Check,
  Loader2,
  Mail,
  MessageSquareText,
  Phone,
  Send,
  UserRound,
  X,
  ShoppingBag,
} from "lucide-react";

import { toast } from "sonner";

import type {
  AdminAffiliateInterest,
  AdminAffiliateListing,
} from "@/types/admin-affiliate.types";

import {
  getCloudinaryImageUrl,
} from "@/lib/cloudinary";

import AffiliatePublicationStatusBadge from "./AffiliatePublicationStatusBadge";
import AffiliateCreateInterestDialog from "./AffiliateCreateInterestDialog";

import {
  useRealtime,
} from "@/lib/realtime/affiliate-negotiation-client";

type AffiliateProductDetailsModalProps = {
  listing:
    | AdminAffiliateListing
    | null;

  open: boolean;

  onClose: () => void;
};

export default function AffiliateProductDetailsModal({
  listing,
  open,
  onClose,
}: AffiliateProductDetailsModalProps) {
  const [
    createInterestOpen,
    setCreateInterestOpen,
  ] = useState(false);

  const [
    currentListing,
    setCurrentListing,
  ] =
    useState<AdminAffiliateListing | null>(
      listing,
    );

  const [
    selectedInterestId,
    setSelectedInterestId,
  ] = useState<string | null>(
    null,
  );

  const [
    replyMessage,
    setReplyMessage,
  ] = useState("");

  const [
    replyPrice,
    setReplyPrice,
  ] = useState("");

  const [
    replyLoading,
    setReplyLoading,
  ] = useState(false);

const [
  otherUserTyping,
  setOtherUserTyping,
] = useState(false);

const [
  typingUserName,
  setTypingUserName,
] = useState("");

const [
  liveAffiliateActive,
  setLiveAffiliateActive,
] = useState(false);

const [
  liveAffiliateLastActiveAt,
  setLiveAffiliateLastActiveAt,
] =
  useState<string | null>(null);

const [
  currentTime,
  setCurrentTime,
] = useState(() => Date.now());

const typingTimeoutRef =
  useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

const typingActiveRef =
  useRef(false);

  const [
    transactionLoading,
    setTransactionLoading,
  ] = useState<
    | "payment"
    | "complete"
    | null
  >(null);

  useEffect(() => {
    setCurrentListing(
      listing,
    );

    setSelectedInterestId(
      null,
    );

    setReplyMessage("");
    setReplyPrice("");
  }, [listing]);



useEffect(() => {
  return () => {
    if (
      typingTimeoutRef.current
    ) {
      clearTimeout(
        typingTimeoutRef.current,
      );
    }
  };
}, []);


useEffect(() => {
  if (
    !open ||
    !currentListing?.user.id
  ) {
    return;
  }

const affiliateUserId =
  currentListing.user.id;

  let cancelled = false;

  async function checkAffiliatePresence() {
    try {
      const response = await fetch(
        `/api/admin/affiliate/users/${encodeURIComponent(
          affiliateUserId
        )}/status`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      if (
        cancelled ||
        data.success !== true
      ) {
        return;
      }

      if (
        typeof data.data?.active ===
        "boolean"
      ) {
        setLiveAffiliateActive(
          data.data.active,
        );
      }

      if (
        typeof data.data?.lastActiveAt ===
          "string" ||
        data.data?.lastActiveAt === null
      ) {
        setLiveAffiliateLastActiveAt(
          data.data.lastActiveAt,
        );
      }
    } catch {
      // Presence is non-critical.
    }
  }

  void checkAffiliatePresence();

  const interval =
    window.setInterval(() => {
      void checkAffiliatePresence();
    }, 10_000);

  return () => {
    cancelled = true;
    window.clearInterval(interval);
  };
}, [
  open,
  currentListing?.user.id,
]);


useEffect(() => {
  if (
    !open ||
    liveAffiliateActive
  ) {
    return;
  }

  const interval =
    window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 10_000);

  return () => {
    window.clearInterval(interval);
  };
}, [
  open,
  liveAffiliateActive,
]);

  useRealtime({
    enabled:
      open &&
      Boolean(selectedInterestId),

    channels: selectedInterestId
      ? [
          `affiliate-interest-${selectedInterestId}`,
        ]
      : [],

events: [
  "affiliate.negotiationMessage",
  "affiliate.negotiationTyping",
],

onData({ event, data }) {
  if (
    event ===
    "affiliate.negotiationTyping"
  ) {
    if (
      data.senderType !== "USER"
    ) {
      return;
    }

    setOtherUserTyping(
      data.isTyping,
    );

    setTypingUserName(
      data.senderName,
    );

    return;
  }

  setCurrentListing((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,

          interests:
            current.interests.map(
              (interest) => {
                if (
                  interest.id !==
                  data.interestId
                ) {
                  return interest;
                }

                const alreadyExists =
                  interest.messages.some(
                    (message) =>
                      message.id ===
                      data.id,
                  );

                if (alreadyExists) {
                  return interest;
                }

                return {
                  ...interest,

                  status:
                    data.interestStatus as typeof interest.status,

                  offeredPrice:
                    data.offeredPrice ??
                    interest.offeredPrice,

                  updatedAt:
                    data.createdAt,

                  messages: [
                    ...interest.messages,
                    {
                      id: data.id,
                      interestId:
                        data.interestId,
                      senderUserId:
                        data.senderUserId,
                      message:
                        data.message,
                      offeredPrice:
                        data.offeredPrice,
                      createdAt:
                        data.createdAt,
                      sender: {
                        id:
                          data.senderUserId,
                        firstName:
                          data.senderName,
                        lastName: "",
                        role:
                          data.senderType ===
                          "TEST_BUYER"
                            ? "ADMIN"
                            : "USER",
                      },
                    },
                  ],
                };
              },
            ),
        };
      });
    },
  });

  if (
    !open ||
    !currentListing
  ) {
    return null;
  }

  const primaryImage =
    currentListing.product.images.find(
      (image) =>
        image.isPrimary,
    ) ??
    currentListing.product.images[0] ??
    null;

  const submittedDate =
    currentListing.submittedAt
      ? new Date(
          currentListing.submittedAt,
        ).toLocaleDateString(
          undefined,
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          },
        )
      : "Not submitted";

  const reviewedDate =
    currentListing.reviewedAt
      ? new Date(
          currentListing.reviewedAt,
        ).toLocaleDateString(
          undefined,
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          },
        )
      : "Not reviewed";

  const publishedDate =
    currentListing.publishedAt
      ? new Date(
          currentListing.publishedAt,
        ).toLocaleDateString(
          undefined,
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          },
        )
      : "Not published";

  const planRate =
    Number(
      currentListing.subscription
        .commissionRate,
    );

  const selectedInterest =
    currentListing.interests.find(
      (interest) =>
        interest.id ===
        selectedInterestId,
    ) ?? null;

  function handleInterestCreated(
    interest: AdminAffiliateInterest,
  ) {
    setCurrentListing(
      (current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,

          interests: [
            interest,
            ...current.interests,
          ],
        };
      },
    );

    setCreateInterestOpen(
      false,
    );
  }

  function openInterest(
    interest: AdminAffiliateInterest,
  ) {
    setSelectedInterestId(
      interest.id,
    );

    setReplyMessage("");
    setReplyPrice("");
  }

  function closeInterest() {
    if (replyLoading) {
      return;
    }

    setSelectedInterestId(
      null,
    );

    setReplyMessage("");
    setReplyPrice("");
  }

async function updateTypingStatus(
  isTyping: boolean,
) {
  if (!selectedInterestId) {
    return;
  }

  try {
    await fetch(
      "/api/realtime/affiliate-negotiation/typing",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          interestId:
            selectedInterestId,
          isTyping,
        }),
      },
    );
  } catch {
    // Typing indicators are non-critical.
  }
}

function handleReplyTyping() {
  if (
    !typingActiveRef.current
  ) {
    typingActiveRef.current =
      true;

    void updateTypingStatus(true);
  }

  if (
    typingTimeoutRef.current
  ) {
    clearTimeout(
      typingTimeoutRef.current,
    );
  }

  typingTimeoutRef.current =
    setTimeout(() => {
      typingActiveRef.current =
        false;

      typingTimeoutRef.current =
        null;

      void updateTypingStatus(false);
    }, 1500);
}

function stopTyping() {
  if (
    typingTimeoutRef.current
  ) {
    clearTimeout(
      typingTimeoutRef.current,
    );

    typingTimeoutRef.current =
      null;
  }

  if (
    typingActiveRef.current
  ) {
    typingActiveRef.current =
      false;

    void updateTypingStatus(false);
  }
}

  async function handleBuyerReply(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !selectedInterest
    ) {
      return;
    }

    const message =
      replyMessage.trim();

    if (!message) {
      toast.error(
        "Enter a reply message.",
      );

      return;
    }

    const parsedPrice =
      replyPrice.trim()
        ? Number(
            replyPrice,
          )
        : null;

    if (
      parsedPrice !==
        null &&
      (!Number.isFinite(
        parsedPrice,
      ) ||
        parsedPrice <= 0)
    ) {
      toast.error(
        "Enter a valid proposed price.",
      );

      return;
    }

    try {
      setReplyLoading(
        true,
      );

stopTyping();

      const response =
        await fetch(
          `/api/admin/affiliate/interests/${encodeURIComponent(
            selectedInterest.id,
          )}/negotiate`,
          {
            method: "POST",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              message,

              offeredPrice:
                parsedPrice ??
                undefined,
            }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Unable to send buyer reply.",
        );
      }

      const newMessage =
        data.data;

      setCurrentListing(
        (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,

            interests:
              current.interests.map(
                (interest) =>
                  interest.id ===
                  selectedInterest.id
                    ? {
                        ...interest,

                        status:
                          newMessage
                            .interestStatus,

                        updatedAt:
                          newMessage
                            .createdAt,

messages: interest.messages.some(
  (existingMessage) =>
    existingMessage.id ===
    newMessage.id,
)
  ? interest.messages
  : [
      ...interest.messages,
      {
        id: newMessage.id,
        interestId:
          newMessage.interestId,
        senderUserId:
          newMessage.senderUserId,
        message:
          newMessage.message,
        offeredPrice:
          newMessage.offeredPrice,
        createdAt:
          newMessage.createdAt,
        sender: {
          id:
            newMessage.senderUserId,
          firstName:
            newMessage.senderName,
          lastName: "",
          role: "ADMIN",
        },
      },
    ],
                      }
                    : interest,
              ),
          };
        },
      );

      setReplyMessage("");
      setReplyPrice("");

      toast.success(
        "Buyer reply sent.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to send buyer reply.",
      );
    } finally {
      setReplyLoading(
        false,
      );
    }
  }

  async function handleTransactionAction(
    action:
      | "payment"
      | "complete",
  ) {
    if (
      !selectedInterest ||
      transactionLoading
    ) {
      return;
    }

    const transaction =
      selectedInterest.transaction;

    if (!transaction) {
      toast.error(
        "No transaction exists for this interest.",
      );

      return;
    }

    const endpoint =
      action === "payment"
        ? `/api/admin/affiliate/interests/${encodeURIComponent(
            selectedInterest.id,
          )}/payment`
        : `/api/admin/affiliate/interests/${encodeURIComponent(
            selectedInterest.id,
          )}/complete`;

    try {
      setTransactionLoading(
        action,
      );

      const response =
        await fetch(
          endpoint,
          {
            method: "PATCH",

            credentials:
              "include",
          },
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ??
            (
              action ===
              "payment"
                ? "Unable to confirm payment."
                : "Unable to complete transaction."
            ),
        );
      }

      const updatedTransaction =
        data.data.transaction;

      setCurrentListing(
        (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,

            interests:
              current.interests.map(
                (interest) =>
                  interest.id ===
                  selectedInterest.id
                    ? {
                        ...interest,

                        transaction:
                          updatedTransaction,
                      }
                    : interest,
              ),
          };
        },
      );

      toast.success(
        action === "payment"
          ? "Payment confirmed. Transaction is now in escrow."
          : "Transaction completed successfully.",
      );
    } catch (error) {
      console.error(
        "Affiliate transaction action failed:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : action === "payment"
            ? "Unable to confirm payment."
            : "Unable to complete transaction.",
      );
    } finally {
      setTransactionLoading(
        null,
      );
    }
  }

  return (
    <>
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
  z-[100]
  flex
  items-start
  justify-center
  bg-black/50
  p-2
  pt-3
  backdrop-blur-sm
  sm:items-center
  sm:p-5
"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Affiliate product details"
className="
  flex
  max-h-[88dvh]
  w-full
  max-w-2xl
  flex-col
  overflow-hidden
  rounded-lg
  border
  shadow-2xl
  sm:max-h-[90vh]
  sm:rounded-xl
"
          style={{
            background:
              "var(--surface)",

            borderColor:
              "var(--border)",
          }}
        >
<header
  className="
    flex
    shrink-0
    items-center
    gap-1.5
    border-b
    px-2
    py-2
    sm:gap-3
    sm:px-4
    sm:py-3
  "
  style={{
    borderColor:
      "var(--border)",
  }}
>
  <div
    className="
      min-w-0
      flex-[1.15]
    "
  >
    <p
      className="
        truncate
        text-[7px]
        font-semibold
        uppercase
        tracking-[0.08em]
        sm:text-[9px]
        sm:tracking-[0.1em]
      "
      style={{
        color:
          "var(--foreground-muted)",
      }}
    >
      Affiliate Product
    </p>

    <h2
      className="
        mt-0.5
        truncate
        text-[10px]
        font-bold
        leading-tight
        sm:text-sm
      "
      style={{
        color:
          "var(--foreground)",
      }}
    >
      {
        currentListing
          .product
          .name
      }
    </h2>
  </div>

  <div
    className="
      flex
      shrink-0
      items-center
      gap-0.5
      sm:gap-1.5
    "
  >
    {currentListing
      .publicationStatus ===
      "PUBLISHED" && (
<button
  type="button"
  onClick={() =>
    setCreateInterestOpen(
      true,
    )
  }
  className="
    inline-flex
    h-5
    shrink-0
    items-center
    justify-center
    gap-0.5
    whitespace-nowrap
    rounded-md
    border
    px-1
    text-[6.5px]
    font-semibold
    leading-none
    transition
    hover:bg-[var(--surface)]
    sm:h-7
    sm:gap-1
    sm:px-2
    sm:text-[9px]
  "
  style={{
    background:
      "var(--surface-hover)",
    color:
      "var(--foreground)",
    borderColor:
      "var(--foreground-muted)",
  }}
>
  <ShoppingBag
    size={9}
    className="sm:hidden"
  />

  <ShoppingBag
    size={12}
    className="hidden sm:block"
  />

  Buy
</button>
    )}

    <AffiliatePublicationStatusBadge
      status={
        currentListing
          .publicationStatus
      }
    />

    <button
      type="button"
      onClick={
        onClose
      }
      aria-label="Close"
      className="
        flex
        h-5
        w-5
        shrink-0
        items-center
        justify-center
        rounded-md
        border
        transition
        hover:bg-[var(--surface-hover)]
        sm:h-7
        sm:w-7
      "
      style={{
        borderColor:
          "var(--border)",
        color:
          "var(--foreground-muted)",
      }}
    >
      <X
        size={11}
        className="sm:hidden"
      />

      <X
        size={14}
        className="hidden sm:block"
      />
    </button>
  </div>
</header>

          <div
            className="
              min-h-0
              overflow-y-auto
              p-2.5
              sm:p-4
            "
          >
            <div
              className="
                grid
                gap-2.5
                sm:grid-cols-[120px_minmax(0,1fr)]
                sm:gap-4
              "
            >
              <div
                className="
                  relative
                  aspect-square
                  overflow-hidden
                  rounded-md
                  bg-[var(--surface-hover)]
                  sm:rounded-lg
                "
              >
                {primaryImage ? (
                  <Image
                    src={
                      getCloudinaryImageUrl(
                        primaryImage.imageKey,
                      ) ??
                      "/placeholder.png"
                    }
                    alt={
                      primaryImage.altText ??
                      currentListing
                        .product
                        .name
                    }
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      items-center
                      justify-center
                      text-[8px]
                      sm:text-[9px]
                    "
                    style={{
                      color:
                        "var(--foreground-muted)",
                    }}
                  >
                    No image
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div
                  className="
                    grid
                    grid-cols-3
                    gap-1.5
                    sm:gap-2
                  "
                >
                  <Metric
                    label="Store Price"
                    value={`$${currentListing.product.price.toFixed(
                      2,
                    )}`}
                  />

                  <Metric
                    label="Commission"
                    value={`${planRate.toFixed(
                      2,
                    )}%`}
                  />

                  <Metric
                    label="Sales"
                    value={currentListing.product.totalSales.toLocaleString()}
                  />
                </div>

                <p
                  className="
                    mt-2
                    line-clamp-3
                    text-[9px]
                    leading-3.5
                    sm:mt-3
                    sm:line-clamp-4
                    sm:text-[11px]
                    sm:leading-5
                  "
                  style={{
                    color:
                      "var(--foreground-muted)",
                  }}
                >
                  {
                    currentListing
                      .product
                      .description
                  }
                </p>
              </div>
            </div>

            <div
              className="
                mt-2.5
                grid
                grid-cols-2
                gap-1.5
                sm:mt-4
                sm:gap-2
              "
            >
              <InfoRow
                label="Affiliate"
                value={`${currentListing.user.firstName} ${currentListing.user.lastName}`}
              />

              <InfoRow
                label="Plan"
                value={
                  currentListing
                    .subscription
                    .plan.name
                }
              />

              <InfoRow
                label="Email"
                value={
                  currentListing
                    .user
                    .email
                }
                icon={
                  <Mail
                    size={10}
                    className="sm:h-3 sm:w-3"
                  />
                }
              />

              <InfoRow
                label="Phone"
                value={
                  currentListing
                    .user
                    .phoneNumber
                }
                icon={
                  <Phone
                    size={10}
                    className="sm:h-3 sm:w-3"
                  />
                }
              />

              <InfoRow
                label="Submitted"
                value={
                  submittedDate
                }
                icon={
                  <CalendarDays
                    size={10}
                    className="sm:h-3 sm:w-3"
                  />
                }
              />

              <InfoRow
                label="Reviewed"
                value={
                  reviewedDate
                }
                icon={
                  <Check
                    size={10}
                    className="sm:h-3 sm:w-3"
                  />
                }
              />

              <InfoRow
                label="Published"
                value={
                  publishedDate
                }
                icon={
                  <CalendarDays
                    size={10}
                    className="sm:h-3 sm:w-3"
                  />
                }
              />

              <InfoRow
                label="Interests"
                value={currentListing.interests.length.toString()}
              />
            </div>

            {currentListing.interests.length >
              0 && (
              <div
                className="
                  mt-2.5
                  space-y-1.5
                  sm:mt-4
                  sm:space-y-2
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-2
                    border-b
                    pb-1.5
                    sm:gap-3
                    sm:pb-2
                  "
                  style={{
                    borderColor:
                      "var(--border)",
                  }}
                >
                  <div>
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
                      Buyer Interests
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[8px]
                        sm:text-[10px]
                      "
                      style={{
                        color:
                          "var(--foreground-muted)",
                      }}
                    >
                      Review offers and manage negotiations.
                    </p>
                  </div>

                  <span
                    className="
                      shrink-0
                      rounded-full
                      border
                      px-1.5
                      py-0.5
                      text-[7px]
                      font-semibold
                      sm:px-2
                      sm:text-[8px]
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
                    {
                      currentListing
                        .interests
                        .length
                    }
                  </span>
                </div>

                {currentListing.interests.map(
                  (
                    interest,
                  ) => {
                    const isSelected =
                      selectedInterestId ===
                      interest.id;

                    return (
                      <div
                        key={
                          interest.id
                        }
                        className="
                          rounded-md
                          border
                          p-2
                          sm:rounded-lg
                          sm:p-3
                        "
                        style={{
                          background:
                            "var(--surface-hover)",

                          borderColor:
                            isSelected
                              ? "var(--foreground-muted)"
                              : "var(--border)",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            isSelected
                              ? closeInterest()
                              : openInterest(
                                  interest,
                                )
                          }
                          className="
                            flex
                            w-full
                            items-center
                            gap-2
                            text-left
                            sm:gap-2.5
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
                              overflow-hidden
                              rounded-full
                              bg-[var(--surface)]
                              sm:h-8
                              sm:w-8
                            "
                          >
                            {interest
                              .testBuyer
                              .imageKey ? (
                              <Image
                                src={
                                  getCloudinaryImageUrl(
                                    interest
                                      .testBuyer
                                      .imageKey,
                                    "c_fill,w_80,h_80,f_auto,q_auto",
                                  ) ??
                                  "/placeholder.png"
                                }
                                alt={
                                  interest
                                    .testBuyer
                                    .name
                                }
                                width={
                                  32
                                }
                                height={
                                  32
                                }
                                className="
                                  h-full
                                  w-full
                                  object-cover
                                "
                              />
                            ) : (
                              <UserRound
                                size={11}
                                className="text-[var(--foreground-muted)] sm:h-[13px] sm:w-[13px]"
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div
                              className="
                                flex
                                items-center
                                justify-between
                                gap-1.5
                                sm:gap-2
                              "
                            >
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
                                  interest
                                    .testBuyer
                                    .name
                                }
                              </p>

                              <span
                                className="
                                  shrink-0
                                  rounded-full
                                  border
                                  px-1.5
                                  py-0.5
                                  text-[7px]
                                  font-semibold
                                  sm:px-2
                                  sm:text-[8px]
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
                                {
                                  interest
                                    .status
                                }
                              </span>
                            </div>

                            <p
                              className="
                                mt-0.5
                                text-[8px]
                                sm:text-[9px]
                              "
                              style={{
                                color:
                                  "var(--foreground-muted)",
                              }}
                            >
                              Offer: $
                              {interest.offeredPrice.toFixed(
                                2,
                              )}
                            </p>
                          </div>
                        </button>

{isSelected && (
  <div
    className="
      mt-2
      border-t
      pt-2
      sm:mt-3
      sm:pt-3
    "
    style={{
      borderColor: "var(--border)",
    }}
  >
<div className="mb-2 flex min-w-0 items-center gap-1 sm:mb-2.5 sm:gap-1.5">
  <h3
    className="
      min-w-0
      truncate
      text-[10px]
      font-semibold
      leading-none
      sm:text-[11px]
    "
    style={{
      color: "var(--foreground)",
    }}
  >
    {currentListing.user.firstName}{" "}
    {currentListing.user.lastName}
  </h3>

  <span
    className="
      inline-flex
      shrink-0
      items-center
      gap-1
      whitespace-nowrap
      text-[8px]
      font-medium
      leading-none
      sm:text-[9px]
    "
    style={{
      color: liveAffiliateActive
        ? "#22c55e"
        : "var(--foreground-muted)",
    }}
  >
    <span
      className="h-1.5 w-1.5 shrink-0 rounded-full"
      style={{
        backgroundColor: liveAffiliateActive
          ? "#22c55e"
          : "var(--foreground-muted)",
      }}
    />

    {liveAffiliateActive
      ? "Active"
      : formatOfflineTime(
          liveAffiliateLastActiveAt,
          currentTime,
        )}
  </span>
</div>

    <div
      className="
        space-y-1.5
        sm:space-y-2
      "
    >
                              {interest.messages.length ===
                              0 ? (
                                <p
                                  className="
                                    rounded-md
                                    border
                                    px-2
                                    py-1.5
                                    text-[8px]
                                    sm:px-2.5
                                    sm:py-2
                                    sm:text-[9px]
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
                                  No negotiation messages yet.
                                </p>
                              ) : (
                                interest.messages.map(
                                  (
                                    message,
                                  ) => (
                                    <div
                                      key={
                                        message.id
                                      }
                                      className={`
                                        flex
                                        ${
                                          message.sender.role ===
                                          "ADMIN"
                                            ? "justify-end"
                                            : "justify-start"
                                        }
                                      `}
                                    >
<div
  className="
    max-w-[85%]
    rounded-md
    border
    px-2
    py-1.5
    sm:rounded-lg
    sm:px-2.5
    sm:py-2
  "
  style={{
    background:
      message.sender.role ===
      "ADMIN"
        ? "rgba(59, 130, 246, 0.18)"
        : "rgba(34, 197, 94, 0.18)",

    borderColor:
      message.sender.role ===
      "ADMIN"
        ? "rgba(59, 130, 246, 0.35)"
        : "rgba(34, 197, 94, 0.35)",
  }}
>
  <div
    className="
      flex
      items-center
      justify-between
      gap-2
      sm:gap-3
    "
  >
    <p
      className="
        text-[7px]
        font-semibold
        sm:text-[8px]
      "
      style={{
        color:
          message.sender.role ===
          "ADMIN"
            ? "var(--message-blue)"
            : "var(--message-green)",
      }}
    >
      {message.sender.role ===
      "ADMIN"
        ? interest
            .testBuyer
            .name
        : `${message.sender.firstName} ${message.sender.lastName}`}
    </p>

    <p
      className="
        text-[7px]
        sm:text-[8px]
      "
      style={{
        color:
          message.sender.role ===
          "ADMIN"
            ? "var(--message-blue)"
            : "var(--message-green)",
      }}
    >
      {formatTime(
        message.createdAt,
      )}
    </p>
  </div>

  <p
    className="
      mt-0.5
      text-[9px]
      leading-3.5
      sm:mt-1
      sm:text-[10px]
      sm:leading-4
    "
    style={{
      color:
        "var(--foreground)",
    }}
  >
    {message.message}
  </p>

  {message.offeredPrice !==
    null && (
    <p
      className="
        mt-1
        text-[8px]
        font-semibold
        sm:mt-1.5
        sm:text-[9px]
      "
      style={{
        color:
          message.sender.role ===
          "ADMIN"
            ? "var(--message-blue)"
            : "var(--message-green)",
      }}
    >
      Offered: $
      {message.offeredPrice.toFixed(
        2,
      )}
    </p>
  )}
</div>
                                    </div>
                                  ),
                                )
                              )}
                            </div>

{interest.status !==
  "ACCEPTED" &&
  interest.status !==
    "REJECTED" && (
    <>
{otherUserTyping &&
  isSelected && (
    <div className="mt-5 flex justify-start">
      <div
        className="
          flex
          items-center
          rounded-md
          border
          px-2
          py-1.5
          sm:rounded-lg
          sm:px-2.5
          sm:py-2
        "
        style={{
          background:
            "rgba(34, 197, 94, 0.18)",
          borderColor:
            "rgba(34, 197, 94, 0.35)",
        }}
      >
        <span className="flex items-center gap-0.5">
          <span
            className="
              h-1
              w-1
              animate-bounce
              rounded-full
              bg-[var(--message-green)]
              [animation-delay:-0.3s]
            "
          />
          <span
            className="
              h-1
              w-1
              animate-bounce
              rounded-full
              bg-[var(--message-green)]
              [animation-delay:-0.15s]
            "
          />
          <span
            className="
              h-1
              w-1
              animate-bounce
              rounded-full
              bg-[var(--message-green)]
            "
          />
        </span>
      </div>
    </div>
  )}

      <form
        onSubmit={
          handleBuyerReply
        }
        className="
          mt-2
          space-y-1.5
          sm:mt-3
          sm:space-y-2
        "
      >

                                  <div>
                                    <label
                                      className="
                                        mb-0.5
                                        block
                                        text-[7px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.06em]
                                        sm:mb-1
                                        sm:text-[8px]
                                      "
                                      style={{
                                        color:
                                          "var(--foreground-muted)",
                                      }}
                                    >
                                      Reply as{" "}
                                      {
                                        interest
                                          .testBuyer
                                          .name
                                      }
                                    </label>

                                    <textarea
                                      value={
                                        isSelected
                                          ? replyMessage
                                          : ""
                                      }
onChange={(event) => {
  setReplyMessage(
    event.target.value,
  );

  handleReplyTyping();
}}
                                      placeholder="Write the buyer's reply..."
                                      rows={
                                        2
                                      }
                                      disabled={
                                        replyLoading
                                      }
                                      className="
                                        min-h-[52px]
                                        w-full
                                        resize-none
                                        rounded-md
                                        border
                                        bg-transparent
                                        px-2
                                        py-1.5
                                        text-[9px]
                                        leading-3.5
                                        outline-none
                                        focus:border-[var(--foreground-muted)]
                                        sm:min-h-0
                                        sm:px-2.5
                                        sm:py-2
                                        sm:text-[10px]
                                        sm:leading-4
                                      "
                                      style={{
                                        color:
                                          "var(--foreground)",

                                        borderColor:
                                          "var(--border)",
                                      }}
                                    />
                                  </div>

                                  <div
                                    className="
                                      flex
                                      items-center
                                      gap-1.5
                                      sm:gap-2
                                    "
                                  >
                                    <div
                                      className="
                                        flex
                                        h-7
                                        min-w-0
                                        flex-1
                                        items-center
                                        rounded-md
                                        border
                                        px-2
                                        sm:h-8
                                        sm:px-2.5
                                      "
                                      style={{
                                        background:
                                          "var(--surface)",

                                        borderColor:
                                          "var(--border)",
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
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={
                                          replyPrice
                                        }
                                        onChange={(
                                          event,
                                        ) =>
                                          setReplyPrice(
                                            event
                                              .target
                                              .value,
                                          )
                                        }
                                        placeholder="Optional price"
                                        disabled={
                                          replyLoading
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

                                    <button
                                      type="submit"
                                      disabled={
                                        replyLoading ||
                                        !replyMessage.trim()
                                      }
                                      className="
                                        inline-flex
                                        h-7
                                        shrink-0
                                        items-center
                                        gap-1
                                        rounded-md
                                        border
                                        px-2
                                        text-[8px]
                                        font-semibold
                                        transition
                                        hover:bg-[var(--surface)]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                        sm:h-8
                                        sm:gap-1.5
                                        sm:px-2.5
                                        sm:text-[9px]
                                      "
                                      style={{
                                        background:
                                          "var(--surface-hover)",

                                        color:
                                          "var(--foreground-muted)",

                                        borderColor:
                                          "var(--border)",
                                      }}
                                    >
                                      {replyLoading ? (
                                        <Loader2
                                          size={
                                            11
                                          }
                                          className="animate-spin"
                                        />
                                      ) : (
                                        <Send
                                          size={
                                            11
                                          }
                                        />
                                      )}

                                      Reply
                                    </button>
                                  </div>
      </form>
    </>
  )}

                            {interest.transaction && (
                              <div
                                className="
                                  mt-2
                                  border-t
                                  pt-2
                                  sm:mt-3
                                  sm:pt-3
                                "
                                style={{
                                  borderColor:
                                    "var(--border)",
                                }}
                              >
                                <div
                                  className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-2
                                    sm:gap-3
                                  "
                                >
                                  <div>
                                    <p
                                      className="
                                        text-[7px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.07em]
                                        sm:text-[8px]
                                      "
                                      style={{
                                        color:
                                          "var(--foreground-muted)",
                                      }}
                                    >
                                      Transaction
                                    </p>

                                    <p
                                      className="
                                        mt-0.5
                                        text-[9px]
                                        font-semibold
                                        sm:text-[10px]
                                      "
                                      style={{
                                        color:
                                          "var(--foreground)",
                                      }}
                                    >
                                      $
                                      {interest.transaction.agreedPrice.toFixed(
                                        2,
                                      )}
                                    </p>
                                  </div>

                                  <span
                                    className="
                                      rounded-full
                                      border
                                      px-1.5
                                      py-0.5
                                      text-[7px]
                                      font-semibold
                                      sm:px-2
                                      sm:text-[8px]
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
                                    {formatTransactionStatus(
                                      interest.transaction.status,
                                    )}
                                  </span>
                                </div>

                                <div
                                  className="
                                    mt-1.5
                                    grid
                                    grid-cols-3
                                    gap-1.5
                                    sm:mt-2
                                    sm:gap-2
                                  "
                                >
                                  <TransactionMetric
                                    label="Agreed"
                                    value={`$${interest.transaction.agreedPrice.toFixed(
                                      2,
                                    )}`}
                                  />

                                  <TransactionMetric
                                    label="Rate"
                                    value={`${interest.transaction.commissionRate.toFixed(
                                      2,
                                    )}%`}
                                  />

                                  <TransactionMetric
                                    label="Commission"
                                    value={`$${interest.transaction.commissionAmount.toFixed(
                                      2,
                                    )}`}
                                  />
                                </div>

                                {interest.transaction.status ===
                                  "AWAITING_PAYMENT" && (
                                  <button
                                    type="button"
                                    disabled={
                                      transactionLoading !==
                                      null
                                    }
                                    onClick={() =>
                                      handleTransactionAction(
                                        "payment",
                                      )
                                    }
                                    className="
                                      mt-1.5
                                      inline-flex
                                      h-7
                                      items-center
                                      gap-1
                                      rounded-md
                                      border
                                      px-2
                                      text-[8px]
                                      font-semibold
                                      transition
                                      hover:bg-[var(--surface)]
                                      disabled:cursor-not-allowed
                                      disabled:opacity-50
                                      sm:mt-2
                                      sm:gap-1.5
                                      sm:px-2.5
                                      sm:text-[9px]
                                    "
                                    style={{
                                      background:
                                        "var(--surface-hover)",

                                      color:
                                        "var(--foreground-muted)",

                                      borderColor:
                                        "var(--border)",
                                    }}
                                  >
                                    {transactionLoading ===
                                    "payment" ? (
                                      <Loader2
                                        size={
                                          11
                                        }
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <Check
                                        size={
                                          11
                                        }
                                      />
                                    )}

                                    {transactionLoading ===
                                    "payment"
                                      ? "Confirming..."
                                      : "Confirm Payment"}
                                  </button>
                                )}

                                {interest.transaction.status ===
                                  "IN_ESCROW" && (
                                  <button
                                    type="button"
                                    disabled={
                                      transactionLoading !==
                                      null
                                    }
                                    onClick={() =>
                                      handleTransactionAction(
                                        "complete",
                                      )
                                    }
                                    className="
                                      mt-1.5
                                      inline-flex
                                      h-7
                                      items-center
                                      gap-1
                                      rounded-md
                                      border
                                      px-2
                                      text-[8px]
                                      font-semibold
                                      transition
                                      hover:bg-[var(--surface)]
                                      disabled:cursor-not-allowed
                                      disabled:opacity-50
                                      sm:mt-2
                                      sm:gap-1.5
                                      sm:px-2.5
                                      sm:text-[9px]
                                    "
                                    style={{
                                      background:
                                        "var(--surface-hover)",

                                      color:
                                        "var(--foreground-muted)",

                                      borderColor:
                                        "var(--border)",
                                    }}
                                  >
                                    {transactionLoading ===
                                    "complete" ? (
                                      <Loader2
                                        size={
                                          11
                                        }
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <Check
                                        size={
                                          11
                                        }
                                      />
                                    )}

                                    {transactionLoading ===
                                    "complete"
                                      ? "Completing..."
                                      : "Complete Order"}
                                  </button>
                                )}

                                {interest.transaction.status ===
                                  "COMPLETED" && (
                                  <div
                                    className="
                                      mt-1.5
                                      rounded-md
                                      border
                                      px-2
                                      py-1.5
                                      sm:mt-2
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
                                    <p
                                      className="
                                        text-[8px]
                                        font-semibold
                                        sm:text-[9px]
                                      "
                                      style={{
                                        color:
                                          "var(--foreground)",
                                      }}
                                    >
                                      Commission recorded
                                    </p>

                                    <p
                                      className="
                                        mt-0.5
                                        text-[8px]
                                        leading-3.5
                                        sm:text-[9px]
                                      "
                                      style={{
                                        color:
                                          "var(--foreground-muted)",
                                      }}
                                    >
                                      $
                                      {interest.transaction.commissionAmount.toFixed(
                                        2,
                                      )}{" "}
                                      commission was recorded for
                                      this completed transaction.
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            )}

            {currentListing
              .rejectionReason && (
              <div
                className="
                  mt-2.5
                  rounded-md
                  border
                  px-2.5
                  py-2
                  sm:mt-3
                  sm:rounded-lg
                  sm:px-3
                  sm:py-2.5
                "
                style={{
                  background:
                    "var(--user-badge-danger-bg)",

                  borderColor:
                    "var(--user-badge-danger-bg)",

                  color:
                    "var(--user-badge-danger-text)",
                }}
              >
                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    sm:text-[9px]
                  "
                >
                  Rejection Reason
                </p>

                <p
                  className="
                    mt-0.5
                    text-[9px]
                    leading-4
                    sm:mt-1
                    sm:text-[11px]
                    sm:leading-5
                  "
                >
                  {
                    currentListing
                      .rejectionReason
                  }
                </p>
              </div>
            )}

            <div
              className="
                mt-3
                border-t
                pt-2.5
                sm:mt-4
                sm:pt-3
              "
              style={{
                borderColor:
                  "var(--border)",
              }}
            >
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
                Product
              </p>

              <div
                className="
                  mt-1.5
                  grid
                  grid-cols-2
                  gap-1.5
                  sm:mt-2
                  sm:gap-2
                "
              >
                <InfoRow
                  label="Category"
                  value={
                    currentListing
                      .product
                      .category
                      .name
                  }
                />

                <InfoRow
                  label="Slug"
                  value={
                    currentListing
                      .product
                      .slug
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AffiliateCreateInterestDialog
        listing={
          currentListing
        }
        open={
          createInterestOpen
        }
        onClose={() =>
          setCreateInterestOpen(
            false,
          )
        }
        onCreated={
          handleInterestCreated
        }
      />
    </>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div
      className="
        rounded-md
        border
        px-2
        py-1.5
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
      <p
        className="
          text-[7px]
          font-medium
          uppercase
          tracking-[0.06em]
          sm:text-[8px]
        "
        style={{
          color:
            "var(--foreground-muted)",
        }}
      >
        {label}
      </p>

      <p
        className="
          mt-0.5
          truncate
          text-[10px]
          font-bold
          sm:text-[11px]
        "
        style={{
          color:
            "var(--foreground)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;

  value: string;

  icon?: React.ReactNode;
}) {
  return (
    <div
      className="
        rounded-md
        border
        px-2
        py-1.5
        sm:rounded-lg
        sm:px-2.5
        sm:py-2
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
          items-center
          gap-1
        "
        style={{
          color:
            "var(--foreground-muted)",
        }}
      >
        {icon}

        <span
          className="
            text-[7px]
            font-semibold
            uppercase
            tracking-[0.06em]
            sm:text-[8px]
          "
        >
          {label}
        </span>
      </div>

      <p
        className="
          mt-0.5
          break-words
          text-[9px]
          font-medium
          sm:text-[10px]
        "
        style={{
          color:
            "var(--foreground)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function TransactionMetric({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div
      className="
        rounded-md
        border
        px-1.5
        py-1
        sm:px-2
        sm:py-1.5
      "
      style={{
        background:
          "var(--surface)",

        borderColor:
          "var(--border)",
      }}
    >
      <p
        className="
          text-[6px]
          font-medium
          uppercase
          tracking-[0.05em]
          sm:text-[7px]
        "
        style={{
          color:
            "var(--foreground-muted)",
        }}
      >
        {label}
      </p>

      <p
        className="
          mt-0.5
          truncate
          text-[8px]
          font-semibold
          sm:text-[9px]
        "
        style={{
          color:
            "var(--foreground)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function formatOfflineTime(
  lastActiveAt: string | null,
  now: number,
) {
  if (!lastActiveAt) {
    return "Offline since unknown";
  }

  const lastActive =
    new Date(lastActiveAt).getTime();

  if (!Number.isFinite(lastActive)) {
    return "Offline since unknown";
  }

  const diffSeconds = Math.max(
    0,
    Math.floor(
      (now - lastActive) / 1000,
    ),
  );

  if (diffSeconds < 60) {
    return "Offline since just now";
  }

  const diffMinutes = Math.floor(
    diffSeconds / 60,
  );

  if (diffMinutes < 60) {
    return `Offline since ${diffMinutes} ${
      diffMinutes === 1
        ? "minute"
        : "minutes"
    } ago`;
  }

  const diffHours = Math.floor(
    diffMinutes / 60,
  );

  if (diffHours < 24) {
    return `Offline since ${diffHours} ${
      diffHours === 1
        ? "hour"
        : "hours"
    } ago`;
  }

  const diffDays = Math.floor(
    diffHours / 24,
  );

  return `Offline since ${diffDays} ${
    diffDays === 1
      ? "day"
      : "days"
  } ago`;
}

function formatTransactionStatus(
  status:
    | "AWAITING_PAYMENT"
    | "IN_ESCROW"
    | "COMPLETED"
    | "CANCELLED",
) {
  switch (status) {
    case "AWAITING_PAYMENT":
      return "Awaiting Payment";

    case "IN_ESCROW":
      return "In Escrow";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    default:
      return status;
  }
}

function formatTime(
  value: string,
) {
  return new Date(
    value,
  ).toLocaleString(
    undefined,
    {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  );
}