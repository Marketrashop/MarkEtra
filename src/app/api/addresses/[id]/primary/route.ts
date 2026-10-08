import {
  NextResponse,
} from "next/server";

import {
  requireUser,
} from "@/lib/auth/user";

import {
  setPrimaryAddress,
} from "@/services/address.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error:
        "Session Timeout. Please login again.",
    },
    {
      status: 401,
    },
  );
}

function handleAuthError(
  error: unknown,
) {
  if (
    error instanceof Error &&
    error.message ===
      "UNAUTHENTICATED"
  ) {
    return unauthorizedResponse();
  }

  return null;
}

export async function POST(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const session =
      await requireUser();

    const { id } =
      await params;

    const address =
      await setPrimaryAddress(
        session.user.id,
        id,
      );

    return NextResponse.json({
      success: true,
      data: address,
    });
  } catch (error) {
    const authError =
      handleAuthError(error);

    if (authError) {
      return authError;
    }

    if (
      error instanceof Error &&
      error.message ===
        "ADDRESS_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Address not found.",
        },
        {
          status: 404,
        },
      );
    }

    console.error(
      "Set primary address error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to set primary address.",
      },
      {
        status: 500,
      },
    );
  }
}