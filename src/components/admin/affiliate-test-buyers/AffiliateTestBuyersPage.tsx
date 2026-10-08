"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Image from "next/image";

import {
  Pencil,
  Plus,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { toast } from "sonner";

import CloudinaryUploader from "@/components/shared/CloudinaryUploader";

import {
  createAffiliateTestBuyer,
  deleteAffiliateTestBuyer,
  getAffiliateTestBuyers,
  updateAffiliateTestBuyer,
} from "./test-buyer.service";

import type {
  AffiliateTestBuyer,
  CreateAffiliateTestBuyerInput,
} from "./types";

import {
  getCloudinaryImageUrl,
} from "@/lib/cloudinary";

export default function AffiliateTestBuyersPage() {
  const [
    buyers,
    setBuyers,
  ] = useState<
    AffiliateTestBuyer[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    selectedBuyer,
    setSelectedBuyer,
  ] =
    useState<AffiliateTestBuyer | null>(
      null,
    );

  const [
    formOpen,
    setFormOpen,
  ] = useState(false);

  const [
    deletingId,
    setDeletingId,
  ] = useState<string | null>(
    null,
  );

  useEffect(() => {
    async function load() {
      try {
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
        setLoading(false);
      }
    }

    void load();
  }, []);

  const sortedBuyers =
    useMemo(
      () =>
        [...buyers].sort(
          (a, b) =>
            new Date(
              b.createdAt,
            ).getTime() -
            new Date(
              a.createdAt,
            ).getTime(),
        ),
      [buyers],
    );

  function openCreate() {
    setSelectedBuyer(null);
    setFormOpen(true);
  }

  function openEdit(
    buyer: AffiliateTestBuyer,
  ) {
    setSelectedBuyer(
      buyer,
    );

    setFormOpen(true);
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setFormOpen(false);

    setSelectedBuyer(
      null,
    );
  }

  async function handleSave(
    values: CreateAffiliateTestBuyerInput,
  ) {
    try {
      setSaving(true);

      if (selectedBuyer) {
        const response =
          await updateAffiliateTestBuyer(
            selectedBuyer.id,
            values,
          );

        setBuyers(
          (current) =>
            current.map(
              (buyer) =>
                buyer.id ===
                response.data.id
                  ? response.data
                  : buyer,
            ),
        );

        toast.success(
          "Test buyer updated.",
        );
      } else {
        const response =
          await createAffiliateTestBuyer(
            values,
          );

        setBuyers(
          (current) => [
            response.data,
            ...current,
          ],
        );

        toast.success(
          "Test buyer created.",
        );
      }

      closeForm();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save test buyer.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    buyerId: string,
  ) {
    if (deletingId) {
      return;
    }

    try {
      setDeletingId(
        buyerId,
      );

      await deleteAffiliateTestBuyer(
        buyerId,
      );

      setBuyers(
        (current) =>
          current.filter(
            (buyer) =>
              buyer.id !==
              buyerId,
          ),
      );

      toast.success(
        "Test buyer deleted.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete test buyer.",
      );
    } finally {
      setDeletingId(
        null,
      );
    }
  }

  return (
    <div
      className="
        space-y-2.5
        sm:space-y-3
      "
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
        <div className="min-w-0">
          <h1
            className="
              truncate
              text-[13px]
              font-bold
              sm:text-sm
            "
            style={{
              color:
                "var(--foreground)",
            }}
          >
            Test Buyers
          </h1>

          <p
            className="
              mt-px
              text-[9px]
              leading-3.5
              sm:mt-0.5
              sm:text-[10px]
            "
            style={{
              color:
                "var(--foreground-muted)",
            }}
          >
            Create buyer profiles for
            affiliate flow testing.
          </p>
        </div>

        <button
          type="button"
          onClick={
            openCreate
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
            text-[9px]
            font-semibold
            transition
            hover:bg-[var(--surface-hover)]
            sm:h-8
            sm:gap-1.5
            sm:px-2.5
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
          <Plus
            size={12}
            className="sm:h-[13px] sm:w-[13px]"
          />

          Add Buyer
        </button>
      </div>

      <div
        className="
          overflow-hidden
          rounded-lg
          border
          sm:rounded-xl
        "
        style={{
          background:
            "var(--surface)",
          borderColor:
            "var(--border)",
        }}
      >
        {loading ? (
          <div
            className="
              space-y-1.5
              p-2
              sm:space-y-2
              sm:p-3
            "
          >
            {Array.from({
              length: 5,
            }).map(
              (_, index) => (
                <div
                  key={
                    index
                  }
                  className="
                    h-10
                    animate-pulse
                    rounded-md
                    bg-[var(--surface-hover)]
                    sm:h-12
                    sm:rounded-lg
                  "
                />
              ),
            )}
          </div>
        ) : sortedBuyers.length ===
          0 ? (
          <div
            className="
              px-3
              py-8
              text-center
              sm:px-4
              sm:py-10
            "
          >
            <p
              className="
                text-[11px]
                font-semibold
                sm:text-xs
              "
              style={{
                color:
                  "var(--foreground)",
              }}
            >
              No test buyers yet
            </p>

            <p
              className="
                mt-0.5
                text-[9px]
                sm:mt-1
                sm:text-[10px]
              "
              style={{
                color:
                  "var(--foreground-muted)",
              }}
            >
              Create a buyer before
              registering an affiliate
              interest.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {sortedBuyers.map(
              (buyer) => (
                <BuyerRow
                  key={
                    buyer.id
                  }
                  buyer={
                    buyer
                  }
                  deleting={
                    deletingId ===
                    buyer.id
                  }
                  onEdit={() =>
                    openEdit(
                      buyer,
                    )
                  }
                  onDelete={() =>
                    handleDelete(
                      buyer.id,
                    )
                  }
                />
              ),
            )}
          </div>
        )}
      </div>

      {formOpen && (
        <BuyerFormDialog
          buyer={
            selectedBuyer
          }
          saving={
            saving
          }
          onClose={
            closeForm
          }
          onSubmit={
            handleSave
          }
        />
      )}
    </div>
  );
}

type BuyerRowProps = {
  buyer: AffiliateTestBuyer;

  deleting: boolean;

  onEdit: () => void;

  onDelete: () => void;
};

function BuyerRow({
  buyer,
  deleting,
  onEdit,
  onDelete,
}: BuyerRowProps) {
  const imageUrl =
    buyer.imageKey
      ? getCloudinaryImageUrl(
          buyer.imageKey,
        )
      : null;

  return (
    <div
      className="
        flex
        items-center
        gap-2
        px-2.5
        py-2
        sm:gap-3
        sm:px-3
        sm:py-2.5
      "
    >
      <div
        className="
          relative
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-full
          bg-[var(--surface-hover)]
          sm:h-9
          sm:w-9
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
            sizes="36px"
            className="object-cover"
          />
        ) : (
          <UserRound
            size={13}
            className="text-[var(--foreground-muted)] sm:h-[15px] sm:w-[15px]"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="
            truncate
            text-[10px]
            font-semibold
            sm:text-[11px]
          "
          style={{
            color:
              "var(--foreground)",
          }}
        >
          {buyer.name}
        </p>

        <p
          className="
            mt-px
            truncate
            text-[8px]
            sm:mt-0.5
            sm:text-[9px]
          "
          style={{
            color:
              "var(--foreground-muted)",
          }}
        >
          {buyer.phone}

          {buyer.email
            ? ` • ${buyer.email}`
            : ""}
        </p>
      </div>

      <div
        className="
          hidden
          items-center
          gap-1.5
          sm:flex
        "
      >
        <button
          type="button"
          onClick={
            onEdit
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
            hover:bg-[var(--surface-hover)]
          "
          style={{
            background:
              "var(--surface)",
            color:
              "var(--foreground-muted)",
            borderColor:
              "var(--border)",
          }}
          aria-label={`Edit ${buyer.name}`}
        >
          <Pencil
            size={12}
          />
        </button>

        <button
          type="button"
          onClick={
            onDelete
          }
          disabled={
            deleting
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
            hover:bg-[var(--surface-hover)]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
          style={{
            background:
              "var(--surface)",
            color:
              "var(--foreground-muted)",
            borderColor:
              "var(--border)",
          }}
          aria-label={`Delete ${buyer.name}`}
        >
          <Trash2
            size={12}
          />
        </button>
      </div>
    </div>
  );
}

type BuyerFormDialogProps = {
  buyer:
    | AffiliateTestBuyer
    | null;

  saving: boolean;

  onClose: () => void;

  onSubmit: (
    values: CreateAffiliateTestBuyerInput,
  ) => void;
};

function BuyerFormDialog({
  buyer,
  saving,
  onClose,
  onSubmit,
}: BuyerFormDialogProps) {
  const [
    name,
    setName,
  ] = useState(
    buyer?.name ??
      "",
  );

  const [
    phone,
    setPhone,
  ] = useState(
    buyer?.phone ??
      "",
  );

  const [
    email,
    setEmail,
  ] = useState(
    buyer?.email ??
      "",
  );

  const [
    imageKey,
    setImageKey,
  ] = useState(
    buyer?.imageKey ??
      null,
  );

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    onSubmit({
      name,

      phone,

      email:
        email.trim() ||
        null,

      imageKey,
    });
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
        z-[120]
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
        onSubmit={
          handleSubmit
        }
        className="
          max-h-[94vh]
          w-full
          max-w-sm
          overflow-y-auto
          rounded-lg
          border
          p-3
          shadow-2xl
          sm:max-h-[92vh]
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
            items-center
            justify-between
            gap-2
            sm:gap-3
          "
        >
          <div className="min-w-0">
            <h2
              className="
                truncate
                text-[12px]
                font-bold
                sm:text-sm
              "
              style={{
                color:
                  "var(--foreground)",
              }}
            >
              {buyer
                ? "Edit Test Buyer"
                : "Create Test Buyer"}
            </h2>

            <p
              className="
                mt-px
                text-[9px]
                leading-3.5
                sm:mt-0.5
                sm:text-[10px]
              "
              style={{
                color:
                  "var(--foreground-muted)",
              }}
            >
              Use this profile when
              testing affiliate interests.
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
              className="sm:h-[14px] sm:w-[14px]"
            />
          </button>
        </div>

        <div
          className="
            mt-2.5
            space-y-2.5
            sm:mt-3
            sm:space-y-3
          "
        >
          <Field
            label="Name"
            value={
              name
            }
            onChange={
              setName
            }
            placeholder="Buyer name"
            required
          />

          <Field
            label="Phone"
            value={
              phone
            }
            onChange={
              setPhone
            }
            placeholder="Phone number"
            required
          />

          <Field
            label="Email"
            value={
              email
            }
            onChange={
              setEmail
            }
            placeholder="Optional email"
            type="email"
          />

          <div>
            <span
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
              Profile Image
            </span>

            <CloudinaryUploader
              value={
                imageKey
              }
              folder="affiliate-test-buyers"
              disabled={
                saving
              }
              onChange={
                setImageKey
              }
            />
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
              saving ||
              !name.trim() ||
              !phone.trim()
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
              disabled:cursor-not-allowed
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
            {saving
              ? "Saving..."
              : buyer
                ? "Save Changes"
                : "Create Buyer"}
          </button>
        </div>
      </form>
    </div>
  );
}

type FieldProps = {
  label: string;

  value: string;

  onChange: (
    value: string,
  ) => void;

  placeholder?: string;

  type?: string;

  required?: boolean;
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: FieldProps) {
  return (
    <label className="block">
      <span
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
        {label}
      </span>

      <input
        type={type}
        value={
          value
        }
        onChange={(
          event,
        ) =>
          onChange(
            event.target
              .value,
          )
        }
        placeholder={
          placeholder
        }
        required={
          required
        }
        className="
          h-7
          w-full
          rounded-md
          border
          bg-transparent
          px-2
          text-[9px]
          outline-none
          focus:border-[var(--primary)]
          sm:h-8
          sm:px-2.5
          sm:text-[10px]
        "
        style={{
          borderColor:
            "var(--border)",
          color:
            "var(--foreground)",
        }}
      />
    </label>
  );
}