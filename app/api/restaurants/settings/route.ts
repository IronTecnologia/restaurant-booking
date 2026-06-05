import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractToken, verifyToken } from "@/lib/auth";

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

    const restaurantId = req.nextUrl.searchParams.get("restaurantId");
    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId required" },
        { status: 400 }
      );
    }

    const settings = await prisma.restaurantSettings.findUnique({
      where: { restaurantId },
    });

    if (!settings) {
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = extractToken(req.headers.get("authorization") ?? undefined);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const {
      restaurantId,
      whatsappEnabled,
      whatsappMessage,
      autoApprove,
      requirePayment,
      minGuestCount,
      maxGuestCount,
    } = await req.json();

    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId required" },
        { status: 400 }
      );
    }

    const settings = await prisma.restaurantSettings.upsert({
      where: { restaurantId },
      update: {
        ...(whatsappEnabled !== undefined && { whatsappEnabled }),
        ...(whatsappMessage && { confirmationMessage: whatsappMessage }),
        ...(autoApprove !== undefined && { autoApprove }),
        ...(minGuestCount !== undefined && { minGuestCount }),
        ...(maxGuestCount !== undefined && { maxGuestCount }),
      },
      create: {
        restaurantId,
        whatsappEnabled: whatsappEnabled ?? true,
        confirmationMessage: "Olá! Sua reserva foi confirmada 🎉\n\nRestaurante: {restaurant}\nData: {date}\nHóspedes: {guests}\nCódigo: {code}\n\nAguardamos sua visita!",
        autoApprove: autoApprove ?? false,
        minGuestCount: minGuestCount ?? 1,
        maxGuestCount: maxGuestCount ?? 100,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
