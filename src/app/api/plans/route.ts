import {
  NextResponse,
} from "next/server";

import {
  getActivePlans,
} from "@/repositories/plan.repository";

export async function GET() {
  try {
    const plans =
      await getActivePlans();

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