import type {
  WalletUser,
} from "./wallet.types";

export function formatCurrency(
  value:
    | number
    | string,
) {
  const amount =
    Number(value);

  if (
    Number.isNaN(amount)
  ) {
    return "$0.00";
  }

  return amount.toLocaleString(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  );
}

export function formatDate(
  value: string,
) {
  return new Date(
    value,
  ).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );
}

export function getFullName(
  user: Pick<
    WalletUser,
    | "firstName"
    | "lastName"
  >,
) {
  return [
    user.firstName,
    user.lastName,
  ]
    .filter(Boolean)
    .join(" ");
}

export function filterUsers(
  users: WalletUser[],
  query: string,
) {
  const search =
    query
      .trim()
      .toLowerCase();

  if (!search) {
    return users;
  }

  return users.filter(
    (user) => {
      const fullName =
        getFullName(
          user,
        ).toLowerCase();

      return (
        fullName.includes(
          search,
        ) ||
        user.email
          .toLowerCase()
          .includes(
            search,
          )
      );
    },
  );
}