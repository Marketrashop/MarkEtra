import { NextResponse } from "next/server";

import {
  getCurrentSession,
  refreshSessionActivity,
} from "@/lib/auth/session";

export async function POST() {
  try {
    const session =
      await getCurrentSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Session expired.",
        },
        {
          status: 401,
        },
      );
    }

await refreshSessionActivity(
  session.id,
  session.lastActivityAt,
);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Refresh session activity error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to refresh session activity.",
      },
      {
        status: 500,
      },
    );
  }
}