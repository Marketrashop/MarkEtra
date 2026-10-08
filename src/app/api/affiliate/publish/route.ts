import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  requireUser,
} from "@/lib/auth/user";

import {
  submitAffiliateProduct,
} from "@/services/affiliate.service";

import {
  submitAffiliateSchema,
} from "@/validation/affiliate.validation";

export async function POST(
  request: NextRequest,
) {
  try {
    const session =
      await requireUser();

    const body =
      await request.json();

    const parsed =
      submitAffiliateSchema.safeParse(
        body,
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid request.",
          fieldErrors:
            parsed.error.flatten()
              .fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const listing =
      await submitAffiliateProduct({
        userId:
          session.user.id,

        productId:
          parsed.data.productId,
      });

    return NextResponse.json({
      success: true,

      message:
        "Product submitted for admin review.",

      listing,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to submit product for review.",
      },
      {
        status: 400,
      },
    );
  }
}