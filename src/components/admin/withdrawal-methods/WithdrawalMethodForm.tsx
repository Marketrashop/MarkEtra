"use client";

import WithdrawalMethodTypeSelect from "./WithdrawalMethodTypeSelect";
import CryptoMethodFields from "./CryptoMethodFields";
import BankMethodFields from "./BankMethodFields";

import type {
  WithdrawalMethodFormValues,
} from "./withdrawal-method.types";

type WithdrawalMethodFormProps = {
  value: WithdrawalMethodFormValues;

  loading?: boolean;

  onChange: (
    value: WithdrawalMethodFormValues
  ) => void;

  onSubmit: () => void;
};

export default function WithdrawalMethodForm({
  value,
  loading = false,
  onChange,
  onSubmit,
}: WithdrawalMethodFormProps) {
  function update(
    values: Partial<WithdrawalMethodFormValues>
  ) {
    onChange({
      ...value,
      ...values,
    });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="
        space-y-2.5
        sm:space-y-6
      "
    >
      <WithdrawalMethodTypeSelect
        value={value.type}
        disabled={loading}
        onChange={(type) =>
          update({
            type,
          })
        }
      />

      {value.type === "crypto" ? (
        <CryptoMethodFields
          name={value.name}
          symbol={value.symbol}
          network={value.network}
          placeholder={value.placeholder}
          fee={value.fee}
          feeType={value.feeType}
          minimumAmount={value.minimumAmount}
          maximumAmount={value.maximumAmount}
          icon={value.icon}
          disabled={loading}
          onChange={update}
        />
      ) : (
        <BankMethodFields
          name={value.name}
          symbol={value.symbol}
          placeholder={value.placeholder}
          fee={value.fee}
          feeType={value.feeType}
          minimumAmount={value.minimumAmount}
          maximumAmount={value.maximumAmount}
          icon={value.icon}
          disabled={loading}
          onChange={update}
        />
      )}
    </form>
  );
}