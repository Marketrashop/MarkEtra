import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const methods =
      await prisma.depositMethod.findMany({
        where: {
          isActive: true,
        },

        orderBy: [
          {
            displayOrder: "asc",
          },
          {
            createdAt: "desc",
          },
        ],

        select: {
          id: true,
          name: true,
          symbol: true,
          walletAddress: true,
          iconKey: true,
          qrCodeKey: true,
        },
      });

    return NextResponse.json(
      {
        success: true,
        data: methods,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Failed to fetch deposit methods:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to fetch deposit methods",
      },
      {
        status: 500,
      },
    );
  }
}