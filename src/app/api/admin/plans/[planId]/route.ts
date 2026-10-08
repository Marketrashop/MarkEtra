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
  getPlanById,
  getPlanBySlug,
  updatePlan,
  deletePlan,
} from "@/repositories/plan.repository";

type RouteContext = {
  params: Promise<{
    planId: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    await requireAdmin();

    const { planId } =
      await params;

    const plan =
      await getPlanById(
        planId,
      );

    if (!plan) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Plan not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load plan.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    await requireAdmin();

    const { planId } =
      await params;

    const existingPlan =
      await getPlanById(
        planId,
      );

    if (!existingPlan) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Plan not found.",
        },
        {
          status: 404,
        },
      );
    }

    const body =
      await request.json();

    const parsed =
      createPlanSchema
        .partial()
        .safeParse(body);

if (!parsed.success) {
  console.log(parsed.error.issues);

  return NextResponse.json(
    {
      success: false,
      error: "Invalid request.",
      fieldErrors:
        parsed.error.flatten().fieldErrors,
    },
    {
      status: 400,
    },
  );
}

    if (
      parsed.data.slug &&
      parsed.data.slug !==
        existingPlan.slug
    ) {
      const slugExists =
        await getPlanBySlug(
          parsed.data.slug,
        );

      if (slugExists) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Slug already exists.",
          },
          {
            status: 409,
          },
        );
      }
    }

    const plan =
      await updatePlan(
        planId,
        parsed.data,
      );

    return NextResponse.json({
      success: true,
      message:
        "Plan updated successfully.",
      plan,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update plan.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    await requireAdmin();

    const { planId } =
      await params;

    const existingPlan =
      await getPlanById(
        planId,
      );

    if (!existingPlan) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Plan not found.",
        },
        {
          status: 404,
        },
      );
    }

    await deletePlan(
      planId,
    );

    return NextResponse.json({
      success: true,
      message:
        "Plan deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to delete plan.",
      },
      {
        status: 500,
      },
    );
  }
}