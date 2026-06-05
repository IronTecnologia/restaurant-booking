import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const restaurantId = req.nextUrl.searchParams.get("restaurantId");
    const date = req.nextUrl.searchParams.get("date");

    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId required" },
        { status: 400 }
      );
    }

    const tables = await prisma.table.findMany({
      where: { restaurantId },
      include: {
        reservations: {
          where: date
            ? {
                reservationDate: {
                  gte: new Date(date),
                  lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
                },
                status: { not: "cancelled" },
              }
            : undefined,
        },
      },
      orderBy: { tableNumber: "asc" },
    });

    // Calculate availability
    const availability = tables.map((table) => ({
      id: table.id,
      tableNumber: table.tableNumber,
      seats: table.capacity,
      isAvailable: table.reservations.length === 0,
      reservationCount: table.reservations.length,
    }));

    return NextResponse.json(availability);
  } catch (error) {
    console.error("Get tables error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
