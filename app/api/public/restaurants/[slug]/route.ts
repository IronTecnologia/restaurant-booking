import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/public/restaurants/[slug]
 * Obter dados públicos do restaurante (sem autenticação)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      include: {
        settings: true,
        operatingHours: {
          orderBy: { dayOfWeek: "asc" },
        },
        tables: {
          where: { isActive: true },
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

    if (!restaurant.isActive) {
      return NextResponse.json(
        { error: "Restaurante inativo" },
        { status: 403 }
      );
    }

    // Retornar apenas dados públicos
    return NextResponse.json({
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      email: restaurant.email,
      phone: restaurant.phone,
      whatsapp: restaurant.whatsapp,
      instagram: restaurant.instagram,
      logo: restaurant.logo,
      coverImage: restaurant.coverImage,
      address: restaurant.address,
      city: restaurant.city,
      state: restaurant.state,
      totalCapacity: restaurant.totalCapacity,
      settings: {
        minGuestCount: restaurant.settings?.minGuestCount || 1,
        maxGuestCount: restaurant.settings?.maxGuestCount || 100,
        minAdvanceHours: restaurant.settings?.minAdvanceHours || 1,
        maxAdvanceHours: restaurant.settings?.maxAdvanceHours || 720,
      },
      operatingHours: restaurant.operatingHours,
      tablesCount: restaurant.tables.length,
    });
  } catch (error) {
    console.error("Get public restaurant error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
