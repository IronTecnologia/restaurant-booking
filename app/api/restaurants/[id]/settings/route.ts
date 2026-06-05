import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractToken, verifyToken } from "@/lib/auth";

async function verifyRestaurantAccess(userId: string, restaurantId: string) {
  const admin = await prisma.restaurantAdmin.findUnique({
    where: {
      userId_restaurantId: {
        userId,
        restaurantId,
      },
    },
  });
  return admin;
}

/**
 * GET /api/restaurants/[id]/settings
 * Obter configurações do restaurante
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = extractToken(req.headers.get("authorization") ?? undefined);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const access = await verifyRestaurantAccess(payload.userId, id);
    if (!access) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }

    const settings = await prisma.restaurantSettings.findUnique({
      where: { restaurantId: id },
    });

    if (!settings) {
      return NextResponse.json(
        { error: "Configurações não encontradas" },
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

/**
 * PATCH /api/restaurants/[id]/settings
 * Atualizar configurações do restaurante
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = extractToken(req.headers.get("authorization") ?? undefined);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const access = await verifyRestaurantAccess(payload.userId, id);
    if (!access) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }

    const {
      autoApprove,
      minGuestCount,
      maxGuestCount,
      minAdvanceHours,
      maxAdvanceHours,
      defaultTableOccupancyMin,
      whatsappEnabled,
      confirmationMessage,
    } = await req.json();

    const settings = await prisma.restaurantSettings.update({
      where: { restaurantId: id },
      data: {
        ...(autoApprove !== undefined && { autoApprove }),
        ...(minGuestCount !== undefined && { minGuestCount }),
        ...(maxGuestCount !== undefined && { maxGuestCount }),
        ...(minAdvanceHours !== undefined && { minAdvanceHours }),
        ...(maxAdvanceHours !== undefined && { maxAdvanceHours }),
        ...(defaultTableOccupancyMin !== undefined && { defaultTableOccupancyMin }),
        ...(whatsappEnabled !== undefined && { whatsappEnabled }),
        ...(confirmationMessage && { confirmationMessage }),
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
