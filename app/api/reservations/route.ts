import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractToken, verifyToken, generateConfirmationCode } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = extractToken(req.headers.get("authorization") ?? undefined);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const reservations = await prisma.reservation.findMany({
      include: {
        restaurant: true,
        table: true,
      },
      orderBy: { reservationDate: "desc" },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Get reservations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { restaurantId, tableId, guestName, guestPhone, guestEmail, reservationDate, guestCount, notes } =
      await req.json();

    // Validate inputs
    if (!restaurantId || !tableId || !guestName || !guestPhone || !reservationDate || !guestCount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    // Get restaurant settings
    const settings = await prisma.restaurantSettings.findUnique({
      where: { restaurantId },
    });

    // Determine initial status (auto approve if configured)
    let initialStatus = "solicitada";
    if (settings?.autoApprove) {
      const withinRange =
        guestCount >= settings.minGuestCount &&
        guestCount <= settings.maxGuestCount;
      if (withinRange) {
        initialStatus = "confirmada";
      }
    }

    const confirmationCode = generateConfirmationCode();

    const reservation = await prisma.reservation.create({
      data: {
        restaurantId,
        tableId,
        reservationDate: new Date(reservationDate),
        guestCount,
        guestName,
        guestPhone,
        guestEmail,
        notes,
        confirmationCode,
        status: initialStatus,
        confirmedAt: initialStatus === "confirmada" ? new Date() : null,
      },
      include: {
        restaurant: true,
        table: true,
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error("Create reservation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
