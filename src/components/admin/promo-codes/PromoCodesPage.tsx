
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  Plus,
  Search,
  Tag,
  TicketPercent,
  RefreshCw,
  X,
  CalendarDays,
  Users,
  Pencil,
} from "lucide-react";

import { toast } from "sonner";

import DashboardPageLayout from "@/components/dashboard/DashboardPage";
import { AdminPageHeader } from "@/components/admin";
import Button from "@/components/ui/Button";

type PromoCode = {
  id: string;
  code: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: string;
  minimumSubtotal: string | null;
  maximumDiscount: string | null;
  startsAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  usageLimit: number | null;
  perUserLimit: number | null;
  createdAt: string;
  redemptionCount: number;
};

type PromoForm = {
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: string;
  minimumSubtotal: string;
  maximumDiscount: string;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
  usageLimit: string;
  perUserLimit: string;
};

const emptyForm: PromoForm = {
  code: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  minimumSubtotal: "",
  maximumDiscount: "",
  startsAt: "",
  expiresAt: "",
  isActive: true,
  usageLimit: "",
  perUserLimit: "",
};

type Filter = "ALL" | "ACTIVE" | "INACTIVE";

function money(value: string | number | null) {
  if (value === null || value === "") return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function dateLabel(value: string | null) {
  if (!value) return "No expiry";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function toDateTimeLocal(value: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16);
}

function isCurrentlyAvailable(promo: PromoCode) {
  const now = Date.now();

  return (
    promo.isActive &&
    (!promo.startsAt || new Date(promo.startsAt).getTime() <= now) &&
    (!promo.expiresAt || new Date(promo.expiresAt).getTime() > now) &&
    (promo.usageLimit === null ||
      promo.redemptionCount < promo.usageLimit)
  );
}

function discountLabel(promo: PromoCode) {
  return promo.discountType === "PERCENTAGE"
    ? `${Number(promo.discountValue)}% off`
    : `${money(promo.discountValue)} off`;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block min-w-0 space-y-1">
      <span
        className="block text-[10px] font-medium sm:text-xs"
        style={{ color: "var(--admin-muted)" }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full min-w-0 rounded-lg border px-2.5 py-2 text-xs outline-none transition focus:border-indigo-500 sm:text-sm";

const inputStyle = {
  background: "var(--admin-table-bg)",
  borderColor: "var(--admin-card-border)",
  color: "var(--admin-text)",
};

function StatusBadge({
  active,
}: {
  active: boolean;
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold sm:text-[10px]"
      style={{
        background: active
          ? "var(--admin-status-success-bg)"
          : "var(--admin-status-failed-bg)",
        color: active
          ? "var(--admin-status-success-text)"
          : "var(--admin-status-failed-text)",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          background: active
            ? "var(--admin-status-success-text)"
            : "var(--admin-status-failed-text)",
        }}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default function PromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [form, setForm] = useState<PromoForm>(emptyForm);

  const loadPromoCodes = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/promo-codes", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load promo codes.");
      }

      setPromoCodes(result.promoCodes);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load promo codes.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPromoCodes();
  }, [loadPromoCodes]);

  const filteredCodes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return promoCodes.filter((promo) => {
      const matchesQuery =
        !normalizedQuery ||
        promo.code.toLowerCase().includes(normalizedQuery) ||
        (promo.description ?? "").toLowerCase().includes(normalizedQuery);

      const matchesFilter =
        filter === "ALL" ||
        (filter === "ACTIVE" && promo.isActive) ||
        (filter === "INACTIVE" && !promo.isActive);

      return matchesQuery && matchesFilter;
    });
  }, [promoCodes, query, filter]);

  const activeCount = promoCodes.filter((promo) => promo.isActive).length;

  const totalRedemptions = promoCodes.reduce(
    (total, promo) => total + promo.redemptionCount,
    0,
  );


function openCreateDialog() {
  setEditingPromo(null);
  setForm(emptyForm);
  setDialogOpen(true);
}

function openEditDialog(promo: PromoCode) {
  setEditingPromo(promo);

  setForm({
    code: promo.code,
    description: promo.description ?? "",
    discountType: promo.discountType,
    discountValue: promo.discountValue,
    minimumSubtotal: promo.minimumSubtotal ?? "",
    maximumDiscount: promo.maximumDiscount ?? "",
    startsAt: toDateTimeLocal(promo.startsAt),
    expiresAt: toDateTimeLocal(promo.expiresAt),
    isActive: promo.isActive,
    usageLimit:
      promo.usageLimit === null ? "" : String(promo.usageLimit),
    perUserLimit:
      promo.perUserLimit === null ? "" : String(promo.perUserLimit),
  });

  setDialogOpen(true);
}

function closeDialog() {
  if (submitting) return;

  setDialogOpen(false);
  setEditingPromo(null);
  setForm(emptyForm);
}


  function updateField<K extends keyof PromoForm>(
    key: K,
    value: PromoForm[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const discountValue = Number(form.discountValue);

    if (!Number.isFinite(discountValue) || discountValue <= 0) {
      toast.error("Enter a valid discount amount.");
      return;
    }

    if (
      form.discountType === "PERCENTAGE" &&
      discountValue > 100
    ) {
      toast.error("Percentage discounts cannot exceed 100%.");
      return;
    }

    if (
      form.startsAt &&
      form.expiresAt &&
      new Date(form.expiresAt) <= new Date(form.startsAt)
    ) {
      toast.error("Expiry must be later than the start date.");
      return;
    }

    const optionalNumber = (value: string) =>
      value.trim() === "" ? null : Number(value);

    const toIso = (value: string) =>
      value ? new Date(value).toISOString() : null;

    const payload = {
      code: form.code.trim().toUpperCase(),
      description: form.description.trim() || null,
      discountType: form.discountType,
      discountValue,
      minimumSubtotal: optionalNumber(form.minimumSubtotal),
      maximumDiscount:
        form.discountType === "PERCENTAGE"
          ? optionalNumber(form.maximumDiscount)
          : null,
      startsAt: toIso(form.startsAt),
      expiresAt: toIso(form.expiresAt),
      isActive: form.isActive,
      usageLimit:
        form.usageLimit.trim() === ""
          ? null
          : Number(form.usageLimit),
      perUserLimit:
        form.perUserLimit.trim() === ""
          ? null
          : Number(form.perUserLimit),
    };

    if (
      payload.minimumSubtotal !== null &&
      (!Number.isFinite(payload.minimumSubtotal) ||
        payload.minimumSubtotal < 0)
    ) {
      toast.error("Minimum subtotal must be zero or greater.");
      return;
    }

    if (
      payload.maximumDiscount !== null &&
      (!Number.isFinite(payload.maximumDiscount) ||
        payload.maximumDiscount < 0)
    ) {
      toast.error("Maximum discount must be zero or greater.");
      return;
    }

    if (
      (payload.usageLimit !== null &&
        (!Number.isInteger(payload.usageLimit) || payload.usageLimit <= 0)) ||
      (payload.perUserLimit !== null &&
        (!Number.isInteger(payload.perUserLimit) ||
          payload.perUserLimit <= 0))
    ) {
      toast.error("Usage limits must be positive whole numbers.");
      return;
    }

    try {
      setSubmitting(true);

const response = await fetch(
  editingPromo
    ? `/api/admin/promo-codes/${editingPromo.id}`
    : "/api/admin/promo-codes",
  {
    method: editingPromo ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  },
);

      const result = await response.json();

      if (!response.ok || !result.success) {
        const validationErrors = result.errors?.fieldErrors;
        const firstError = validationErrors
          ? Object.values(validationErrors).flat()[0]
          : null;

        throw new Error(
          firstError ||
            result.message ||
            "Failed to create promo code.",
        );
      }

toast.success(
  editingPromo
    ? "Promo code updated successfully."
    : "Promo code created successfully.",
);

setDialogOpen(false);
setEditingPromo(null);
setForm(emptyForm);

await loadPromoCodes();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? String(error.message)
          : "Failed to create promo code.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardPageLayout
      environment="admin"
      breadcrumb={[{ label: "Promo Codes" }]}
    >
      <div className="space-y-3 pb-10 sm:space-y-5 sm:pb-14">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
          <AdminPageHeader
            title="Promo Codes"
            description="Create and manage checkout discounts."
          />

          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              onClick={() => void loadPromoCodes()}
              className="h-8 w-9 !px-0"
              title="Refresh promo codes"
              aria-label="Refresh promo codes"
            >
              <RefreshCw
                size={14}
                className={loading ? "animate-spin" : ""}
              />
            </Button>

            <Button
              type="button"
              onClick={openCreateDialog}
              className="h-8 flex-1 !px-3 text-xs sm:flex-none"
            >
              <span className="inline-flex items-center gap-1.5">
                <Plus size={14} />
                Create code
              </span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Metric
            label="Total codes"
            value={promoCodes.length}
            icon={<TicketPercent size={14} />}
          />
          <Metric
            label="Active"
            value={activeCount}
            icon={<Tag size={14} />}
          />
          <Metric
            label="Redemptions"
            value={totalRedemptions}
            icon={<Users size={14} />}
          />
        </div>

        <section
          className="rounded-lg border p-2.5 sm:rounded-xl sm:p-3"
          style={{
            background: "var(--admin-card-bg)",
            borderColor: "var(--admin-card-border)",
            boxShadow: "var(--admin-card-shadow)",
          }}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div
              className="flex h-8 min-w-0 items-center gap-2 rounded-lg border px-2.5 sm:max-w-xs sm:flex-1"
              style={{
                background: "var(--admin-table-bg)",
                borderColor: "var(--admin-card-border)",
              }}
            >
              <Search
                size={14}
                style={{ color: "var(--admin-muted)" }}
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search codes..."
                aria-label="Search promo codes"
                className="min-w-0 flex-1 bg-transparent text-xs outline-none"
                style={{ color: "var(--admin-text)" }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="rounded p-0.5"
                  style={{ color: "var(--admin-muted)" }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div
              className="flex w-full rounded-lg border p-0.5 sm:w-auto"
              style={{ borderColor: "var(--admin-card-border)" }}
            >
              {(["ALL", "ACTIVE", "INACTIVE"] as Filter[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className="flex-1 rounded-md px-2 py-1.5 text-[9px] font-semibold transition sm:flex-none sm:px-3 sm:text-[10px]"
                  style={{
                    background:
                      filter === item
                        ? "var(--admin-table-header-bg)"
                        : "transparent",
                    color:
                      filter === item
                        ? "var(--admin-title)"
                        : "var(--admin-muted)",
                  }}
                >
                  {item === "ALL"
                    ? "All"
                    : item === "ACTIVE"
                      ? "Active"
                      : "Inactive"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3">
            {loading ? (
              <div
                className="rounded-lg border px-3 py-8 text-center text-xs"
                style={{
                  borderColor: "var(--admin-card-border)",
                  color: "var(--admin-muted)",
                }}
              >
                Loading promo codes...
              </div>
            ) : filteredCodes.length === 0 ? (
              <div
                className="rounded-lg border px-3 py-8 text-center"
                style={{
                  background: "var(--admin-empty-bg)",
                  borderColor: "var(--admin-empty-border)",
                }}
              >
                <Tag
                  size={20}
                  className="mx-auto"
                  style={{ color: "var(--admin-muted)" }}
                />
                <p
                  className="mt-2 text-xs font-semibold"
                  style={{ color: "var(--admin-empty-title)" }}
                >
                  {promoCodes.length === 0
                    ? "No promo codes yet"
                    : "No matching promo codes"}
                </p>
                <p
                  className="mt-1 text-[10px]"
                  style={{ color: "var(--admin-empty-text)" }}
                >
                  {promoCodes.length === 0
                    ? "Create your first discount code to get started."
                    : "Try a different search or status filter."}
                </p>
                {promoCodes.length === 0 && (
                  <Button
                    type="button"
                    onClick={openCreateDialog}
                    className="mt-3 h-8 !px-3 text-xs"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Plus size={13} />
                      Create promo code
                    </span>
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full">
                    <thead
                      style={{
                        background: "var(--admin-table-header-bg)",
                      }}
                    >
                      <tr>
                        <TableHeader>Code</TableHeader>
                        <TableHeader>Discount</TableHeader>
                        <TableHeader>Redemptions</TableHeader>
                        <TableHeader>Expiry</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader>Availability</TableHeader>
                        <TableHeader>Actions</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCodes.map((promo) => (
                        <tr
                          key={promo.id}
                          style={{
                            borderColor: "var(--admin-table-border)",
                          }}
                        >

                          <TableCell>
                            <div className="min-w-0">
                              <p className="font-semibold tracking-wide">
                                {promo.code}
                              </p>
                              <p
                                className="mt-0.5 max-w-48 truncate text-[10px]"
                                style={{ color: "var(--admin-muted)" }}
                              >
                                {promo.description || "No description"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {discountLabel(promo)}
                            </div>
                            {promo.minimumSubtotal !== null && (
                              <p
                                className="mt-0.5 text-[10px]"
                                style={{ color: "var(--admin-muted)" }}
                              >
                                Min. {money(promo.minimumSubtotal)}
                              </p>
                            )}
                          </TableCell>
                          <TableCell>
                            {promo.redemptionCount}
                            {promo.usageLimit !== null
                              ? ` / ${promo.usageLimit}`
                              : " / ∞"}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays
                                size={12}
                                style={{ color: "var(--admin-muted)" }}
                              />
                              {dateLabel(promo.expiresAt)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <StatusBadge active={promo.isActive} />
                          </TableCell>
                          <TableCell>
                            <StatusBadge
                              active={isCurrentlyAvailable(promo)}
                            />
                          </TableCell>

<TableCell>
  <button
    type="button"
    onClick={() => openEditDialog(promo)}
    className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[10px] font-medium transition hover:opacity-80"
    style={{
      borderColor: "var(--admin-card-border)",
      color: "var(--admin-text)",
    }}
  >
    <Pencil size={12} />
    Edit
  </button>
</TableCell>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-2 lg:hidden">
                  {filteredCodes.map((promo) => (
                    <article
                      key={promo.id}
                      className="rounded-lg border p-2.5 sm:p-3"
                      style={{
                        background: "var(--admin-card-bg)",
                        borderColor: "var(--admin-card-border)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p
                            className="truncate text-xs font-bold tracking-wide sm:text-sm"
                            style={{ color: "var(--admin-title)" }}
                          >
                            {promo.code}
                          </p>
                          <p
                            className="mt-0.5 truncate text-[9px] sm:text-[10px]"
                            style={{ color: "var(--admin-muted)" }}
                          >
                            {promo.description || "No description"}
                          </p>
                        </div>
                        <StatusBadge active={promo.isActive} />
                      </div>

                      <div className="mt-2 grid grid-cols-3 gap-1.5">
                        <CompactInfo
                          label="Discount"
                          value={discountLabel(promo)}
                        />
                        <CompactInfo
                          label="Redeemed"
                          value={
                            promo.usageLimit !== null
                              ? `${promo.redemptionCount}/${promo.usageLimit}`
                              : String(promo.redemptionCount)
                          }
                        />
                        <CompactInfo
                          label="Expires"
                          value={dateLabel(promo.expiresAt)}
                        />
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span
                          className="text-[9px]"
                          style={{ color: "var(--admin-muted)" }}
                        >
                          {isCurrentlyAvailable(promo)
                            ? "Available at checkout"
                            : "Not currently available"}
                        </span>
                        <StatusBadge
                          active={isCurrentlyAvailable(promo)}
                        />
                      </div>

<div
  className="mt-2 flex justify-end border-t pt-2"
  style={{ borderColor: "var(--admin-card-border)" }}
>
  <button
    type="button"
    onClick={() => openEditDialog(promo)}
    className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[10px] font-medium"
    style={{
      borderColor: "var(--admin-card-border)",
      color: "var(--admin-text)",
    }}
  >
    <Pencil size={12} />
    Edit code
  </button>
</div>

                    </article>
                  ))}
                </div>
              </>
            )}
          </div>

          {!loading && filteredCodes.length > 0 && (
            <p
              className="mt-2.5 text-[9px]"
              style={{ color: "var(--admin-muted)" }}
            >
              Showing {filteredCodes.length} of {promoCodes.length} codes
            </p>
          )}
        </section>

        {dialogOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeDialog();
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="promo-dialog-title"
              className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border p-3 shadow-2xl sm:rounded-xl sm:p-5"
              style={{
                background: "var(--admin-card-bg)",
                borderColor: "var(--admin-card-border)",
              }}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2
                    id="promo-dialog-title"
                    className="text-sm font-semibold sm:text-base"
                    style={{ color: "var(--admin-title)" }}
                  >
                    {editingPromo ? `Edit ${editingPromo.code}` : "Create promo code"}
                  </h2>
                  <p
                    className="mt-0.5 text-[10px] sm:text-xs"
                    style={{ color: "var(--admin-muted)" }}
                  >
                    Configure a discount for checkout.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeDialog}
                  disabled={submitting}
                  aria-label="Close dialog"
                  className="rounded-lg p-1.5 transition hover:bg-black/5"
                  style={{ color: "var(--admin-muted)" }}
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-3">
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <Field label="Promo code *">
                    <input
                      required
                      minLength={3}
                      maxLength={50}
                      pattern="[A-Za-z0-9_-]+"
                      autoCapitalize="characters"
                      autoComplete="off"
                      placeholder="WELCOME10"
                      disabled={!!editingPromo}
                      value={form.code}
                      onChange={(event) =>
                        updateField("code", event.target.value.toUpperCase())
                      }
                      className={inputClass}
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Status">
                    <select
                      value={form.isActive ? "active" : "inactive"}
                      onChange={(event) =>
                        updateField("isActive", event.target.value === "active")
                      }
                      className={inputClass}
                      style={inputStyle}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </Field>
                </div>

                <Field label="Description">
                  <input
                    maxLength={500}
                    placeholder="Optional internal description"
                    value={form.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    className={inputClass}
                    style={inputStyle}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-2.5">
                  <Field label="Discount type *">
                    <select
                      value={form.discountType}
                      onChange={(event) => {
                        const value = event.target.value as PromoForm["discountType"];
                        updateField("discountType", value);

                        if (value === "FIXED_AMOUNT") {
                          updateField("maximumDiscount", "");
                        }
                      }}
                      className={inputClass}
                      style={inputStyle}
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED_AMOUNT">Fixed amount ($)</option>
                    </select>
                  </Field>

                  <Field label={form.discountType === "PERCENTAGE" ? "Discount (%) *" : "Discount ($) *"}>
                    <input
                      required
                      type="number"
                      min="0.01"
                      max={form.discountType === "PERCENTAGE" ? 100 : undefined}
                      step="0.01"
                      value={form.discountValue}
                      onChange={(event) =>
                        updateField("discountValue", event.target.value)
                      }
                      placeholder="10"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <Field label="Minimum subtotal ($)">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.minimumSubtotal}
                      onChange={(event) =>
                        updateField("minimumSubtotal", event.target.value)
                      }
                      placeholder="No minimum"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Maximum discount ($)">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={form.discountType !== "PERCENTAGE"}
                      value={form.maximumDiscount}
                      onChange={(event) =>
                        updateField("maximumDiscount", event.target.value)
                      }
                      placeholder={
                        form.discountType === "PERCENTAGE"
                          ? "Unlimited"
                          : "Not applicable"
                      }
                      className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-50`}
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <Field label="Starts at">
                    <input
                      type="datetime-local"
                      value={form.startsAt}
                      onChange={(event) =>
                        updateField("startsAt", event.target.value)
                      }
                      className={inputClass}
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Expires at">
                    <input
                      type="datetime-local"
                      value={form.expiresAt}
                      onChange={(event) =>
                        updateField("expiresAt", event.target.value)
                      }
                      className={inputClass}
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <Field label="Total usage limit">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={form.usageLimit}
                      onChange={(event) =>
                        updateField("usageLimit", event.target.value)
                      }
                      placeholder="Unlimited"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Per-customer limit">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={form.perUserLimit}
                      onChange={(event) =>
                        updateField("perUserLimit", event.target.value)
                      }
                      placeholder="Unlimited"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <div
                  className="flex items-center justify-between gap-3 rounded-lg border px-2.5 py-2"
                  style={{ borderColor: "var(--admin-card-border)" }}
                >
                  <div>
                    <p
                      className="text-[11px] font-medium"
                      style={{ color: "var(--admin-text)" }}
                    >
                      Activate immediately
                    </p>
                    <p
                      className="mt-0.5 text-[9px]"
                      style={{ color: "var(--admin-muted)" }}
                    >
                      You can change availability later.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) =>
                      updateField("isActive", event.target.checked)
                    }
                    className="h-4 w-4 accent-indigo-600"
                  />
                </div>

                <div className="flex gap-2 border-t pt-3" style={{ borderColor: "var(--admin-card-border)" }}>
                  <Button
                    type="button"
                    onClick={closeDialog}
                    disabled={submitting}
                    className="h-9 flex-1 !px-3 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="h-9 flex-1 !px-3 text-xs"
                  >
{submitting
  ? editingPromo
    ? "Saving..."
    : "Creating..."
  : editingPromo
    ? "Save changes"
    : "Create code"}
                  </Button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>
    </DashboardPageLayout>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="min-w-0 rounded-lg border px-2 py-2.5 sm:px-3 sm:py-3"
      style={{
        background: "var(--admin-card-bg)",
        borderColor: "var(--admin-card-border)",
        boxShadow: "var(--admin-card-shadow)",
      }}
    >
      <div
        className="mb-1.5 flex items-center gap-1.5"
        style={{ color: "var(--admin-muted)" }}
      >
        {icon}
        <span className="truncate text-[9px] sm:text-[11px]">{label}</span>
      </div>
      <p
        className="text-base font-semibold tabular-nums sm:text-xl"
        style={{ color: "var(--admin-title)" }}
      >
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="whitespace-nowrap px-3 py-2.5 text-left text-[10px] font-semibold"
      style={{
        color: "var(--admin-table-header-text)",
      }}
    >
      {children}
    </th>
  );
}

function TableCell({ children }: { children: React.ReactNode }) {
  return (
    <td
      className="border-t px-3 py-3 text-xs"
      style={{
        color: "var(--admin-table-text)",
        borderColor: "var(--admin-table-border)",
      }}
    >
      {children}
    </td>
  );
}

function CompactInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="min-w-0 rounded-md border px-2 py-1.5"
      style={{
        background: "var(--admin-table-header-bg)",
        borderColor: "var(--admin-card-border)",
      }}
    >
      <p
        className="text-[8px] sm:text-[9px]"
        style={{ color: "var(--admin-muted)" }}
      >
        {label}
      </p>
      <p
        className="mt-0.5 truncate text-[10px] font-semibold sm:text-xs"
        style={{ color: "var(--admin-text)" }}
      >
        {value}
      </p>
    </div>
  );
}
