export type UserStatus =
  | "PENDING_VERIFICATION"
  | "ACTIVE"
  | "SUSPENDED"
  | "DEACTIVATED"
  | "PENDING_DELETION";

export type UserManagementStatus =
  | "ALL"
  | "ACTIVE"
  | "DEACTIVATED"
  | "PENDING_DELETION";

export type UserRole =
  | "USER"
  | "ADMIN";

export type AdminUser = {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  phoneNumber: string;

  secondaryPhoneNumber: string | null;

  country: string;

  avatarKey: string | null;

  role: UserRole;

  status: UserStatus;

  balance: string;

  createdAt: string;

  deletedAt: string | null;
};

export type UserStatusFilter =
  UserManagementStatus;

export type UserSort =
  | "newest"
  | "oldest";

export type UserQuery = {
  page: number;

  limit: number;

  search: string;

  status: UserStatusFilter;

  role: UserRole;

  sort: UserSort;
};

export type UsersResponse = {
  success: boolean;

  data: {
    users: AdminUser[];

    pagination: {
      page: number;

      limit: number;

      total: number;

      totalPages: number;
    };
  };

  error?: string;
};