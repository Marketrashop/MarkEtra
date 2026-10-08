"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import useExperience from "@/components/ui/ExperienceOverlay/useExperience";
import DashboardPageLayout from "@/components/dashboard/DashboardPage";
import { useCartContext } from "@/context/CartContext";
import { useCheckout } from "@/context/CheckoutContext";
import type { Address } from "@/types/address.types";
import type { DepositMethod } from "@/components/Deposit/deposit.types";
import type { CheckoutInitialData, CheckoutDeliveryDetails, CheckoutPaymentMethod as CheckoutPaymentMethodType } from "@/types/checkout.types";
import CheckoutDeliveryForm from "./CheckoutDeliveryForm";
import CheckoutPaymentMethod from "./CheckoutPaymentMethod";
import CheckoutWalletPayment from "./CheckoutWalletPayment";
import CheckoutCryptoPayment from "./CheckoutCryptoPayment";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import CheckoutSubmitButton from "./CheckoutSubmitButton";

type CheckoutPageProps = {
  initialData?: CheckoutInitialData;
};

const EMPTY_DELIVERY: CheckoutDeliveryDetails = {
  fullName: "",
  phoneNumber: "",
  alternatePhoneNumber: null,
  addressLine1: "",
  addressLine2: null,
  city: "",
  state: null,
  country: "",
  postalCode: null,
};

export default function CheckoutPage({
  initialData,
}: CheckoutPageProps) {

const router =
  useRouter();

const {
  showExperience,
} = useExperience();

  const {
    cart,
    loading: cartLoading,
    refresh: refreshCart,
  } = useCartContext();

const {
  mode,
  directItem,
  clearCheckout,
} = useCheckout();

  const [
    loading,
    setLoading,
  ] = useState(!initialData);

  const [
    addresses,
    setAddresses,
  ] = useState<Address[]>(
    initialData?.addresses ?? [],
  );

  const [
    selectedAddressId,
    setSelectedAddressId,
  ] = useState<string | null>(
    initialData?.primaryAddress?.id ??
      null,
  );

  const [
    useNewAddress,
    setUseNewAddress,
  ] = useState(
    !initialData?.primaryAddress,
  );

  const [
    delivery,
    setDelivery,
  ] =
    useState<CheckoutDeliveryDetails>(
      initialData?.primaryAddress
        ? mapAddressToDelivery(
            initialData.primaryAddress,
          )
        : EMPTY_DELIVERY,
    );

  const [
    saveAsPrimary,
    setSaveAsPrimary,
  ] = useState(false);

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<CheckoutPaymentMethodType>(
      "WALLET",
    );

  const [
    walletBalance,
    setWalletBalance,
  ] = useState(
    initialData?.walletBalance ?? 0,
  );

  const [
    depositMethods,
    setDepositMethods,
  ] = useState<DepositMethod[]>(
    initialData?.depositMethods ?? [],
  );

  const [
    selectedDepositMethodId,
    setSelectedDepositMethodId,
  ] = useState<string | null>(
    initialData?.depositMethods[0]?.id ??
      null,
  );

  const [
    receiptFile,
    setReceiptFile,
  ] = useState<File | null>(null);

  const [
    receiptUrl,
    setReceiptUrl,
  ] = useState<string | null>(null);

  const [
    uploadingReceipt,
    setUploadingReceipt,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    notes,
    setNotes,
  ] = useState("");

  const loadCheckout =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await fetch(
            "/api/checkout",
            {
              cache: "no-store",
              credentials: "include",
            },
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.error ??
              "Unable to load checkout.",
          );
        }

        const data =
          result.data as CheckoutInitialData;

        setAddresses(
          data.addresses,
        );

        setWalletBalance(
          data.walletBalance,
        );

        setDepositMethods(
          data.depositMethods,
        );

        if (data.primaryAddress) {
          setSelectedAddressId(
            data.primaryAddress.id,
          );

          setUseNewAddress(
            false,
          );

          setDelivery(
            mapAddressToDelivery(
              data.primaryAddress,
            ),
          );
        } else {
          setSelectedAddressId(
            null,
          );

          setUseNewAddress(true);

          setDelivery(
            EMPTY_DELIVERY,
          );
        }

        setSelectedDepositMethodId(
          (current) =>
            data.depositMethods.some(
              (method) =>
                method.id === current,
            )
              ? current
              : data.depositMethods[0]
                  ?.id ?? null,
        );
      } catch (error) {
        console.error(
          "Checkout load error:",
          error,
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load checkout.",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    if (!initialData) {
      void loadCheckout();
    }
  }, [
    initialData,
    loadCheckout,
  ]);

  const selectedAddress =
    useMemo(
      () =>
        addresses.find(
          (address) =>
            address.id ===
            selectedAddressId,
        ) ?? null,
      [
        addresses,
        selectedAddressId,
      ],
    );

  const selectedDepositMethod =
    useMemo(
      () =>
        depositMethods.find(
          (method) =>
            method.id ===
            selectedDepositMethodId,
        ) ?? null,
      [
        depositMethods,
        selectedDepositMethodId,
      ],
    );

const isDirectCheckout =
  mode === "direct" &&
  directItem !== null;

const includeCart =
  isDirectCheckout &&
  directItem.includeCart;

const directCheckoutItem =
  isDirectCheckout &&
  directItem
    ? {
        id: "direct",

        quantity:
          directItem.quantity,

        unitPrice:
          directItem.unitPrice,

        product: {
          name:
            directItem.productName,

          price:
            directItem.unitPrice,

          images: [
            {
              id: "direct",

              imageKey:
                directItem.imageKey,

              imageUrl:
                directItem.imageUrl,

              altText: null,

              isPrimary: true,

              sortOrder: 0,
            },
          ],
        },

        variant: {
          label:
            directItem.variantLabel,

          imageKey:
            directItem.imageKey,

          imageUrl:
            directItem.imageUrl,
        },

        size:
          directItem.size,
      }
    : null;

const cartCheckoutItems =
  cart?.items.map(
    (item) => ({
      id: item.id,

      quantity:
        item.quantity,

      unitPrice:
        item.variantSize.price ??
        item.product.price,

      product: {
        name:
          item.product.name,

        price:
          item.product.price,

        images:
          item.product.images,
      },

      variant: {
        label:
          item.variantSize.variant.label,

        imageKey:
          item.variantSize.variant.imageKey,

        imageUrl:
          item.variantSize.variant.imageUrl,
      },

      size:
        item.variantSize.size,
    }),
  ) ?? [];

const checkoutItems =
  !isDirectCheckout
    ? cartCheckoutItems
    : directItem.includeCart
      ? [
          ...cartCheckoutItems,
          directCheckoutItem!,
        ]
      : [
          directCheckoutItem!,
        ];

const cartSubtotal =
  cart?.summary.subtotal ?? 0;

const directSubtotal =
  isDirectCheckout && directItem
    ? directItem.unitPrice *
      directItem.quantity
    : 0;

const checkoutSubtotal =
  !isDirectCheckout
    ? cartSubtotal
    : directItem.includeCart
      ? cartSubtotal +
        directSubtotal
      : directSubtotal;

const checkoutSavings =
  !isDirectCheckout
    ? cart?.summary.savings ?? 0
    : directItem.includeCart
      ? cart?.summary.savings ?? 0
      : 0;

const checkoutTotal =
  checkoutSubtotal;

const walletCanPay =
  walletBalance >=
  checkoutTotal;

const hasDeliveryDetails =
  useNewAddress
    ? Boolean(
        delivery.fullName?.trim() &&
          delivery.phoneNumber?.trim() &&
          delivery.addressLine1?.trim() &&
          delivery.city?.trim() &&
          delivery.country?.trim(),
      )
    : Boolean(
        selectedAddressId &&
          selectedAddress,
      );

  const canSubmit =
    hasDeliveryDetails &&
    (paymentMethod === "WALLET"
      ? walletCanPay
      : Boolean(
          selectedDepositMethod &&
            receiptUrl,
        ));

  async function handleReceiptUpload(
    file: File,
  ) {
    try {
      setUploadingReceipt(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file,
      );

      const response =
        await fetch(
          "/api/upload/deposit-receipt",
          {
            method: "POST",
            body: formData,
          },
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ??
            "Receipt upload failed.",
        );
      }

      setReceiptFile(file);
      setReceiptUrl(
        result.data.secureUrl,
      );

      toast.success(
        "Receipt uploaded successfully.",
      );
    } catch (error) {
      console.error(
        "Receipt upload error:",
        error,
      );

      setReceiptFile(null);
      setReceiptUrl(null);

      toast.error(
        error instanceof Error
          ? error.message
          : "Receipt upload failed.",
      );
    } finally {
      setUploadingReceipt(false);
    }
  }

  function handleSelectAddress(
    address: Address,
  ) {
    setSelectedAddressId(
      address.id,
    );

    setUseNewAddress(false);

    setDelivery(
      mapAddressToDelivery(
        address,
      ),
    );

    setSaveAsPrimary(false);
  }

  function handleNewAddress() {
    setSelectedAddressId(
      null,
    );

    setUseNewAddress(true);

    setDelivery(
      EMPTY_DELIVERY,
    );

    setSaveAsPrimary(false);
  }

function handlePaymentMethodChange(
  method: CheckoutPaymentMethodType,
) {
    setPaymentMethod(
      method,
    );

    if (method === "WALLET") {
      setReceiptFile(null);
      setReceiptUrl(null);
    }
  }

  function handleCryptoMethodChange(
    methodId: string,
  ) {
    setSelectedDepositMethodId(
      methodId,
    );

    setReceiptFile(null);
    setReceiptUrl(null);
  }

  function handleBlockedSubmit() {
    if (!hasDeliveryDetails) {
      toast.error(
        "Complete your delivery details first.",
      );

      return;
    }

    if (
      paymentMethod ===
      "WALLET"
    ) {
      toast.error(
        "Your wallet balance is insufficient for this order.",
      );

      return;
    }

    if (!selectedDepositMethod) {
      toast.error(
        "Select a cryptocurrency payment method.",
      );

      return;
    }

    if (!receiptUrl) {
      toast.error(
        "Upload your payment receipt before confirming payment.",
      );
    }
  }

  async function handleSubmit() {
    if (submitting) {
      return;
    }

if (
  !isDirectCheckout &&
  (
    !cart ||
    cart.items.length === 0
  )
) {
      toast.error(
        "Your cart is empty.",
      );

      return;
    }

    if (!hasDeliveryDetails) {
      toast.error(
        "Complete your delivery details first.",
      );

      return;
    }

    if (
      paymentMethod ===
        "WALLET" &&
      !walletCanPay
    ) {
      toast.error(
        "Your wallet balance is insufficient.",
      );

      return;
    }

    if (
      paymentMethod ===
        "CRYPTO" &&
      !selectedDepositMethod
    ) {
      toast.error(
        "Select a cryptocurrency payment method.",
      );

      return;
    }

    if (
      paymentMethod ===
        "CRYPTO" &&
      !receiptUrl
    ) {
      toast.error(
        "Upload your payment receipt first.",
      );

      return;
    }

try {
  setSubmitting(true);

  const response =
    await fetch(
      "/api/checkout",
      {
            method: "POST",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

body: JSON.stringify({
mode:
  isDirectCheckout &&
  !directItem.includeCart
    ? "DIRECT"
    : "CART",

...(isDirectCheckout && {
  productId:
    directItem.productId,

  variantSizeId:
    directItem.variantSizeId,

  quantity:
    directItem.quantity,

  includeCart:
    directItem.includeCart,
}),

  paymentMethod,

  addressSource:
    useNewAddress
      ? {
          type: "NEW",
          details: delivery,
          saveAsPrimary,
        }
      : {
          type: "SAVED",
          addressId:
            selectedAddressId!,
        },

  ...(paymentMethod ===
  "CRYPTO"
    ? {
        depositMethodId:
          selectedDepositMethodId,

        receiptUrl,
      }
    : {}),

  notes:
    notes.trim() ||
    null,
}),
          },
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ??
            "Unable to place order.",
        );
      }

if (!isDirectCheckout) {
  await refreshCart();
}

if (isDirectCheckout) {
  clearCheckout();
}

showExperience({
  title:
    "Order Confirmed",

  description:
    paymentMethod === "WALLET"
      ? "Your order has been placed successfully. We'll keep you updated as it progresses."
      : "Your payment has been submitted successfully and is awaiting review before your order is processed.",

  status:
    paymentMethod === "WALLET"
      ? "Preparing your orders..."
      : "Reviewing your payment...",

  onComplete: () => {
    router.push(
      "/orders",
    );
  },
});
    } catch (error) {
      console.error(
        "Checkout submission error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to place order.",
      );
    } finally {
      setSubmitting(false);
    }
  }



  if (
    loading ||
    cartLoading
  ) {
    return (
      <DashboardPageLayout
        environment="user"
        breadcrumb={[
          {
            label: "Checkout",
          },
        ]}
      >
        <div
          className="
            flex
            min-h-[280px]
            items-center
            justify-center
          "
        >
          <Loader2
            size={22}
            className="animate-spin text-[var(--primary)]"
          />
        </div>
      </DashboardPageLayout>
    );
  }

if (
  !isDirectCheckout &&
  (
    !cart ||
    cart.items.length === 0
  )
) {
    return (
      <DashboardPageLayout
        environment="user"
        breadcrumb={[
          {
            label: "Checkout",
          },
        ]}
      >
        <div
          className="
            mx-auto
            w-full
            max-w-xl
            rounded-xl
            border
            border-[var(--user-card-border)]
            bg-[var(--user-card-bg)]
            px-5
            py-8
            text-center
            shadow-[var(--user-card-shadow)]
          "
        >
          <h1
            className="
              text-sm
              font-semibold
              text-[var(--user-title)]
            "
          >
            Your cart is empty
          </h1>

          <p
            className="
              mt-1.5
              text-xs
              leading-5
              text-[var(--user-text-muted)]
            "
          >
            Add a product to your cart before
            proceeding to checkout.
          </p>
        </div>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout
      environment="user"
      breadcrumb={[
        {
          label: "Checkout",
        },
      ]}
    >
      <div
        className="
          mx-auto
          w-full
          max-w-6xl
          pb-16
        "
      >
        <div
          className="
            grid
            gap-4
            lg:grid-cols-[minmax(0,1fr)_360px]
            lg:items-start
          "
        >
          <div
            className="
              min-w-0
              space-y-4
            "
          >
            <CheckoutDeliveryForm
              addresses={
                addresses
              }
              selectedAddressId={
                selectedAddressId
              }
              useNewAddress={
                useNewAddress
              }
              delivery={
                delivery
              }
              saveAsPrimary={
                saveAsPrimary
              }
              onSelectAddress={
                handleSelectAddress
              }
              onNewAddress={
                handleNewAddress
              }
              onDeliveryChange={
                setDelivery
              }
              onSaveAsPrimaryChange={
                setSaveAsPrimary
              }
            />

            <CheckoutPaymentMethod
              value={
                paymentMethod
              }
              onChange={
                handlePaymentMethodChange
              }
            />

            {paymentMethod ===
              "WALLET" && (
              <CheckoutWalletPayment
                balance={
                  walletBalance
                }
                total={
                  checkoutTotal
                }
                canPay={
                  walletCanPay
                }
              />
            )}

            {paymentMethod ===
              "CRYPTO" && (
              <CheckoutCryptoPayment
                methods={
                  depositMethods
                }
                selectedMethodId={
                  selectedDepositMethodId
                }
                onMethodChange={
                  handleCryptoMethodChange
                }
                receiptFile={
                  receiptFile
                }
                receiptUrl={
                  receiptUrl
                }
                uploadingReceipt={
                  uploadingReceipt
                }
                onReceiptUpload={
                  handleReceiptUpload
                }
                total={
                  checkoutTotal
                }
              />
            )}

            <section
              className="
                rounded-xl
                border
                border-[var(--user-card-border)]
                bg-[var(--user-card-bg)]
                p-4
                shadow-[var(--user-card-shadow)]
              "
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
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-[var(--user-text-muted)]
                    "
                  >
                    Notes
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-[var(--user-text-muted)]
                    "
                  >
                    Optional order note.
                  </p>
                </div>

                <span
                  className="
                    text-[10px]
                    text-[var(--user-text-muted)]
                  "
                >
                  {notes.length}/1000
                </span>
              </div>

              <textarea
                value={
                  notes
                }
                onChange={(
                  event,
                ) =>
                  setNotes(
                    event.target
                      .value,
                  )
                }
                maxLength={
                  1000
                }
                rows={3}
                placeholder="Add a delivery note..."
                className="
                  mt-3
                  w-full
                  resize-none
                  rounded-lg
                  border
                  border-[var(--user-card-border)]
                  bg-[var(--user-card-bg)]
                  px-3
                  py-2.5
                  text-sm
                  text-[var(--user-title)]
                  outline-none
                  placeholder:text-[var(--user-text-muted)]
                  focus:border-[var(--primary)]
                "
              />
            </section>
          </div>

          <div
            className="
              min-w-0
            "
          >
<CheckoutOrderSummary
  items={
    checkoutItems
  }
  subtotal={
    checkoutSubtotal
  }
  savings={
    checkoutSavings
  }
  total={
    checkoutTotal
  }
/>

            <div
              className="
                mt-3
                rounded-xl
                border
                border-[var(--user-card-border)]
                bg-[var(--user-card-bg)]
                p-3
                shadow-[var(--user-card-shadow)]
                lg:sticky
                lg:top-[calc(1rem+210px)]
              "
            >
              <CheckoutSubmitButton
                paymentMethod={
                  paymentMethod
                }
                canSubmit={
                  canSubmit
                }
                submitting={
                  submitting
                }
                onSubmit={
                  () => {
                    void handleSubmit();
                  }
                }
                onBlocked={
                  handleBlockedSubmit
                }
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  );
}

function mapAddressToDelivery(
  address: Address,
): CheckoutDeliveryDetails {
  return {
    fullName:
      address.fullName,

    phoneNumber:
      address.phoneNumber,

    alternatePhoneNumber:
      address.alternatePhoneNumber,

    addressLine1:
      address.addressLine1,

    addressLine2:
      address.addressLine2,

    city:
      address.city,

    state:
      address.state,

    country:
      address.country,

    postalCode:
      address.postalCode,
  };
}