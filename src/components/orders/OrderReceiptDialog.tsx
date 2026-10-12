"use client";

import { useEffect } from "react";

import { Download, FileText, Loader2, Printer, X } from "lucide-react";

import { useReceiptExport } from "@/lib/receipt-export";

type ReceiptItem = {
  id: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  selectedColor: string | null;
  selectedSize: string | null;
  product: {
    name: string;
    primaryImage: string | null;
  };
};

export type OrderReceiptData = {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: "WALLET" | "CRYPTO";
  subtotal: string;
  discount: string;
  total: string;
  createdAt: string;
  paidAt: string | null;
  delivery: {
    fullName: string | null;
    phoneNumber: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    postalCode: string | null;
  };
  cryptoDeposit: {
    reference: string;
    depositMethod: {
      symbol: string;
    };
  } | null;
  items: ReceiptItem[];
};

function formatMoney(value: string | number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function OrderReceiptDialog({
  order,
  onClose,
}: {
  order: OrderReceiptData;
  onClose: () => void;
}) {
  const fileBaseName = `receipt-${order.orderNumber.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const {
    receiptRef,
    busy,
    preparing,
    imageViewerUrl,
    closeImageViewer,
    saveImage,
    sharePdf,
  } = useReceiptExport(fileBaseName);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      if (imageViewerUrl) {
        closeImageViewer();
      } else {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [imageViewerUrl, closeImageViewer, onClose]);

  const address = [
    order.delivery.addressLine1,
    order.delivery.addressLine2,
    order.delivery.city,
    order.delivery.state,
    order.delivery.country,
    order.delivery.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  const paymentLabel =
    order.paymentMethod === "CRYPTO"
      ? `Crypto${order.cryptoDeposit?.depositMethod.symbol ? ` · ${order.cryptoDeposit.depositMethod.symbol}` : ""}`
      : "Wallet balance";

  const discount = Number(order.discount);
  const isRefunded = order.paymentStatus === "REFUNDED";
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="order-receipt-overlay fixed inset-0 z-[200] overflow-y-auto overscroll-contain bg-slate-950/60 backdrop-blur-sm">
      <style>{`@media print { body * { visibility: hidden !important; } .order-receipt-print, .order-receipt-print * { visibility: visible !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } .order-receipt-print { position: absolute !important; inset: 0 auto auto 0 !important; width: 100% !important; max-width: none !important; margin: 0 !important; border: 0 !important; box-shadow: none !important; } .order-receipt-no-print { display: none !important; } @page { size: A4; margin: 14mm; } }`}</style>

      <div className="flex min-h-full justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-6">
        <div className="my-auto w-full max-w-2xl">
          <div className="order-receipt-no-print mb-3 flex items-center justify-between gap-3 text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">Order receipt</p>
              <p className="mt-0.5 text-sm text-white/80">Review, save as an image, or share as PDF</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close receipt" className="rounded-full border border-white/25 p-2 text-white transition hover:bg-white/10"><X size={18} /></button>
          </div>

          <article ref={receiptRef} className="order-receipt-print overflow-hidden rounded-2xl border border-blue-100 bg-white text-slate-900 shadow-2xl">
            <header className="relative overflow-hidden px-5 py-6 text-white sm:px-8 sm:py-8" style={{ backgroundColor: "#06067e" }}>
              <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border-[28px] border-white/10" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">MarketSparks</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Receipt</h2>
                  <p className="mt-1 text-xs text-white/80">Order summary and payment record</p>
                </div>
                <div className="max-w-[11rem] rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-right">
                  <p className="text-[9px] uppercase tracking-[0.14em] text-white/80">Order no.</p>
                  <p className="mt-1 break-all text-xs font-bold">{order.orderNumber}</p>
                </div>
              </div>
            </header>

            <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Delivery details</p>
                  <p className="mt-2 break-words text-sm font-semibold">{order.delivery.fullName || "Not provided"}</p>
                  {order.delivery.phoneNumber && <p className="mt-1 break-words text-xs text-slate-600">{order.delivery.phoneNumber}</p>}
                  <p className="mt-1 break-words text-xs text-slate-600">{address || "No address provided"}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Order details</p>
                  <p className="mt-2 text-sm font-semibold">{formatDateTime(order.createdAt)}</p>
                  <p className="mt-1 break-words text-xs text-slate-600">Payment: {paymentLabel}</p>
                  {order.cryptoDeposit && <p className="mt-1 break-all text-xs text-slate-600">Reference: {order.cryptoDeposit.reference}</p>}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-800">{formatLabel(order.status)}</span>
                    <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-800">{formatLabel(order.paymentStatus)}</span>
                  </div>
                </div>
              </div>

              <section>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Item summary · {order.items.length} {order.items.length === 1 ? "item" : "items"}
                </p>
                <div className="rounded-xl border border-slate-200 px-3 sm:px-4">
                  {order.items.map((item, index) => (
                    <div key={item.id} className={`flex items-center gap-3 py-3 sm:gap-4 ${index > 0 ? "border-t border-slate-100" : ""}`}>
                      {item.product.primaryImage ? (
                        <img src={item.product.primaryImage} alt={item.product.name} crossOrigin="anonymous" className="h-16 w-16 shrink-0 rounded-lg border border-slate-100 bg-slate-50 object-contain p-1" />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700">ITEM</div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-semibold">{item.product.name}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          Qty {item.quantity}
                          {item.selectedSize && ` · ${item.selectedSize}`}
                          {item.selectedColor && ` · ${item.selectedColor}`}
                          {` · ${formatMoney(item.unitPrice)} each`}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-bold text-slate-900">{formatMoney(item.totalPrice)}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-800">Financial summary</p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between gap-3 text-sm"><span className="text-slate-600">Subtotal</span><span className="font-semibold">{formatMoney(order.subtotal)}</span></div>
                  <div className="flex items-center justify-between gap-3 text-sm"><span className="text-slate-600">Discount</span><span className="font-semibold">{discount > 0 ? `-${formatMoney(discount)}` : formatMoney(0)}</span></div>
                  {order.paidAt && <div className="flex items-center justify-between gap-3 text-sm"><span className="text-slate-600">Paid on</span><span className="text-right font-semibold">{formatDateTime(order.paidAt)}</span></div>}
                  <div className="border-t border-blue-200 pt-3">
                    <div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-slate-700">Order total</span><span className="text-right text-base font-bold text-blue-800">{formatMoney(order.total)}</span></div>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm"><span className="text-slate-600">Payment status</span><span className="text-right font-semibold text-blue-800">{formatLabel(order.paymentStatus)}</span></div>
                </div>
              </section>

              <footer className="border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
                <p>This document records the order and payment details available at the time it was generated.</p>
                <p className="mt-1 font-medium text-slate-600">Generated on {new Date().toLocaleString()}</p>
                {isRefunded && <p className="mt-2 text-blue-800">This order was cancelled and its amount was returned to your wallet.</p>}
                {!isRefunded && isCancelled && <p className="mt-2 text-blue-800">This order was cancelled.</p>}
                {!isRefunded && !isCancelled && order.paymentStatus !== "PAID" && <p className="mt-2 text-blue-800">Payment for this order has not been confirmed. This receipt is not proof of payment.</p>}
              </footer>
            </div>
          </article>

          <div className="order-receipt-no-print mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">Close</button>

            <button type="button" onClick={() => window.print()} className="hidden items-center justify-center gap-2 rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:inline-flex">
              <Printer size={16} />
              Print
            </button>

            <button type="button" onClick={sharePdf} disabled={busy !== null || preparing} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60">
              {busy === "pdf" || preparing ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
              {preparing ? "Preparing..." : busy === "pdf" ? "Opening share..." : "Share PDF"}
            </button>

            <button type="button" onClick={saveImage} disabled={busy !== null || preparing} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-blue-800 shadow transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60">
              {busy === "image" || preparing ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {preparing ? "Preparing..." : busy === "image" ? "Opening..." : "Save as image"}
            </button>
          </div>
        </div>
      </div>

      {imageViewerUrl && (
        <div className="order-receipt-no-print fixed inset-0 z-[210] flex flex-col bg-black/90 p-4" role="dialog" aria-modal="true" aria-label="Receipt image">
          <div className="mb-3 flex items-start justify-between gap-3 text-white">
            <p className="text-sm leading-5 text-white/90">
              Press and hold the image, then choose <span className="font-semibold">Save to Photos</span> (iPhone) or <span className="font-semibold">Download image</span> (Android).
            </p>
            <button type="button" onClick={closeImageViewer} aria-label="Close image" className="shrink-0 rounded-full border border-white/25 p-2 text-white transition hover:bg-white/10"><X size={18} /></button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            <img src={imageViewerUrl} alt={`Receipt ${order.orderNumber}`} className="mx-auto h-auto w-full max-w-2xl rounded-lg bg-white" />
          </div>
        </div>
      )}
    </div>
  );
}
