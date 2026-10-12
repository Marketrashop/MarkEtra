"use client";

import { useEffect, useRef, useState } from "react";

import { toast } from "sonner";

type ReceiptRender = {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
};

export function isTouchDevice() {
  if (typeof navigator === "undefined" || typeof window === "undefined") {
    return false;
  }

  return (
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(max-width: 768px)").matches
  );
}

export function canShareFile(file: File) {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  );
}

export function shareUnavailableReason() {
  if (!window.isSecureContext) {
    return "Sharing needs a secure HTTPS page. Open the https:// version of the site.";
  }

  return "This browser can't share files.";
}

// Safari/WebKit often renders images blank on the first capture.
function needsRenderWarmUp() {
  const ua = navigator.userAgent;

  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const isSafari = /^((?!chrome|crios|android).)*safari/i.test(ua);

  return isIOS || isSafari;
}

function dataUrlToBlob(dataUrl: string) {
  const [header, body] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/png";
  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mime });
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

async function waitForImages(node: HTMLElement) {
  await Promise.all(
    Array.from(node.querySelectorAll("img")).map((image) =>
      image.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            image.onload = () => resolve();
            image.onerror = () => resolve();
          }),
    ),
  );
}

async function renderReceiptToPng(
  node: HTMLElement | null,
): Promise<ReceiptRender> {
  if (!node) {
    throw new Error("Receipt is not ready yet.");
  }

  const { toPng } = await import("html-to-image");

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  await waitForImages(node);

  const options = {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    style: {
      borderRadius: "0",
      boxShadow: "none",
    },
  };

  if (needsRenderWarmUp()) {
    await toPng(node, options);
  }

  const dataUrl = await toPng(node, options);

  return {
    blob: dataUrlToBlob(dataUrl),
    dataUrl,
    width: node.offsetWidth,
    height: node.offsetHeight,
  };
}

/**
 * Attach `receiptRef` to the receipt element. The image and PDF are prepared
 * in the background so the phone share sheet can open instantly on tap.
 */
export function useReceiptExport(fileBaseName: string) {
  const receiptRef = useRef<HTMLElement | null>(null);
  const renderRef = useRef<Promise<ReceiptRender> | null>(null);
  const pdfRef = useRef<Promise<Blob> | null>(null);

  const [busy, setBusy] = useState<"image" | "pdf" | null>(null);
  const [status, setStatus] = useState<"preparing" | "ready" | "failed">(
    "preparing",
  );
  const [imageViewerUrl, setImageViewerUrl] = useState<string | null>(null);

  function ensureRender(): Promise<ReceiptRender> {
    if (!renderRef.current) {
      renderRef.current = renderReceiptToPng(receiptRef.current).catch(
        (error) => {
          renderRef.current = null;
          throw error;
        },
      );
    }

    return renderRef.current;
  }

  function ensurePdf(): Promise<Blob> {
    if (!pdfRef.current) {
      pdfRef.current = ensureRender()
        .then(async ({ dataUrl, width, height }) => {
          const { jsPDF } = await import("jspdf");

          // One page sized to the receipt, so nothing is ever cut off.
          const pdf = new jsPDF({
            orientation: width > height ? "landscape" : "portrait",
            unit: "px",
            format: [width, height],
            hotfixes: ["px_scaling"],
          });

          pdf.addImage(dataUrl, "PNG", 0, 0, width, height);

          return pdf.output("blob");
        })
        .catch((error) => {
          pdfRef.current = null;
          throw error;
        });
    }

    return pdfRef.current;
  }

  useEffect(() => {
    let cancelled = false;

    const timer = window.setTimeout(() => {
      ensureRender()
        .then(() => ensurePdf())
        .then(() => {
          if (!cancelled) setStatus("ready");
        })
        .catch(() => {
          if (!cancelled) setStatus("failed");
        });
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveImage() {
    if (busy) return;

    setBusy("image");

    try {
      const { blob, dataUrl } = await ensureRender();
      const fileName = `${fileBaseName}.png`;
      const file = new File([blob], fileName, { type: "image/png" });
      const touch = isTouchDevice();

      if (touch && canShareFile(file)) {
        // Share sheet: iPhone shows "Save Image" (goes to Photos).
        try {
          await navigator.share({ files: [file], title: fileBaseName });

          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }

          console.error("Image share failed:", error);
          toast.error(
            `Share failed (${error instanceof Error ? error.name : "unknown error"}).`,
          );
        }
      } else if (touch) {
        toast.info(shareUnavailableReason());
      }

      if (touch) {
        // Press and hold the image to save it to the gallery.
        setImageViewerUrl(dataUrl);
        return;
      }

      downloadBlob(blob, fileName);
      toast.success("Receipt image saved.");
    } catch (error) {
      console.error("Receipt image error:", error);
      toast.error("Unable to create the receipt image. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  async function sharePdf() {
    if (busy) return;

    setBusy("pdf");

    try {
      const pdfBlob = await ensurePdf();
      const fileName = `${fileBaseName}.pdf`;
      const file = new File([pdfBlob], fileName, { type: "application/pdf" });
      const touch = isTouchDevice();

      if (touch && canShareFile(file)) {
        try {
          await navigator.share({ files: [file], title: fileBaseName });

          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }

          console.error("PDF share failed:", error);
          toast.error(
            `Share failed (${error instanceof Error ? error.name : "unknown error"}).`,
          );
        }
      } else if (touch) {
        toast.info(shareUnavailableReason());
      }

      downloadBlob(pdfBlob, fileName);
      toast.success("Receipt PDF downloaded.");
    } catch (error) {
      console.error("Receipt PDF error:", error);
      toast.error("Unable to create the receipt PDF. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  return {
    receiptRef,
    busy,
    preparing: status === "preparing",
    imageViewerUrl,
    closeImageViewer: () => setImageViewerUrl(null),
    saveImage,
    sharePdf,
  };
}