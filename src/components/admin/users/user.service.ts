import type {
  UserQuery,
  UsersResponse,
  UserRole,
} from "./user.types";

type UserAction =
  | "activate"
  | "deactivate"
  | "restore"
  | "approveDeletion"
  | "delete";

type ActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function getUsers({
  page = 1,
  limit = 10,
  search = "",
  status = "ALL",
  role = "USER",
}: Partial<UserQuery> = {}): Promise<UsersResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    role,
  });

  const trimmedSearch = search.trim();

  if (trimmedSearch) {
    params.set("search", trimmedSearch);
  }

  if (status !== "ALL") {
    params.set("status", status);
  }

  const response = await fetch(
    `/api/admin/users?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    },
  );

  const data =
    (await response.json()) as UsersResponse & {
      error?: string;
    };

  if (!response.ok) {
    throw new Error(
      data.error ??
        "Unable to fetch users.",
    );
  }

  return data;
}

async function performUserAction(
  userId: string,
  action: UserAction,
): Promise<ActionResponse> {
  const response = await fetch(
    `/api/admin/users/${userId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        action,
      }),
    },
  );

  const data =
    (await response.json()) as ActionResponse;

  if (!response.ok) {
    throw new Error(
      data.error ??
        "Unable to update user.",
    );
  }

  return data;
}

export function activateUser(
  userId: string,
) {
  return performUserAction(
    userId,
    "activate",
  );
}

export function deactivateUser(
  userId: string,
) {
  return performUserAction(
    userId,
    "deactivate",
  );
}

export function restoreUser(
  userId: string,
) {
  return performUserAction(
    userId,
    "restore",
  );
}

export function approveDeletion(
  userId: string,
) {
  return performUserAction(
    userId,
    "approveDeletion",
  );
}

export function deleteUser(
  userId: string,
) {
  return performUserAction(
    userId,
    "delete",
  );
}