import {
  DEPOSIT_METHODS,
} from "../Deposit/deposit.data";

import type {
  WithdrawMethod,
} from "./withdraw.types";

export const WITHDRAW_METHODS: WithdrawMethod[] = [
  ...DEPOSIT_METHODS.map(
    (method) => ({
      id: method.id,

      type: "crypto" as const,

      name: method.name,

      symbol: method.symbol,

      icon: method.icon,

      placeholder: `Enter ${method.symbol} wallet address`,

      network:
        `${method.symbol} Network`,
    })
  ),

  {
    id: "bank-account",

    type: "bank",

    name: "Bank Account",

    symbol: "BANK",
  },
];