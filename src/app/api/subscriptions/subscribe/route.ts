import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  requireUser,
} from "@/lib/auth/user";

import {
  subscribeSchema,
} from "@/validation/subscription.validation";

import {
  subscribeToPlan,
} from "@/services/subscription.service";

export async function POST(
  request: NextRequest,
) {
  try {
    const session =
      await requireUser();

    const body =
      await request.json();

    const parsed =
      subscribeSchema.safeParse(
        body,
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request.",
          fieldErrors:
            parsed.error.flatten()
              .fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const subscription =
      await subscribeToPlan({
        userId:
          session.user.id,
        planId:
          parsed.data.planId,
      });

    return NextResponse.json({
      success: true,
      message:
        "Subscription activated successfully.",
      subscription,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to subscribe to plan.",
      },
      {
        status: 400,
      },
    );
  }
}