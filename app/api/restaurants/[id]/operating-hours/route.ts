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
 * GET /api/restaurants/[id]/operating-hours
 * Obter horários de funcionamento
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

    const hours = await prisma.operatingHours.findMany({
      where: { restaurantId: id },
      orderBy: { dayOfWeek: "asc" },
    });

    return NextResponse.json(hours);
  } catch (error) {
    console.error("Get operating hours error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/restaurants/[id]/operating-hours
 * Atualizar horários (em lote)
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

    const hours = await req.json(); // Array de { dayOfWeek, openTime, closeTime, isClosed }

    if (!Array.isArray(hours)) {
      return NextResponse.json(
        { error: "Deve ser um array de horários" },
        { status: 400 }
      );
    }

    // Atualizar cada dia
    const results = await Promise.all(
      hours.map((h) =>
        prisma.operatingHours.upsert({
          where: {
            restaurantId_dayOfWeek: {
              restaurantId: id,
              dayOfWeek: h.dayOfWeek,
            },
          },
          update: {
            openTime: h.openTime,
            closeTime: h.closeTime,
            isClosed: h.isClosed || false,
          },
          create: {
            restaurantId: id,
            dayOfWeek: h.dayOfWeek,
            openTime: h.openTime,
            closeTime: h.closeTime,
            isClosed: h.isClosed || false,
          },
        })
      )
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error("Update operating hours error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
