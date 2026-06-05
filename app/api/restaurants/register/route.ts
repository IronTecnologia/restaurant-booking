import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractToken, verifyToken } from "@/lib/auth";

/**
 * POST /api/restaurants/register
 * Registrar novo restaurante (admin/owner)
 */
export async function POST(req: NextRequest) {
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
      name,
      slug,
      email,
      phone,
      whatsapp,
      instagram,
      address,
      city,
      state,
      zipCode,
      totalCapacity,
    } = await req.json();

    // Validar slug
    if (!slug || slug.length < 3) {
      return NextResponse.json(
        { error: "Slug deve ter pelo menos 3 caracteres" },
        { status: 400 }
      );
    }

    // Validar nome
    if (!name || name.length < 3) {
      return NextResponse.json(
        { error: "Nome deve ter pelo menos 3 caracteres" },
        { status: 400 }
      );
    }

    // Verificar se slug já existe
    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { slug },
    });

    if (existingRestaurant) {
      return NextResponse.json(
        { error: "Slug já está em uso" },
        { status: 409 }
      );
    }

    // Criar restaurante
    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        slug,
        email,
        phone,
        whatsapp,
        instagram,
        address,
        city,
        state,
        zipCode,
        totalCapacity: totalCapacity || 20,
      },
    });

    // Criar admin (owner)
    await prisma.restaurantAdmin.create({
      data: {
        userId: payload.userId,
        restaurantId: restaurant.id,
        role: "admin",
      },
    });

    // Criar settings padrão
    await prisma.restaurantSettings.create({
      data: {
        restaurantId: restaurant.id,
      },
    });

    // Criar horários padrão (seg-dom, 11:00-23:00)
    const hours = [
      { day: 1, open: "11:00", close: "23:00" }, // Seg
      { day: 2, open: "11:00", close: "23:00" }, // Ter
      { day: 3, open: "11:00", close: "23:00" }, // Qua
      { day: 4, open: "11:00", close: "23:00" }, // Qui
      { day: 5, open: "11:00", close: "00:00" }, // Sex
      { day: 6, open: "10:00", close: "01:00" }, // Sab
      { day: 0, open: "12:00", close: "23:00" }, // Dom
    ];

    await Promise.all(
      hours.map((h) =>
        prisma.operatingHours.create({
          data: {
            restaurantId: restaurant.id,
            dayOfWeek: h.day,
            openTime: h.open,
            closeTime: h.close,
            isClosed: false,
          },
        })
      )
    );

    return NextResponse.json(
      {
        message: "Restaurante criado com sucesso!",
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          slug: restaurant.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register restaurant error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
