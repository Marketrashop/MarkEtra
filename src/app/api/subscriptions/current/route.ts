import {
  NextResponse,
} from "next/server";

import {
  requireUser,
} from "@/lib/auth/user";

import {
  getCurrentSubscription,
} from "@/repositories/subscription.repository";

export async function GET() {
  try {
    const session =
      await requireUser();

    const subscription =
      await getCurrentSubscription(
        session.user.id,
      );

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load subscription.",
      },
      {
        status: 500,
      },
    );
  }
}