import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractToken, verifyToken } from "@/lib/auth";

/**
 * Verificar se user é admin do restaurante
 */
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
 * GET /api/restaurants/[id]
 * Obter dados do restaurante
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

    // Verificar acesso
    const access = await verifyRestaurantAccess(payload.userId, id);
    if (!access) {
      return NextResponse.json(
        { error: "Acesso negado a este restaurante" },
        { status: 403 }
      );
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        settings: true,
        operatingHours: {
          orderBy: { dayOfWeek: "asc" },
        },
        tables: {
          orderBy: { tableNumber: "asc" },
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurante não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Get restaurant error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/restaurants/[id]
 * Atualizar dados do restaurante
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

    // Verificar acesso
    const access = await verifyRestaurantAccess(payload.userId, id);
    if (!access) {
      return NextResponse.json(
        { error: "Acesso negado a este restaurante" },
        { status: 403 }
      );
    }

    const {
      name,
      email,
      phone,
      whatsapp,
      instagram,
      logo,
      coverImage,
      address,
      city,
      state,
      zipCode,
      totalCapacity,
      isActive,
    } = await req.json();

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(whatsapp && { whatsapp }),
        ...(instagram && { instagram }),
        ...(logo && { logo }),
        ...(coverImage && { coverImage }),
        ...(address && { address }),
        ...(city && { city }),
        ...(state && { state }),
        ...(zipCode && { zipCode }),
        ...(totalCapacity && { totalCapacity }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        settings: true,
      },
    });

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Update restaurant error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
