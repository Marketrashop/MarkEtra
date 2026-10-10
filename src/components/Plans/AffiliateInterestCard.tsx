"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";

import {
  Check,
  Copy,
  Loader2,
  MessageSquareText,
  Phone,
  Send,
  X,
} from "lucide-react";

import { Zap } from "lucide-react";

import { toast } from "sonner";

import {
  getCloudinaryImageUrl,
} from "@/lib/cloudinary";

import { useAuth } from "@/context/AuthContext";

import type {
  AffiliateInterest,
  AffiliateTransactionStatus,
} from "@/types/affiliate.types";

import {
  useRealtime,
} from "@/lib/realtime/affiliate-negotiation-client";

type AffiliateInterestCardProps = {
  interest: AffiliateInterest;

  onAccept?: (
    interest: AffiliateInterest,
  ) => void;

  onReject?: (
    interest: AffiliateInterest,
  ) => void;

  onNegotiate?: (
    interest: AffiliateInterest,
  ) => void;
};

export default function AffiliateInterestCard({
  interest,
  onAccept,
  onReject,
  onNegotiate,
}: AffiliateInterestCardProps) {
  const { user } = useAuth();

  const [
    currentInterest,
    setCurrentInterest,
  ] = useState(interest);

  const [
    actionLoading,
    setActionLoading,
  ] = useState<
    | "accept"
    | "reject"
    | "negotiate"
    | null
  >(null);

  const [
    otherUserTyping,
    setOtherUserTyping,
  ] = useState(false);

  const [
    typingUserName,
    setTypingUserName,
  ] = useState("");

  const [
    negotiateOpen,
    setNegotiateOpen,
  ] = useState(false);

  const [
    actionDialogOpen,
    setActionDialogOpen,
  ] = useState(false);


  const typingTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

  const typingActiveRef =
    useRef(false);

  useRealtime({
    enabled: negotiateOpen,

    channels: [
      `affiliate-interest-${currentInterest.id}`,
    ],

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
          data.senderType !==
          "TEST_BUYER"
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

      setCurrentInterest(
        (previous) => {
          const alreadyExists =
            previous.messages.some(
              (message) =>
                message.id ===
                data.id,
            );

          if (alreadyExists) {
            return previous;
          }

          return {
            ...previous,

            status:
              data.interestStatus as AffiliateInterest[
                "status"
              ],

            offeredPrice:
              data.offeredPrice ??
              previous.offeredPrice,

            updatedAt:
              data.createdAt,

            messages: [
              ...previous.messages,

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
              },
            ],
          };
        },
      );
    },
  });

  const buyer =
    currentInterest.testBuyer;

  const imageUrl =
    buyer.imageKey
      ? getCloudinaryImageUrl(
          buyer.imageKey,
          "c_fill,w_160,h_160,f_auto,q_auto",
        )
      : null;

  const isPending =
    currentInterest.status ===
    "PENDING";

  const isNegotiating =
    currentInterest.status ===
    "NEGOTIATING";

  const isAccepted =
    currentInterest.status ===
    "ACCEPTED";

  const isRejected =
    currentInterest.status ===
    "REJECTED";

  async function updateTypingStatus(
    isTyping: boolean,
  ) {
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
              currentInterest.id,

            isTyping,
          }),
        },
      );
    } catch {

    }
  }

  function handleMessageTyping() {
    if (
      !typingActiveRef.current
    ) {
      typingActiveRef.current =
        true;

      void updateTypingStatus(
        true,
      );
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

        void updateTypingStatus(
          false,
        );
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

      void updateTypingStatus(
        false,
      );
    }
  }

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

  async function handleAccept() {
    if (actionLoading) {
      return;
    }

    try {
      setActionLoading(
        "accept",
      );

      const response =
        await fetch(
          `/api/affiliate/interests/${encodeURIComponent(
            currentInterest.id,
          )}/accept`,
          {
            method: "PATCH",

            credentials:
              "include",
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Unable to accept offer.",
        );
      }

      const updatedInterest: AffiliateInterest =
        {
          ...currentInterest,

          status:
            data.data.status,

          updatedAt:
            data.data.updatedAt,

          offeredPrice:
            data.data.offeredPrice ??
            currentInterest.offeredPrice,

          transaction:
            data.data.transaction
              ? {
                  ...data.data
                    .transaction,

                  agreedPrice:
                    Number(
                      data.data
                        .transaction
                        .agreedPrice,
                    ),

                  commissionRate:
                    Number(
                      data.data
                        .transaction
                        .commissionRate,
                    ),

                  commissionAmount:
                    Number(
                      data.data
                        .transaction
                        .commissionAmount,
                    ),
                }
              : currentInterest.transaction,
        };

      setCurrentInterest(
        updatedInterest,
      );

      onAccept?.(
        updatedInterest,
      );

      toast.success(
        "Offer accepted.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to accept offer.",
      );
    } finally {
      setActionLoading(
        null,
      );
    }
  }

  async function handleReject() {
    if (actionLoading) {
      return;
    }

    try {
      setActionLoading(
        "reject",
      );

      const response =
        await fetch(
          `/api/affiliate/interests/${encodeURIComponent(
            currentInterest.id,
          )}/reject`,
          {
            method: "PATCH",

            credentials:
              "include",
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Unable to reject offer.",
        );
      }

      const updatedInterest: AffiliateInterest =
        {
          ...currentInterest,

          status:
            data.data.status,

          updatedAt:
            data.data.updatedAt,
        };

      setCurrentInterest(
        updatedInterest,
      );

      onReject?.(
        updatedInterest,
      );

      toast.success(
        "Offer rejected.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to reject offer.",
      );
    } finally {
      setActionLoading(
        null,
      );
    }
  }

  async function handleAcceptNegotiation() {
    await handleAccept();

    setActionDialogOpen(
      false,
    );

    setNegotiateOpen(
      false,
    );
  }

  async function handleCloseNegotiation() {
    await handleReject();

    setActionDialogOpen(
      false,
    );

    setNegotiateOpen(
      false,
    );
  }

async function handleNegotiate(
  message: string,
  offeredPrice: number | null,
) {
  if (actionLoading) {
    return false;
  }

    try {
      setActionLoading(
        "negotiate",
      );

      const response =
        await fetch(
          `/api/affiliate/interests/${encodeURIComponent(
            currentInterest.id,
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
                offeredPrice ??
                undefined,
            }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Unable to send negotiation message.",
        );
      }

      const newMessage =
        data.data?.message;

      const updatedInterest: AffiliateInterest =
        {
          ...currentInterest,

          status:
            data.data.status,

          updatedAt:
            newMessage?.createdAt ??
            currentInterest.updatedAt,

          offeredPrice:
            offeredPrice ??
            currentInterest.offeredPrice,

          messages:
            newMessage
              ? [
                  ...currentInterest.messages,
                  newMessage,
                ]
              : currentInterest.messages,
        };

setCurrentInterest(
  updatedInterest,
);

onNegotiate?.(
  updatedInterest,
);

toast.success(
  "Negotiation message sent.",
);

return true;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to send negotiation message.",
      );

      return false;
    } finally {
      setActionLoading(
        null,
      );
    }
  }

  return (
    <>
      <article
        className="
          overflow-hidden
          rounded-lg
          border
          sm:rounded-xl
        "
        style={{
          background:
            "var(--user-card-bg)",

          borderColor:
            "var(--user-card-border)",

          boxShadow:
            "var(--user-card-shadow)",
        }}
      >
        <div
          className="
            flex
            items-start
            gap-2.5
            p-2.5
            sm:gap-3
            sm:p-3
          "
        >
          <div
            className="
              relative
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-full
              bg-[var(--user-surface-secondary)]
              sm:h-10
              sm:w-10
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
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <div
                className="
                  flex
                  h-full
                  w-full
                  items-center
                  justify-center
                  text-[10px]
                  font-semibold
                "
                style={{
                  color:
                    "var(--user-text-muted)",
                }}
              >
                {buyer.name
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div
              className="
                flex
                items-start
                justify-between
                gap-2
              "
            >
              <div className="min-w-0">
                <h3
                  className="
                    truncate
                    text-[11px]
                    font-semibold
                    sm:text-xs
                  "
                  style={{
                    color:
                      "var(--user-title)",
                  }}
                >
                  {buyer.name}
                </h3>

                <p
                  className="
                    mt-0.5
                    flex
                    items-center
                    gap-1
                    truncate
                    text-[9px]
                    sm:text-[10px]
                  "
                  style={{
                    color:
                      "var(--user-text-muted)",
                  }}
                >
                  <Phone
                    size={10}
                  />

                  {buyer.phone}
                </p>
              </div>

              <InterestStatusBadge
                status={
                  currentInterest.status
                }
              />
            </div>

            {buyer.email && (
              <p
                className="
                  mt-1
                  truncate
                  text-[9px]
                  sm:text-[10px]
                "
                style={{
                  color:
                    "var(--user-text-muted)",
                }}
              >
                {buyer.email}
              </p>
            )}
          </div>
        </div>

        <div
          className="
            border-t
            px-2.5
            py-2
            sm:px-3
            sm:py-2.5
          "
          style={{
            borderColor:
              "var(--user-divider)",
          }}
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <div>
              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.07em]
                "
                style={{
                  color:
                    "var(--user-text-muted)",
                }}
              >
                {currentInterest.transaction
                  ? "Agreed Price"
                  : "Buyer Offer"}
              </p>

              <p
                className="
                  mt-0.5
                  text-[13px]
                  font-bold
                  sm:text-sm
                "
                style={{
                  color:
                    "var(--user-title)",
                }}
              >
                $
                {(
                  currentInterest
                    .transaction
                    ?.agreedPrice ??
                  currentInterest.offeredPrice
                ).toFixed(2)}
              </p>
            </div>

            <p
              className="
                text-[9px]
                sm:text-[10px]
              "
              style={{
                color:
                  "var(--user-text-muted)",
              }}
            >
              {formatDate(
                currentInterest.createdAt,
              )}
            </p>
          </div>

          {isPending && (
            <div
              className="
                mt-2.5
                flex
                flex-wrap
                gap-1.5
                sm:mt-3
              "
            >
              <InterestAction
                label="Accept Offer"
                icon={
                  <Check
                    size={12}
                  />
                }
                loading={
                  actionLoading ===
                  "accept"
                }
                onClick={
                  handleAccept
                }
              />

              <InterestAction
                label="Negotiate"
                icon={
                  <MessageSquareText
                    size={12}
                  />
                }
                loading={
                  actionLoading ===
                  "negotiate"
                }
                onClick={() =>
                  setNegotiateOpen(
                    true,
                  )
                }
              />

              <InterestAction
                label="Reject"
                icon={
                  <X
                    size={12}
                  />
                }
                loading={
                  actionLoading ===
                  "reject"
                }
                onClick={
                  handleReject
                }
              />
            </div>
          )}

          {isNegotiating && (
            <div
              className="
                mt-2
                space-y-2
              "
            >
              <p
                className="
                  text-[9px]
                  leading-4
                  sm:text-[10px]
                "
                style={{
                  color:
                    "var(--user-text-muted)",
                }}
              >
                Negotiation is in
                progress.
              </p>

              <InterestAction
                label="Continue Negotiation"
                icon={
                  <MessageSquareText
                    size={12}
                  />
                }
                loading={
                  actionLoading ===
                  "negotiate"
                }
                onClick={() =>
                  setNegotiateOpen(
                    true,
                  )
                }
              />
            </div>
          )}

          {isAccepted &&
            currentInterest.transaction && (
              <TransactionSummary
                status={
                  currentInterest
                    .transaction
                    .status
                }
                agreedPrice={
                  currentInterest
                    .transaction
                    .agreedPrice
                }
                commissionRate={
                  currentInterest
                    .transaction
                    .commissionRate
                }
                commissionAmount={
                  currentInterest
                    .transaction
                    .commissionAmount
                }
              />
            )}

          {isRejected && (
            <div
              className="
                mt-2
                rounded-lg
                border
                px-2.5
                py-2
                sm:mt-3
              "
              style={{
                background:
                  "var(--user-surface-secondary)",

                borderColor:
                  "var(--user-divider)",
              }}
            >
              <p
                className="
                  text-[9px]
                  font-semibold
                  sm:text-[10px]
                "
                style={{
                  color:
                    "var(--user-title)",
                }}
              >
                Offer rejected
              </p>

              <p
                className="
                  mt-0.5
                  text-[9px]
                  leading-4
                  sm:text-[10px]
                "
                style={{
                  color:
                    "var(--user-text-muted)",
                }}
              >
                This buyer offer is no longer
                active.
              </p>
            </div>
          )}
        </div>
      </article>

<NegotiationDialog
  open={negotiateOpen}
  buyerName={buyer.name}
  buyerImageUrl={imageUrl}
  buyerPhone={buyer.phone}
  buyerEmail={buyer.email}
  buyerActive={buyer.active}
  buyerLastActiveAt={buyer.lastActiveAt}
  currentOffer={currentInterest.offeredPrice}
  messages={
    currentInterest.messages
  }
  currentUserId={
    user?.id ??
    null
  }
  loading={
    actionLoading ===
    "negotiate"
  }
  otherUserTyping={
    otherUserTyping
  }
  typingUserName={
    typingUserName
  }
  onClose={() => {
    stopTyping();
    setOtherUserTyping(false);
    setTypingUserName("");
    setNegotiateOpen(false);
  }}
onAction={() =>
  setActionDialogOpen(
    true,
  )
}
onTyping={
  handleMessageTyping
}
onStopTyping={
  stopTyping
}
onSubmit={
  handleNegotiate
}
      />

      {actionDialogOpen && (
        <FinalNegotiationActionDialog
          buyerName={
            buyer.name
          }
          loadingAction={
            actionLoading ===
            "accept"
              ? "accept"
              : actionLoading ===
                  "reject"
                ? "reject"
                : null
          }
          onClose={() =>
            setActionDialogOpen(
              false,
            )
          }
          onAccept={
            handleAcceptNegotiation
          }
          onReject={
            handleCloseNegotiation
          }
        />
      )}
    </>
  );
}

function getTransactionStatusStyle(
  status: AffiliateTransactionStatus,
) {
  switch (status) {
    case "AWAITING_PAYMENT":
      return {
        background: "#FEF3C7",
        color: "#D97706",
        borderColor: "#FCD34D",
      };

    case "IN_ESCROW":
      return {
        background: "#DBEAFE",
        color: "#2563EB",
        borderColor: "#93C5FD",
      };

    case "COMPLETED":
      return {
        background: "#DCFCE7",
        color: "#16A34A",
        borderColor: "#86EFAC",
      };

    case "CANCELLED":
      return {
        background: "#FEE2E2",
        color: "#DC2626",
        borderColor: "#FCA5A5",
      };

    default:
      return {
        background: "var(--user-card-bg)",
        color: "var(--user-text-muted)",
        borderColor: "var(--user-card-border)",
      };
  }
}

function TransactionSummary({
  status,
  agreedPrice,
  commissionRate,
  commissionAmount,
}: {
  status: AffiliateTransactionStatus;
  agreedPrice: number;
  commissionRate: number;
  commissionAmount: number;
}) {
  const statusStyle =
    getTransactionStatusStyle(status);

  return (
    <div
      className="
        mt-2.5
        rounded-lg
        border
        px-2.5
        py-2
        sm:mt-3
        sm:py-2.5
      "
      style={{
        background:
          "var(--user-surface-secondary)",

        borderColor:
          "var(--user-divider)",
      }}
    >
      <div
        className="
          grid
          grid-cols-3
          gap-2
        "
      >
        <TransactionMetric
          label="Agreed"
          value={`$${agreedPrice.toFixed(2)}`}
        />

        <TransactionMetric
          label="Rate"
          value={`${commissionRate.toFixed(2)}%`}
        />

        <TransactionMetric
          label="Commission"
          value={`$${commissionAmount.toFixed(2)}`}
        />
      </div>

      <div
        className="
          mt-2
          flex
          items-center
          justify-between
          gap-2
        "
      >
        <span
          className="
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.06em]
          "
          style={{
            color:
              "var(--user-text-muted)",
          }}
        >
          Transaction
        </span>

        <span
          className="
            rounded-full
            border
            px-2
            py-0.5
            text-[8px]
            font-semibold
          "
          style={statusStyle}
        >
          {formatTransactionStatus(
            status,
          )}
        </span>
      </div>
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
    <div className="min-w-0">
      <p
        className="
          truncate
          text-[8px]
          uppercase
          tracking-[0.05em]
        "
        style={{
          color:
            "var(--user-text-muted)",
        }}
      >
        {label}
      </p>

      <p
        className="
          mt-0.5
          truncate
          text-[10px]
          font-semibold
        "
        style={{
          color:
            "var(--user-title)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function formatTransactionStatus(
  status: AffiliateTransactionStatus,
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

type InterestActionProps = {
  label: string;

  icon: React.ReactNode;

  onClick: () => void;

  loading?: boolean;
};

function InterestAction({
  label,
  icon,
  onClick,
  loading = false,
}: InterestActionProps) {
  return (
    <button
      type="button"
      disabled={
        loading
      }
      onClick={
        onClick
      }
      className="
        inline-flex
        h-7
        items-center
        gap-1.5
        rounded-md
        border
        px-2.5
        text-[9px]
        font-semibold
        transition
        hover:bg-[var(--user-surface-secondary)]
        disabled:cursor-not-allowed
        disabled:opacity-60
        sm:h-8
        sm:px-3
        sm:text-[10px]
      "
      style={{
        background:
          "var(--user-card-bg)",

        color:
          "var(--user-text-muted)",

        borderColor:
          "var(--user-card-border)",
      }}
    >
      {loading ? (
        <Loader2
          size={12}
          className="animate-spin"
        />
      ) : (
        icon
      )}

      {loading
        ? "Working..."
        : label}
    </button>
  );
}

function InterestStatusBadge({
  status,
}: {
  status:
    | "PENDING"
    | "NEGOTIATING"
    | "ACCEPTED"
    | "REJECTED";
}) {
  return (
    <span
      className="
        shrink-0
        rounded-full
        border
        px-2
        py-0.5
        text-[8px]
        font-semibold
        sm:text-[9px]
      "
      style={{
        background:
          "var(--user-card-bg)",

        color:
          "var(--user-text-muted)",

        borderColor:
          "var(--user-card-border)",
      }}
    >
      {status}
    </span>
  );
}

type NegotiationDialogProps = {
  open: boolean;
  buyerName: string;
  buyerImageUrl: string | null;
  buyerPhone: string;
  buyerEmail: string | null;
  buyerActive: boolean;
  buyerLastActiveAt: string | null;
  currentOffer: number;
  messages: AffiliateInterest["messages"];
  currentUserId: string | null;
  loading: boolean;
  otherUserTyping: boolean;
  typingUserName: string;
  onClose: () => void;
  onAction: () => void;
  onTyping: () => void;
  onStopTyping: () => void;
  onSubmit: (
  message: string,
  offeredPrice: number | null,
) => Promise<boolean>;
};

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

function NegotiationDialog({
  open,
  buyerName,
  buyerImageUrl,
  buyerPhone,
  buyerEmail,
  buyerActive,
  buyerLastActiveAt,
  currentOffer,
  messages,
  currentUserId,
  loading,
  otherUserTyping,
  typingUserName,
  onClose,
  onAction,
  onTyping,
  onStopTyping,
  onSubmit,
}: NegotiationDialogProps) {
const [
  liveBuyerActive,
  setLiveBuyerActive,
] = useState(buyerActive);

const [
  message,
  setMessage,
] = useState("");

const [
  proposedPrice,
  setProposedPrice,
] = useState("");

const messageInputRef =
  useRef<HTMLTextAreaElement | null>(
    null,
  );

const [
  liveLastActiveAt,
  setLiveLastActiveAt,
] = useState(
  buyerLastActiveAt,
);

const messagesEndRef = useRef<HTMLDivElement>(null);

const [
  currentTime,
  setCurrentTime,
] = useState(() =>
  Date.now(),
);

const [buyerDetailsOpen, setBuyerDetailsOpen] =
  useState(false);

useEffect(() => {
  if (!buyerDetailsOpen) {
    return;
  }

  const handleOutsideClick = (
    event: MouseEvent,
  ) => {
    const target = event.target as Node;

    if (
      !(target instanceof Element)
    ) {
      return;
    }

    const detailsElement =
      document.getElementById(
        "buyer-details-popover",
      );

    if (
      detailsElement &&
      !detailsElement.contains(target)
    ) {
      setBuyerDetailsOpen(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleOutsideClick,
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleOutsideClick,
    );
  };
}, [buyerDetailsOpen]);

const copyBuyerDetail = async (
  value: string,
  label: string,
) => {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  } catch {
    toast.error(
      `Could not copy ${label.toLowerCase()}`,
    );
  }
};

useEffect(() => {
  if (!open) {
    return;
  }

  let cancelled = false;

  async function checkBuyerPresence() {
    try {
      const response = await fetch(
        "/api/affiliate/test-buyer-status",
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
        setLiveBuyerActive(
          data.data.active,
        );
      }

      if (
        typeof data.data?.lastActiveAt ===
        "string" ||
        data.data?.lastActiveAt === null
      ) {
        setLiveLastActiveAt(
          data.data.lastActiveAt,
        );
      }
    } catch {

    }
  }

  void checkBuyerPresence();

  const interval =
    window.setInterval(
      () => {
        void checkBuyerPresence();
      },
      5_000,
    );

  return () => {
    cancelled = true;
    window.clearInterval(interval);
  };
}, [open]);


useEffect(() => {
  if (!open || liveBuyerActive) {
    return;
  }

  const interval =
    window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 10_000);

  return () => {
    window.clearInterval(interval);
  };
}, [open, liveBuyerActive]);


useEffect(() => {
  if (!open) {
    return;
  }

  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
}, [
  open,
  messages.length,
  otherUserTyping,
]);


if (!open) {
  return null;
}

  if (!open) {
    return null;
  }

  const hasMessages =
    messages.length > 0;

async function handleSubmit(
  event: React.FormEvent<HTMLFormElement>,
) {
    event.preventDefault();

    const trimmedMessage =
      message.trim();

    if (!trimmedMessage) {
      toast.error(
        "Enter a negotiation message.",
      );

      return;
    }

    const parsedPrice =
      proposedPrice.trim()
        ? Number(
            proposedPrice,
          )
        : null;

    if (
      parsedPrice !== null &&
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
onStopTyping();

const succeeded =
  await onSubmit(
    trimmedMessage,
    parsedPrice,
  );

if (succeeded) {
  setMessage("");

  const textarea =
    messageInputRef.current;

  if (textarea) {
    textarea.style.height = "";
    textarea.style.overflowY = "hidden";
  }
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
  z-[150]
  flex
  items-center
  justify-center
  bg-black/45
  p-0
  backdrop-blur-sm
  sm:p-4
"

>
  <form
    role="dialog"
    aria-modal="true"
    aria-label="Negotiate buyer offer"
    onSubmit={handleSubmit}
    className="
      flex
      h-[100dvh]
      max-h-[100dvh]
      w-full
      max-w-sm
      flex-col
      overflow-hidden
      rounded-lg
      border
      shadow-2xl
      sm:h-[min(100vh,720px)]
      sm:max-h-[100dvh]
      sm:rounded-xl
    "

        style={{
          background:
            "var(--user-card-bg)",

          borderColor:
            "var(--user-card-border)",
        }}
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            border-b
            px-3
            py-2.5
            sm:px-4
            sm:py-3
          "
          style={{
            borderColor:
              "var(--user-divider)",
          }}
        >
<div className="relative flex min-w-0 items-center gap-2">


  <button
    type="button"
    onClick={() =>
      setBuyerDetailsOpen(
        (previous) => !previous,
      )
    }
className="
  relative
  h-8
  w-8
  shrink-0
  overflow-hidden
  rounded-full
  border-[2.5px]
  border-white/20
  bg-[var(--user-surface-secondary)]
  p-0.5
  sm:h-9
  sm:w-9
"
    aria-label={`View ${buyerName}'s details`}
  >
    {buyerImageUrl ? (
<Image
  src={buyerImageUrl}
  alt={buyerName}
  fill
  sizes="40px"
  className="rounded-full object-cover"
/>
    ) : (
      <div
        className="
          flex
          h-full
          w-full
          items-center
          justify-center
          text-[9px]
          font-semibold
        "
        style={{
          color: "var(--user-text-muted)",
        }}
      >
        {buyerName.charAt(0).toUpperCase()}
      </div>
    )}
  </button>

{buyerDetailsOpen && (
  <div
    id="buyer-details-popover"
className="
  absolute
  left-0
  top-full
  z-30
  mt-2
  w-52
  animate-[buyer-details-in_180ms_ease-out]
  rounded-lg
  border
  p-2.5
  shadow-xl
"
    style={{
      background:
        "var(--user-card-bg)",
      borderColor:
        "var(--user-card-border)",
    }}
  >
    <div
      className="
        flex
        items-center
        justify-between
        gap-2
        border-b
        pb-2
      "
      style={{
        borderColor:
          "var(--user-divider)",
      }}
    >
      <p
        className="
          text-[8px]
          font-semibold
          uppercase
          tracking-[0.08em]
        "
        style={{
          color:
            "var(--user-text-muted)",
        }}
      >
        Buyer details
      </p>

      <button
        type="button"
        onClick={() =>
          setBuyerDetailsOpen(false)
        }
        className="
          flex
          h-5
          w-5
          items-center
          justify-center
          rounded
          transition-opacity
          hover:opacity-70
        "
        style={{
          color:
            "var(--user-text-muted)",
        }}
        aria-label="Close buyer details"
      >
        <X
          size={11}
          strokeWidth={2}
        />
      </button>
    </div>

    <div className="mt-2.5 space-y-2.5">
      <div>
        <p
          className="text-[8px]"
          style={{
            color:
              "var(--user-text-muted)",
          }}
        >
          Name
        </p>

        <p
          className="
            mt-0.5
            truncate
            text-[10px]
            font-semibold
          "
          style={{
            color:
              "var(--user-title)",
          }}
        >
          {buyerName}
        </p>
      </div>

      <div>
        <p
          className="text-[8px]"
          style={{
            color:
              "var(--user-text-muted)",
          }}
        >
          Phone
        </p>

        <div className="mt-0.5 flex items-center gap-1">
          <p
            className="
              min-w-0
              flex-1
              truncate
              text-[10px]
              font-semibold
            "
            style={{
              color:
                "var(--user-title)",
            }}
          >
            {buyerPhone}
          </p>

          <button
            type="button"
            onClick={() =>
              copyBuyerDetail(
                buyerPhone,
                "Phone",
              )
            }
            className="
              flex
              h-5
              w-5
              shrink-0
              items-center
              justify-center
              rounded
              transition-opacity
              hover:opacity-70
            "
            style={{
              color:
                "var(--user-text-muted)",
            }}
            aria-label="Copy phone number"
          >
            <Copy
              size={10}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      {buyerEmail && (
        <div>
          <p
            className="text-[8px]"
            style={{
              color:
                "var(--user-text-muted)",
            }}
          >
            Email
          </p>

          <div className="mt-0.5 flex items-center gap-1">
            <p
              className="
                min-w-0
                flex-1
                truncate
                text-[10px]
                font-semibold
              "
              style={{
                color:
                  "var(--user-title)",
              }}
            >
              {buyerEmail}
            </p>

            <button
              type="button"
              onClick={() =>
                copyBuyerDetail(
                  buyerEmail,
                  "Email",
                )
              }
              className="
                flex
                h-5
                w-5
                shrink-0
                items-center
                justify-center
                rounded
                transition-opacity
                hover:opacity-70
              "
              style={{
                color:
                  "var(--user-text-muted)",
              }}
              aria-label="Copy email address"
            >
              <Copy
                size={10}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
)}

<div className="min-w-0">
  <p
    className="
      truncate
      text-[8px]
      font-semibold
      uppercase
      tracking-[0.08em]
      sm:text-[9px]
    "
    style={{
      color: "var(--user-text-muted)",
    }}
  >
    Negotiation
  </p>

  <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
    <h2
      className="
        min-w-0
        truncate
        text-[11px]
        font-bold
        leading-tight
        sm:text-sm
      "
      style={{
        color: "var(--user-title)",
      }}
    >
      {buyerName}
    </h2>

<span
  className="
    inline-flex
    shrink-0
    items-center
    gap-1
    text-[8px]
    font-medium
    leading-none
    sm:text-[9px]
  "
  style={{
    color: liveBuyerActive
      ? "#22c55e"
      : "var(--user-text-muted)",
  }}
>
  <span
    className="h-1.5 w-1.5 rounded-full"
    style={{
      backgroundColor: liveBuyerActive
        ? "#22c55e"
        : "var(--user-text-muted)",
    }}
  />
{liveBuyerActive
  ? "Active"
  : formatOfflineTime(
      liveLastActiveAt,
      currentTime,
    )}
</span>
  </div>
</div>
</div>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              loading
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
              hover:bg-[var(--user-surface-secondary)]
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:h-7
              sm:w-7
            "
            style={{
              background:
                "var(--user-card-bg)",

              color:
                "var(--user-text-muted)",

              borderColor:
                "var(--user-card-border)",
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
    flex
    min-h-0
    flex-1
    flex-col
    overflow-hidden
    p-2.5
    sm:p-3
  "
>
<div
  className="
    flex
    min-h-0
    flex-1
    flex-col
    overflow-hidden
    rounded-lg
    border
  "
  style={{
    background:
      "var(--user-surface-secondary)",

    borderColor:
      "var(--user-divider)",
  }}
>
<div
  className="
    min-h-0
    flex-1
    space-y-1.5
    overflow-y-auto
    p-2
    sm:space-y-2
    sm:p-2.5
  "
>
{!hasMessages ? (
<div
  className="
    flex
    min-h-[64px]
    items-center
    justify-center
    px-1
    py-2
    sm:min-h-[68px]
  "
>
  <div
    className="
      w-full
      rounded-xl
      border
      px-3
      py-2.5
      sm:px-3.5
      sm:py-3
    "
    style={{
      borderColor:
        "color-mix(in srgb, var(--user-text-muted) 14%, transparent)",
      background:
        "color-mix(in srgb, var(--user-text) 2.5%, transparent)",
    }}
  >
    <div className="flex items-start gap-2.5">
      {/* Icon */}
      <span
        className="
          mt-0.5
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          rounded-full
        "
        style={{
          color: "var(--user-title)",
          background:
            "color-mix(in srgb, var(--user-title) 8%, transparent)",
          border:
            "1px solid color-mix(in srgb, var(--user-title) 10%, transparent)",
        }}
        aria-hidden="true"
      >
        <Zap
          className="h-3 w-3"
          strokeWidth={1.8}
        />
      </span>

      <div className="min-w-0">
        <p
          className="
            text-[10px]
            font-semibold
            leading-4
            tracking-[-0.01em]
            sm:text-[11px]
          "
          style={{
            color: "var(--user-title)",
          }}
        >
          Faster negotiation may be possible offline.
        </p>

        <p
          className="
            mt-0.5
            text-[9px]
            leading-[14px]
            sm:text-[10px]
            sm:leading-4
          "
          style={{
            color: "var(--user-text-muted)",
          }}
        >
  You can negotiate right here in the chat. However, if you'd like a faster
  response, you can always contact{" "}
  <strong style={{ color: "var(--user-text)", fontWeight: 600 }}>
    {buyerName}
  </strong>{" "}
  directly by tapping their profile picture at the top left to view their
  contact details.
</p>
      </div>
    </div>
  </div>
</div>
              ) : (
                messages.map((item) => {
                    const isMine =
                      item.senderUserId ===
                      currentUserId;

return (
  <div
    key={item.id}
    className={`
      flex
      items-end
      gap-1.5
      sm:gap-2
      ${isMine ? "justify-end" : "justify-start"}
    `}
  >
    {!isMine && (
      <div
        className="
          relative
          h-5
          w-5
          shrink-0
          overflow-hidden
          rounded-full
          bg-[var(--user-surface-secondary)]
          sm:h-6
          sm:w-6
        "
      >
        {buyerImageUrl ? (
          <Image
            src={buyerImageUrl}
            alt={buyerName}
            fill
            sizes="24px"
            className="object-cover"
          />
        ) : (
          <div
            className="
              flex
              h-full
              w-full
              items-center
              justify-center
              text-[7px]
              font-semibold
              sm:text-[8px]
            "
            style={{
              color: "var(--user-text-muted)",
            }}
          >
            {buyerName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    )}

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
                              isMine
                                ? "rgba(59, 130, 246, 0.18)"
                                : "rgba(34, 197, 94, 0.18)",

                            borderColor:
                              isMine
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
                                  isMine
                                    ? "var(--message-blue)"
                                    : "var(--message-green)",
                              }}
                            >
                              {isMine ? "You" : buyerName}
                            </p>

                            <p
                              className="
                                text-[7px]
                                sm:text-[8px]
                              "
                              style={{
                                color:
                                  isMine
                                    ? "var(--message-blue)"
                                    : "var(--message-green)",
                              }}
                            >
                              {formatDateTime(
                                item.createdAt,
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
                                "var(--user-title)",
                            }}
                          >
                            {
                              item.message
                            }
                          </p>

                          {item.offeredPrice !==
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
                                  isMine
                                    ? "var(--message-blue)"
                                    : "var(--message-green)",
                              }}
                            >
                              Offered: $
                              {item.offeredPrice.toFixed(
                                2,
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  },
                )
            )}

{otherUserTyping && hasMessages && (
  <div className="flex justify-end">
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
          "rgba(59, 130, 246, 0.18)",
        borderColor:
          "rgba(59, 130, 246, 0.35)",
      }}
    >
      <span
        className="
          inline-flex
          items-center
          gap-0.5
        "
        aria-hidden="true"
      >
        <span
          className="
            h-1
            w-1
            animate-bounce
            rounded-full
            bg-[var(--message-blue)]
            [animation-delay:-0.3s]
          "
        />

        <span
          className="
            h-1
            w-1
            animate-bounce
            rounded-full
            bg-[var(--message-blue)]
            [animation-delay:-0.15s]
          "
        />

        <span
          className="
            h-1
            w-1
            animate-bounce
            rounded-full
            bg-[var(--message-blue)]
          "
        />
      </span>
    </div>
  </div>
)}

            <div ref={messagesEndRef} />
          </div>

            <div
              className="
                border-t
                p-1.5
                sm:p-2
              "
              style={{
                borderColor:
                  "var(--user-divider)",
              }}
            >

<div
  className="
    flex
    min-h-7
    items-center
    gap-1
    rounded-full
    border
    px-1
    py-0.5
    sm:min-h-7
    sm:gap-1.5
    sm:px-1.5
    sm:py-0
  "
  style={{
    background:
      "var(--user-card-bg)",

    borderColor:
      "var(--user-card-border)",
  }}
>
<textarea
  ref={
    messageInputRef
  }
  id="affiliate-negotiation-message"
  value={
    message
  }
  onChange={(
    event,
  ) => {
    const value =
      event.target.value;

    setMessage(
      value,
    );

    onTyping();

    const textarea =
      event.target;

    textarea.style.height =
      "0px";

    const maxHeight =
      window.innerWidth >=
      640
        ? 84
        : 60;

    const nextHeight =
      Math.min(
        textarea.scrollHeight,
        maxHeight,
      );

    textarea.style.height =
      `${nextHeight}px`;

    textarea.style.overflowY =
      textarea.scrollHeight >
      maxHeight
        ? "auto"
        : "hidden";
  }}
  placeholder={
    hasMessages
      ? "Write a reply..."
      : "Write a professional message..."
  }
  rows={1}
  disabled={
    loading
  }
  className="
    min-h-6
    flex-1
    resize-none
    overflow-hidden
    bg-transparent
    px-2
    py-0.5
    text-[9px]
    leading-4
    outline-none
    placeholder:text-[var(--user-text-muted)]
    disabled:opacity-60
    sm:min-h-8
    sm:px-2.5
    sm:py-1.5
    sm:text-[10px]
  "
  style={{
    color:
      "var(--user-title)",
  }}
/>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !message.trim()
                  }
                  aria-label={
                    loading
                      ? "Sending reply"
                      : hasMessages
                        ? "Send reply"
                        : "Send message"
                  }
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    transition
                    hover:bg-[var(--user-surface-secondary)]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    sm:h-8
                    sm:w-8
                  "
                  style={{
                    background:
                      "var(--user-surface-secondary)",

                    color:
                      "var(--user-text-muted)",

                    borderColor:
                      "var(--user-card-border)",
                  }}
                >
                  {loading ? (
                    <Loader2
                      size={12}
                      className="animate-spin"
                    />
                  ) : (
                    <Send
                      size={12}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div
            className="
              mt-2.5
              sm:mt-3
            "
          >
            <PriceField
              value={
                proposedPrice
              }
              setValue={
                setProposedPrice
              }
              placeholder={
                currentOffer.toFixed(
                  2,
                )
              }
              loading={
                loading
              }
            />
          </div>

          <div
            className="
              mt-2.5
              flex
              items-center
              justify-between
              gap-2
              sm:mt-3
            "
          >
            <button
              type="button"
              onClick={() =>
                onAction()
              }
              disabled={
                loading
              }
              className="
                inline-flex
                h-7
                items-center
                justify-center
                rounded-md
                border
                px-2
                text-[8px]
                font-semibold
                transition
                hover:bg-[var(--user-surface-secondary)]
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:h-8
                sm:px-3
                sm:text-[10px]
              "
              style={{
                background:
                  "var(--user-card-bg)",

                color:
                  "var(--user-text-muted)",

                borderColor:
                  "var(--user-card-border)",
              }}
            >
              Take Action
            </button>

            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                loading
              }
              className="
                h-7
                rounded-md
                border
                px-2
                text-[8px]
                font-semibold
                transition
                hover:bg-[var(--user-surface-secondary)]
                disabled:opacity-50
                sm:h-8
                sm:px-3
                sm:text-[10px]
              "
              style={{
                background:
                  "var(--user-card-bg)",

                color:
                  "var(--user-text-muted)",

                borderColor:
                  "var(--user-card-border)",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function FinalNegotiationActionDialog({
  buyerName,
  loadingAction,
  onClose,
  onAccept,
  onReject,
}: {
  buyerName: string;

  loadingAction:
    | "accept"
    | "reject"
    | null;

  onClose: () => void;

  onAccept: () => void;

  onReject: () => void;
}) {
  const loading =
    loadingAction !== null;

  return (
    <div
      role="presentation"
      className="
        fixed
        inset-0
        z-[180]
        flex
        items-center
        justify-center
        bg-black/50
        p-2
        backdrop-blur-sm
        sm:p-3
      "
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
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Negotiation action"
        className="
          w-full
          max-w-xs
          rounded-lg
          border
          p-3
          shadow-2xl
          sm:rounded-xl
          sm:p-4
        "
        style={{
          background:
            "var(--user-card-bg)",

          borderColor:
            "var(--user-card-border)",
        }}
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >
          <div>
            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.08em]
              "
              style={{
                color:
                  "var(--user-text-muted)",
              }}
            >
              Take Action
            </p>

            <h3
              className="
                mt-0.5
                text-[13px]
                font-semibold
                sm:text-sm
              "
              style={{
                color:
                  "var(--user-title)",
              }}
            >
              {buyerName}
            </h3>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              loading
            }
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              border
              transition
              hover:bg-[var(--user-surface-secondary)]
              disabled:opacity-50
            "
            style={{
              background:
                "var(--user-card-bg)",

              color:
                "var(--user-text-muted)",

              borderColor:
                "var(--user-card-border)",
            }}
            aria-label="Close"
          >
            <X
              size={14}
            />
          </button>
        </div>

        <p
          className="
            mt-2.5
            text-[10px]
            leading-4
            sm:mt-3
          "
          style={{
            color:
              "var(--user-text-muted)",
          }}
        >
          Choose how you want to conclude
          this negotiation.
        </p>

        <div
          className="
            mt-3
            space-y-1.5
            sm:mt-4
            sm:space-y-2
          "
        >
          <button
            type="button"
            onClick={
              onAccept
            }
            disabled={
              loading
            }
            className="
              flex
              w-full
              items-center
              justify-between
              rounded-lg
              border
              px-2.5
              py-2
              text-left
              transition
              hover:bg-[var(--user-surface-secondary)]
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:px-3
              sm:py-2.5
            "
            style={{
              background:
                "var(--user-card-bg)",

              borderColor:
                "var(--user-card-border)",

              color:
                "var(--user-title)",
            }}
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-semibold
                "
              >
                {loadingAction ===
                "accept"
                  ? "Accepting..."
                  : "Accept negotiation"}
              </p>

              <p
                className="
                  mt-0.5
                  text-[8px]
                  leading-3.5
                "
                style={{
                  color:
                    "var(--user-text-muted)",
                }}
              >
                Confirm that you have agreed
                to the buyer's offer and want
                to proceed.
              </p>
            </div>

            {loadingAction ===
            "accept" ? (
              <Loader2
                size={14}
                className="animate-spin"
              />
            ) : (
              <Check
                size={14}
              />
            )}
          </button>

          <button
            type="button"
            onClick={
              onReject
            }
            disabled={
              loading
            }
            className="
              flex
              w-full
              items-center
              justify-between
              rounded-lg
              border
              px-2.5
              py-2
              text-left
              transition
              hover:bg-[var(--user-surface-secondary)]
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:px-3
              sm:py-2.5
            "
            style={{
              background:
                "var(--user-card-bg)",

              borderColor:
                "var(--user-card-border)",

              color:
                "var(--user-title)",
            }}
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-semibold
                "
              >
                {loadingAction ===
                "reject"
                  ? "Closing..."
                  : "Close negotiation"}
              </p>

              <p
                className="
                  mt-0.5
                  text-[8px]
                  leading-3.5
                "
                style={{
                  color:
                    "var(--user-text-muted)",
                }}
              >
                End the negotiation without
                reaching an agreement with the
                buyer.
              </p>
            </div>

            {loadingAction ===
            "reject" ? (
              <Loader2
                size={14}
                className="animate-spin"
              />
            ) : (
              <X
                size={14}
              />
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={
            onClose
          }
          disabled={
            loading
          }
          className="
            mt-2.5
            h-8
            w-full
            rounded-md
            border
            text-[10px]
            font-semibold
            transition
            hover:bg-[var(--user-surface-secondary)]
            disabled:opacity-50
            sm:mt-3
          "
          style={{
            background:
              "var(--user-card-bg)",

            color:
              "var(--user-text-muted)",

            borderColor:
              "var(--user-card-border)",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function PriceField({
  value,
  setValue,
  placeholder,
  loading,
}: {
  value: string;

  setValue: (
    value: string,
  ) => void;

  placeholder: string;

  loading: boolean;
}) {
  return (
    <div>
      <label
        htmlFor="affiliate-negotiation-price"
        className="
          mb-1
          block
          text-[9px]
          font-semibold
          uppercase
          tracking-[0.06em]
        "
        style={{
          color:
            "var(--user-text-muted)",
        }}
      >
        Proposed Price

        <span className="ml-1 normal-case font-normal">
          Optional
        </span>
      </label>

      <div
        className="
          flex
          h-8
          items-center
          rounded-md
          border
          px-2.5
        "
        style={{
          borderColor:
            "var(--user-card-border)",

          background:
            "var(--user-card-bg)",
        }}
      >
        <span
          className="
            mr-1
            text-[10px]
            font-semibold
          "
          style={{
            color:
              "var(--user-text-muted)",
          }}
        >
          $
        </span>

        <input
          id="affiliate-negotiation-price"
          type="number"
          min="0.01"
          step="0.01"
          value={
            value
          }
          onChange={(
            event,
          ) =>
            setValue(
              event.target
                .value,
            )
          }
          placeholder={
            placeholder
          }
          disabled={
            loading
          }
          className="
            h-full
            min-w-0
            flex-1
            bg-transparent
            text-[10px]
            outline-none
          "
          style={{
            color:
              "var(--user-title)",
          }}
        />
      </div>
    </div>
  );
}

function formatDate(
  value: string,
) {
  return new Date(
    value,
  ).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
    },
  );
}

function formatDateTime(
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