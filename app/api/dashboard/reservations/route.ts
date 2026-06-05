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
 * GET /api/dashboard/reservations
 * Listar reservas do restaurante do usuário
 */
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

    // Parâmetros de query
    const restaurantId = req.nextUrl.searchParams.get("restaurantId");
    const status = req.nextUrl.searchParams.get("status");
    const date = req.nextUrl.searchParams.get("date"); // YYYY-MM-DD

    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId required" },
        { status: 400 }
      );
    }

    // Verificar acesso
    const access = await verifyRestaurantAccess(payload.userId, restaurantId);
    if (!access) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    // Build filter
    const filter: any = { restaurantId };

    if (status) {
      filter.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      filter.reservationDate = {
        gte: startDate,
        lt: endDate,
      };
    }

    // Buscar reservas
    const reservations = await prisma.reservation.findMany({
      where: filter,
      include: {
        table: true,
        checkIn: true,
      },
      orderBy: { reservationDate: "desc" },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Get dashboard reservations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
