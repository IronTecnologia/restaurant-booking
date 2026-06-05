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
 * GET /api/restaurants/[id]/tables
 * Listar todas as mesas do restaurante
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

    const tables = await prisma.table.findMany({
      where: { restaurantId: id },
      orderBy: { tableNumber: "asc" },
    });

    return NextResponse.json(tables);
  } catch (error) {
    console.error("Get tables error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/restaurants/[id]/tables
 * Criar nova mesa
 */
export async function POST(
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

    const { tableNumber, capacity, section } = await req.json();

    if (!tableNumber || !capacity) {
      return NextResponse.json(
        { error: "tableNumber e capacity são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se mesa já existe
    const existing = await prisma.table.findUnique({
      where: {
        restaurantId_tableNumber: {
          restaurantId: id,
          tableNumber,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Mesa com este número já existe" },
        { status: 409 }
      );
    }

    const table = await prisma.table.create({
      data: {
        restaurantId: id,
        tableNumber,
        capacity,
        section: section || "interna",
        isActive: true,
      },
    });

    return NextResponse.json(table, { status: 201 });
  } catch (error) {
    console.error("Create table error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
