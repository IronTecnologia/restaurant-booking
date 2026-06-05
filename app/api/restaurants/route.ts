import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractToken, verifyToken } from "@/lib/auth";

/**
 * GET /api/restaurants
 * Listar restaurantes que o usuário gerencia
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

    // Buscar todos os restaurantes que o usuário é admin
    const admins = await prisma.restaurantAdmin.findMany({
      where: { userId: payload.userId },
      include: {
        restaurant: {
          include: {
            settings: true,
            tables: true,
            reservations: {
              where: {
                reservationDate: {
                  gte: new Date(),
                },
              },
            },
          },
        },
      },
    });

    const restaurants = admins.map((admin) => ({
      ...admin.restaurant,
      role: admin.role,
      reservationCount: admin.restaurant.reservations.length,
    }));

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error("Get restaurants error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
