"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { toast } from "sonner";

import { DashboardPage } from "@/components/dashboard";

import WithdrawBalance from "./WithdrawBalance";
import WithdrawMethod from "./WithdrawMethod";
import WithdrawDetails from "./WithdrawDetails";
import WithdrawSummary from "./WithdrawSummary";
import WithdrawAction from "./WithdrawAction";
import WithdrawHistory from "./WithdrawHistory";
import WithdrawConfirmationModal from "./WithdrawConfirmationModal";

import {
  WITHDRAW_NETWORK_FEE,
} from "./withdraw.constants";

import {
  calculateReceiveAmount,
} from "./withdraw.utils";

import type {
  WithdrawMethod as WithdrawMethodType,
  WithdrawHistoryItem,
  WithdrawBalanceType,
} from "./withdraw.types";

import useExperience from "@/components/ui/ExperienceOverlay/useExperience";

export default function WithdrawPage() {
  const {
    showExperience,
  } = useExperience();

  const [
    methods,
    setMethods,
  ] = useState<WithdrawMethodType[]>(
    [],
  );

  const [
    walletBalance,
    setWalletBalance,
  ] = useState(0);

  const [
    profitBalance,
    setProfitBalance,
  ] = useState(0);

  const [
    affiliateBalance,
    setAffiliateBalance,
  ] = useState(0);

  const [
    lockedBalance,
    setLockedBalance,
  ] = useState(0);

  const [
    selectedMethod,
    setSelectedMethod,
  ] = useState<WithdrawMethodType | null>(
    null,
  );

  const [
    address,
    setAddress,
  ] = useState("");

  const [
    bankDetails,
    setBankDetails,
  ] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    country: "",
    currency: "",
    bankAddress: "",
    swiftBic: "",
    iban: "",
    routingNumber: "",
    sortCode: "",
    ifsc: "",
  });

  function handleBankDetailsChange(
    values: Partial<
      typeof bankDetails
    >,
  ) {
    setBankDetails(
      (current) => ({
        ...current,
        ...values,
      }),
    );
  }

  const [
    amount,
    setAmount,
  ] = useState(0);

  const [
    balanceType,
    setBalanceType,
  ] = useState<WithdrawBalanceType>(
    "wallet",
  );

  const [
    confirmationOpen,
    setConfirmationOpen,
  ] = useState(false);

  const [
    confirmationLoading,
    setConfirmationLoading,
  ] = useState(false);

  const youReceive =
    calculateReceiveAmount(
      amount,
      WITHDRAW_NETWORK_FEE,
    );

  const summary =
    useMemo(
      () => ({
        method:
          selectedMethod
            ? `${selectedMethod.name} (${selectedMethod.symbol})`
            : "",

        amount,

        networkFee:
          WITHDRAW_NETWORK_FEE,

        youReceive,
      }),
      [
        selectedMethod,
        amount,
        youReceive,
      ],
    );

  useEffect(() => {
    async function loadMethods() {
      try {
        const response =
          await fetch(
            "/api/withdrawal-methods",
            {
              cache: "no-store",
            },
          );

        if (!response.ok) {
          throw new Error();
        }

        const data =
          await response.json();

        setMethods(
          data.methods,
        );

        setWalletBalance(
          data.wallet
            .availableBalance,
        );

        setProfitBalance(
          data.wallet
            .profitBalance,
        );

        setAffiliateBalance(
          data.wallet
            .affiliateBalance,
        );

        setLockedBalance(
          data.wallet
            .lockedBalance,
        );

        const historyResponse =
          await fetch(
            "/api/withdrawals/history",
            {
              cache: "no-store",
            },
          );

        if (!historyResponse.ok) {
          throw new Error();
        }

        const historyData =
          await historyResponse.json();

        setWithdrawals(
          historyData.withdrawals,
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load withdrawal methods.",
        );
      }
    }

    void loadMethods();
  }, []);

  const [
    withdrawals,
    setWithdrawals,
  ] = useState<
    WithdrawHistoryItem[]
  >([]);

  const isBankMethod =
    selectedMethod?.type ===
    "bank";

  const hasDestinationDetails =
    isBankMethod
      ? Boolean(
          bankDetails.accountHolderName.trim() &&
            bankDetails.bankName.trim() &&
            bankDetails.accountNumber.trim() &&
            bankDetails.country.trim() &&
            bankDetails.currency.trim(),
        )
      : Boolean(
          address.trim(),
        );

  const selectedBalance =
    balanceType === "wallet"
      ? walletBalance
      : balanceType === "profit"
        ? profitBalance
        : affiliateBalance;

  const canWithdraw =
    Boolean(
      selectedMethod &&
        hasDestinationDetails &&
        amount > 0 &&
        amount <= selectedBalance,
    );

  function handleMethodChange(
    method: WithdrawMethodType,
  ) {
    setSelectedMethod(
      method,
    );

    setAddress("");

    setBankDetails({
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      country: "",
      currency: "",
      bankAddress: "",
      swiftBic: "",
      iban: "",
      routingNumber: "",
      sortCode: "",
      ifsc: "",
    });

    setAmount(0);

    setBalanceType("wallet");

    setConfirmationOpen(
      false,
    );
  }

  function handleContinue() {
    if (!canWithdraw) {
      return;
    }

    setConfirmationOpen(true);
  }

  async function handleConfirm() {
    if (!selectedMethod) {
      return;
    }

    setConfirmationLoading(
      true,
    );

    try {
      const payload =
        selectedMethod.type ===
        "crypto"
          ? {
              withdrawalMethodId:
                selectedMethod.id,
              amount,
              balanceType,
              destinationAddress:
                address,
            }
          : {
              withdrawalMethodId:
                selectedMethod.id,
              amount,
              balanceType,
              ...bankDetails,
            };

      const response =
        await fetch(
          "/api/withdrawals",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload,
            ),
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        toast.error(
          result.message ??
            "Withdrawal request failed.",
        );

        return;
      }

      setWalletBalance(
        result.wallet
          .availableBalance,
      );

      setProfitBalance(
        result.wallet
          .profitBalance,
      );

      setAffiliateBalance(
        result.wallet
          .affiliateBalance,
      );

      setLockedBalance(
        result.wallet
          .lockedBalance,
      );

      setWithdrawals(
        (current) => [
          result.withdrawal,
          ...current,
        ],
      );

      showExperience({
        status:
          "Withdrawal Submitted",
        title:
          "Request received",
        description:
          "Your withdrawal request has been submitted successfully and is now awaiting review by our team.",
      });

      setConfirmationOpen(
        false,
      );

      setSelectedMethod(
        null,
      );

      setAddress("");

      setBankDetails({
        accountHolderName: "",
        bankName: "",
        accountNumber: "",
        country: "",
        currency: "",
        bankAddress: "",
        swiftBic: "",
        iban: "",
        routingNumber: "",
        sortCode: "",
        ifsc: "",
      });

      setAmount(0);
    } catch (error) {
      console.error(error);

      toast.error(
        "Something went wrong.",
      );
    } finally {
      setConfirmationLoading(
        false,
      );
    }
  }

  return (
    <>
      <DashboardPage
        environment="user"
        breadcrumb={[
          {
            label: "Withdraw",
          },
        ]}
        containerClassName="
          pb-12
          sm:pb-16
          lg:pb-24
        "
      >
        <WithdrawBalance
          availableBalance={
            walletBalance
          }
          profitBalance={
            profitBalance
          }
          affiliateBalance={
            affiliateBalance
          }
          lockedBalance={
            lockedBalance
          }
        />

        <WithdrawMethod
          methods={methods}
          value={selectedMethod}
          onChange={
            handleMethodChange
          }
        />

        {selectedMethod && (
          <WithdrawDetails
            method={selectedMethod}
            address={address}
            onAddressChange={
              setAddress
            }
            bankDetails={
              bankDetails
            }
            onBankDetailsChange={
              handleBankDetailsChange
            }
            amount={amount}
            onAmountChange={
              setAmount
            }
            availableBalance={
              selectedBalance
            }
            withdrawFrom={
              balanceType
            }
            onWithdrawFromChange={
              setBalanceType
            }
          />
        )}

        {selectedMethod &&
          amount > 0 && (
            <>
              <WithdrawSummary
                summary={summary}
              />

              <WithdrawAction
                amount={amount}
                youReceive={
                  youReceive
                }
                disabled={
                  !canWithdraw
                }
                onWithdraw={
                  handleContinue
                }
              />
            </>
          )}

        <WithdrawHistory
          withdrawals={
            withdrawals
          }
        />
      </DashboardPage>

      {selectedMethod && (
        <WithdrawConfirmationModal
          open={
            confirmationOpen
          }
          method={
            selectedMethod
          }
          address={
            address
          }
          bankDetails={
            bankDetails
          }
          summary={
            summary
          }
          onClose={() =>
            setConfirmationOpen(
              false,
            )
          }
          onConfirm={
            handleConfirm
          }
          loading={
            confirmationLoading
          }
        />
      )}
    </>
  );
}