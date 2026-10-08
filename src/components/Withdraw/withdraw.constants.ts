export const WITHDRAW_AVAILABLE_BALANCE = 12480.5;


export const WITHDRAW_NETWORK_FEE = 12.5;


export const WITHDRAW_MINIMUM_AMOUNT = 10;


export const WITHDRAW_DECIMAL_PLACES = 2;


export const WITHDRAW_MAX_ADDRESS_LENGTH = 256;


export const WITHDRAW_FILTERS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Successful",
    value: "successful",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
] as const;


export const WITHDRAW_CONFIRMATION_DELAY = 300;