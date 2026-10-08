"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { toast } from "sonner";

import { getCloudinaryImageUrl } from "@/lib/cloudinary";

import { DashboardPage } from "@/components/dashboard";

import type {
  DepositHistoryItem,
  DepositMethod as DepositMethodType,
} from "./deposit.types";

import DepositBalance from "./DepositBalance";
import DepositMethod from "./DepositMethod";
import DepositMethodCard from "./DepositMethodCard";
import DepositAmount from "./DepositAmount";
import DepositSummary from "./DepositSummary";
import DepositAction from "./DepositAction";
import DepositHistory from "./DepositHistory";
import DepositReceiptModal from "./DepositReceiptModal";

import useExperience from "@/components/ui/ExperienceOverlay/useExperience";

export default function DepositPage() {
  const [
    selectedMethod,
    setSelectedMethod,
  ] = useState<DepositMethodType | null>(
    null,
  );

  const {
    showExperience,
  } = useExperience();

  const [
    methods,
    setMethods,
  ] = useState<DepositMethodType[]>(
    [],
  );

  const [
    loadingMethods,
    setLoadingMethods,
  ] = useState(true);

  const [amount, setAmount] =
    useState(0);

  const [
    receipt,
    setReceipt,
  ] = useState<File | null>(null);

  const [
    receiptModalOpen,
    setReceiptModalOpen,
  ] = useState(false);

  const [
    deposits,
    setDeposits,
  ] = useState<DepositHistoryItem[]>(
    [],
  );

  const [
    walletBalance,
    setWalletBalance,
  ] = useState(0);

  const [
    ,
    setLoadingDeposits,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const gatewayFee = 0;

  const bonus = 0;

  const loadMethods = useCallback(
    async () => {
      try {
        setLoadingMethods(true);

        const response = await fetch(
          "/api/deposit-methods",
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error();
        }

        const result =
          await response.json();

        setMethods(
          result.data.map(
            (method: any) => ({
              id: method.id,
              name: method.name,
              symbol: method.symbol,
              address:
                method.walletAddress,
              icon:
                getCloudinaryImageUrl(
                  method.iconKey,
                ) ?? "",
              qrCode:
                getCloudinaryImageUrl(
                  method.qrCodeKey,
                ) ?? "",
            }),
          ),
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Unable to load deposit methods.",
        );
      } finally {
        setLoadingMethods(false);
      }
    },
    [],
  );

  const loadDeposits = useCallback(
    async () => {
      try {
        setLoadingDeposits(true);

        const response =
          await fetch(
            "/api/deposits/my",
            {
              cache: "no-store",
            },
          );

        if (!response.ok) {
          throw new Error();
        }

        const result =
          await response.json();

        setWalletBalance(
          Number(
            result.wallet
              ?.availableBalance ?? 0,
          ),
        );

        setDeposits(
          result.data.map(
            (deposit: any) => ({
              id: deposit.id,

              amount: Number(
                deposit.amount,
              ),

              createdAt:
                deposit.createdAt,

              reference:
                deposit.reference,

              method: {
                id:
                  deposit.depositMethod
                    .id,

                name:
                  deposit.depositMethod
                    .name,

                symbol:
                  deposit.depositMethod
                    .symbol,

                address:
                  deposit.depositMethod
                    .walletAddress,

                icon:
                  getCloudinaryImageUrl(
                    deposit.depositMethod
                      .iconKey,
                  ) ?? "",

                qrCode:
                  getCloudinaryImageUrl(
                    deposit.depositMethod
                      .qrCodeKey,
                  ) ?? "",
              },

              status:
                deposit.status ===
                "APPROVED"
                  ? "successful"
                  : deposit.status ===
                      "REJECTED"
                    ? "failed"
                    : "pending",
            }),
          ),
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Unable to load deposits.",
        );
      } finally {
        setLoadingDeposits(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadMethods();
    loadDeposits();
  }, [
    loadMethods,
    loadDeposits,
  ]);

  const uploadReceipt =
    useCallback(
      async (file: File) => {
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

        return result.data
          .secureUrl as string;
      },
      [],
    );

  const createDeposit =
    useCallback(
      async (
        receiptUrl: string,
      ) => {
        const response =
          await fetch(
            "/api/deposits/create",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                amount,

                depositMethodId:
                  selectedMethod?.id,

                receiptUrl,
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
              "Unable to create deposit.",
          );
        }

        return result.data;
      },
      [
        amount,
        selectedMethod,
      ],
    );

  const summary =
    useMemo(
      () => ({
        method:
          selectedMethod?.name ?? "",

        amount,

        gatewayFee,

        bonus,

        totalCredit:
          amount -
          gatewayFee +
          bonus,
      }),
      [
        selectedMethod,
        amount,
        gatewayFee,
        bonus,
      ],
    );

  const handleDepositSubmit =
    useCallback(
      async () => {
        if (
          submitting ||
          !receipt ||
          !selectedMethod
        ) {
          return;
        }

        try {
          setSubmitting(true);

          toast.loading(
            "Uploading receipt...",
            {
              id: "deposit",
            },
          );

          const receiptUrl =
            await uploadReceipt(
              receipt,
            );

          toast.loading(
            "Submitting deposit...",
            {
              id: "deposit",
            },
          );

          await createDeposit(
            receiptUrl,
          );

          await loadDeposits();

          setReceipt(null);
          setAmount(0);
          setSelectedMethod(null);
          setReceiptModalOpen(false);

          toast.dismiss("deposit");

          showExperience({
            title:
              "Deposit Submitted",
            description:
              "Your deposit request has been submitted successfully and is now awaiting verification by our team.",
            status: "success",
          });
        } catch (error) {
          toast.dismiss("deposit");

          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to submit deposit.",
            {
              id: "deposit",
            },
          );
        } finally {
          setSubmitting(false);
        }
      },
      [
        submitting,
        receipt,
        selectedMethod,
        uploadReceipt,
        createDeposit,
        loadDeposits,
      ],
    );

  return (
    <>
      <DashboardPage
        environment="user"
        breadcrumb={[
          {
            label: "Deposit",
          },
        ]}
        containerClassName="
          pb-12
          sm:pb-16
          lg:pb-24
        "
      >
        <DepositBalance
          balance={walletBalance}
        />

        <DepositMethod
          methods={methods}
          loading={loadingMethods}
          value={selectedMethod}
          onChange={setSelectedMethod}
        />

        {selectedMethod && (
          <>
            <DepositMethodCard
              method={selectedMethod}
            />

            <DepositAmount
              value={amount}
              onChange={setAmount}
            />
          </>
        )}

        {selectedMethod &&
          amount > 0 && (
            <>
              <DepositSummary
                summary={summary}
              />

              <DepositAction
                onContinue={() =>
                  setReceiptModalOpen(
                    true,
                  )
                }
              />
            </>
          )}

        <DepositHistory
          deposits={deposits}
        />
      </DashboardPage>

      {selectedMethod && (
        <DepositReceiptModal
          open={receiptModalOpen}
          method={selectedMethod}
          amount={amount}
          file={receipt}
          onFileChange={setReceipt}
          onClose={() =>
            setReceiptModalOpen(false)
          }
          onSubmit={
            handleDepositSubmit
          }
          submitting={submitting}
        />
      )}
    </>
  );
}