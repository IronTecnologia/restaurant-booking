import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractToken, verifyToken } from "@/lib/auth";
import {
  sendWhatsAppMessage,
  formatConfirmationMessage,
} from "@/lib/whatsapp";

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
 * PATCH /api/dashboard/reservations/[id]
 * Atualizar status da reserva
 * Status: solicitada, confirmada, check-in, finalizada, no-show, cancelada
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

    const { restaurantId, newStatus } = await req.json();

    if (!restaurantId || !newStatus) {
      return NextResponse.json(
        { error: "restaurantId e newStatus obrigatórios" },
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
      where: { id },
      include: {
        restaurant: true,
        table: true,
      },
    });

    if (!reservation || reservation.restaurantId !== restaurantId) {
      return NextResponse.json(
        { error: "Reserva não encontrada" },
        { status: 404 }
      );
    }

    // Status válidos
    const validStatuses = [
      "solicitada",
      "confirmada",
      "checkin",
      "finalizada",
      "no-show",
      "cancelada",
    ];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: "Status inválido" },
        { status: 400 }
      );
    }

    // Preparar dados para update
    const updateData: any = { status: newStatus };

    // Adicionar timestamps conforme o novo status
    if (newStatus === "confirmada" && !reservation.confirmedAt) {
      updateData.confirmedAt = new Date();
    }

    if (newStatus === "checkin" && !reservation.checkedInAt) {
      updateData.checkedInAt = new Date();
    }

    if (newStatus === "finalizada" && !reservation.finishedAt) {
      updateData.finishedAt = new Date();
    }

    if (newStatus === "cancelada" && !reservation.cancelledAt) {
      updateData.cancelledAt = new Date();
    }

    if (newStatus === "no-show" && !reservation.noShowAt) {
      updateData.noShowAt = new Date();
    }

    // Atualizar reserva
    const updated = await prisma.reservation.update({
      where: { id },
      data: updateData,
      include: {
        restaurant: true,
        table: true,
      },
    });

    // Enviar WhatsApp se confirmada
    if (
      newStatus === "confirmada" &&
      reservation.guestPhone &&
      reservation.status !== "confirmada"
    ) {
      const message = formatConfirmationMessage(
        reservation.confirmationCode,
        reservation.restaurant.name,
        reservation.reservationDate.toISOString(),
        reservation.guestCount
      );

      await sendWhatsAppMessage(
        reservation.guestPhone,
        message,
        reservation.confirmationCode
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update reservation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
