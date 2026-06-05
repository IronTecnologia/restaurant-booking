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
 * POST /api/dashboard/checkins
 * Fazer check-in de uma reserva
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

    const { restaurantId, reservationId } = await req.json();

    if (!restaurantId || !reservationId) {
      return NextResponse.json(
        { error: "restaurantId e reservationId obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar acesso
    const access = await verifyRestaurantAccess(payload.userId, restaurantId);
    if (!access) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    // Buscar reserva
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation || reservation.restaurantId !== restaurantId) {
      return NextResponse.json(
        { error: "Reserva não encontrada" },
        { status: 404 }
      );
    }

    const now = new Date();

    // Criar ou atualizar check-in
    let checkIn = await prisma.checkIn.findUnique({
      where: { reservationId },
    });

    if (checkIn) {
      // Já tem check-in, atualizar saída
      checkIn = await prisma.checkIn.update({
        where: { reservationId },
        data: { departedAt: now },
      });
    } else {
      // Criar novo check-in
      checkIn = await prisma.checkIn.create({
        data: {
          reservationId,
          arrivedAt: now,
        },
      });
    }

    // Atualizar status da reserva
    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status: "checkin",
        checkedInAt: now,
      },
    });

    return NextResponse.json({
      message: "Check-in realizado com sucesso!",
      checkIn,
      reservation: updatedReservation,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/dashboard/checkins
 * Finalizar atendimento (saída)
 */
export async function PATCH(req: NextRequest) {
  try {
    const token = extractToken(req.headers.get("authorization") ?? undefined);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { restaurantId, reservationId } = await req.json();

    if (!restaurantId || !reservationId) {
      return NextResponse.json(
        { error: "restaurantId e reservationId obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar acesso
    const access = await verifyRestaurantAccess(payload.userId, restaurantId);
    if (!access) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const now = new Date();

    // Atualizar check-in com saída
    const checkIn = await prisma.checkIn.update({
      where: { reservationId },
      data: { departedAt: now },
    });

    // Atualizar status da reserva para finalizada
    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status: "finalizada",
        finishedAt: now,
      },
    });

    return NextResponse.json({
      message: "Atendimento finalizado!",
      checkIn,
      reservation: updatedReservation,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
