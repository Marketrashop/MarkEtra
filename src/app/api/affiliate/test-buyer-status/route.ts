import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth/user";

import {
  getAffiliateTestBuyerPresence,
} from "@/services/affiliate.service";

export async function GET() {
  try {
    await requireUser();

    const presence =
      await getAffiliateTestBuyerPresence();

    return NextResponse.json({
      success: true,
      data: presence,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHENTICATED"
    ) {
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

    console.error(
      "Affiliate test buyer status error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load test buyer status.",
      },
      {
        status: 500,
      },
    );
  }
}