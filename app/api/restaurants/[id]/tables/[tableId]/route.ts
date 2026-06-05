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
 * PATCH /api/restaurants/[id]/tables/[tableId]
 * Atualizar mesa
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; tableId: string }> }
) {
  try {
    const { id, tableId } = await params;
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

    const { capacity, section, isActive } = await req.json();

    const table = await prisma.table.update({
      where: { id: tableId },
      data: {
        ...(capacity && { capacity }),
        ...(section && { section }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(table);
  } catch (error) {
    console.error("Update table error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/restaurants/[id]/tables/[tableId]
 * Deletar mesa
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; tableId: string }> }
) {
  try {
    const { id, tableId } = await params;
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

    await prisma.table.delete({
      where: { id: tableId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete table error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
