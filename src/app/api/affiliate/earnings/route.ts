import {
  NextResponse,
} from "next/server";

import {
  requireUser,
} from "@/lib/auth/user";

import {
  getAffiliateEarnings,
} from "@/services/affiliate.service";

export async function GET() {
  try {
    const session =
      await requireUser();

    const earnings =
      await getAffiliateEarnings(
        session.user.id,
      );

    return NextResponse.json({
      success: true,
      ...earnings,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load affiliate earnings.",
      },
      {
        status: 500,
      },
    );
  }
}