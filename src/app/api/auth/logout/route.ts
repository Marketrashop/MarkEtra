import { NextResponse } from "next/server";

import { revokeCurrentSession } from "@/lib/auth/session";

export async function POST() {
  try {
    await revokeCurrentSession();

    return NextResponse.json({
      success: true,
      message: "Signed out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to sign out",
      },
      { status: 500 },
    );
  }
}
