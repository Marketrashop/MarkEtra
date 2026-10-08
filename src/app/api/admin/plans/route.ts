import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  requireAdmin,
} from "@/lib/auth/admin";

import {
  createPlanSchema,
} from "@/validation/plan.validation";

import {
  createPlan,
  getPlans,
  getPlanBySlug,
} from "@/repositories/plan.repository";

export async function GET() {
  try {
    await requireAdmin();

    const plans =
      await getPlans();

    return NextResponse.json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load plans.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    await requireAdmin();

    const body =
      await request.json();

    const parsed =
      createPlanSchema.safeParse(
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

    const existingPlan =
      await getPlanBySlug(
        parsed.data.slug,
      );

    if (existingPlan) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A plan with this slug already exists.",
        },
        {
          status: 409,
        },
      );
    }

    const plan =
      await createPlan({
        ...parsed.data,
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Plan created successfully.",
        plan,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to create plan.",
      },
      {
        status: 500,
      },
    );
  }
}