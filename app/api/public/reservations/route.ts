import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateConfirmationCode } from "@/lib/auth";
import {
  sendWhatsAppMessage,
  formatConfirmationMessage,
  formatPendingMessage,
} from "@/lib/whatsapp";
import { analyzeReservation } from "@/lib/claude";

/**
 * POST /api/public/reservations
 * Criar nova reserva (sem autenticação de usuário)
 */
export async function POST(req: NextRequest) {
  try {
    const {
      restaurantId,
      restaurantSlug,
      reservationDate,
      guestCount,
      guestName,
      guestPhone,
      guestEmail,
      notes,
    } = await req.json();

    // Validar inputs
    if (!guestName || !guestPhone) {
      return NextResponse.json(
        { error: "Nome e telefone são obrigatórios" },
        { status: 400 }
      );
    }

    if (!reservationDate || !guestCount) {
      return NextResponse.json(
        { error: "Data e quantidade de pessoas obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar restaurante por ID ou slug
    let restaurant;
    if (restaurantId) {
      restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        include: {
          settings: true,
          tables: {
            where: { isActive: true },
          },
        },
      });
    } else if (restaurantSlug) {
      restaurant = await prisma.restaurant.findUnique({
        where: { slug: restaurantSlug },
        include: {
          settings: true,
          tables: {
            where: { isActive: true },
          },
        },
      });
    }

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

    // Validar quantidade de pessoas
    const settings = restaurant.settings;
    if (
      guestCount < settings!.minGuestCount ||
      guestCount > settings!.maxGuestCount
    ) {
      return NextResponse.json(
        {
          error: `Quantidade de pessoas deve estar entre ${settings!.minGuestCount} e ${settings!.maxGuestCount}`,
        },
        { status: 400 }
      );
    }

    // Validar antecedência
    const reservationDateTime = new Date(reservationDate);
    const now = new Date();
    const hoursAhead = (reservationDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursAhead < settings!.minAdvanceHours) {
      return NextResponse.json(
        {
          error: `Reserva deve ser feita com pelo menos ${settings!.minAdvanceHours} hora(s) de antecedência`,
        },
        { status: 400 }
      );
    }

    if (hoursAhead > settings!.maxAdvanceHours) {
      return NextResponse.json(
        {
          error: `Reserva pode ser feita com até ${settings!.maxAdvanceHours} horas de antecedência`,
        },
        { status: 400 }
      );
    }

    // Usar Claude para analisar e sugerir melhor mesa
    const analysis = await analyzeReservation({
      guestCount,
      date: reservationDate,
      specialRequests: notes,
      tables: restaurant.tables.map((t) => ({
        number: t.tableNumber,
        seats: t.capacity,
        status: "available",
      })),
    });

    // Buscar mesa sugerida
    const suggestedTableId = restaurant.tables.find(
      (t) => t.tableNumber === analysis.suggestedTable
    )?.id;

    if (!suggestedTableId) {
      return NextResponse.json(
        { error: "Nenhuma mesa disponível para esta reserva" },
        { status: 400 }
      );
    }

    // Determinar status inicial
    let initialStatus = "solicitada";
    if (settings!.autoApprove) {
      const withinRange =
        guestCount >= settings!.minGuestCount &&
        guestCount <= settings!.maxGuestCount;
      if (withinRange) {
        initialStatus = "confirmada";
      }
    }

    const confirmationCode = generateConfirmationCode();

    // Criar reserva
    const reservation = await prisma.reservation.create({
      data: {
        restaurantId: restaurant.id,
        tableId: suggestedTableId,
        reservationDate: reservationDateTime,
        guestCount,
        guestName,
        guestPhone,
        guestEmail,
        notes,
        status: initialStatus,
        confirmationCode,
        confirmedAt: initialStatus === "confirmada" ? new Date() : null,
      },
      include: {
        restaurant: true,
        table: true,
      },
    });

    // Enviar WhatsApp se configurado
    if (settings!.whatsappEnabled && guestPhone) {
      const message =
        initialStatus === "confirmada"
          ? formatConfirmationMessage(
              confirmationCode,
              restaurant.name,
              reservationDate,
              guestCount
            )
          : formatPendingMessage(confirmationCode);

      await sendWhatsAppMessage(guestPhone, message, confirmationCode);
    }

    return NextResponse.json(
      {
        message:
          initialStatus === "confirmada"
            ? "Reserva confirmada! Verifique seu WhatsApp."
            : "Reserva solicitada! Aguardando aprovação do restaurante.",
        reservation: {
          id: reservation.id,
          confirmationCode: reservation.confirmationCode,
          status: reservation.status,
          restaurantName: reservation.restaurant.name,
          tableNumber: reservation.table.tableNumber,
          reservationDate: reservation.reservationDate,
          guestCount: reservation.guestCount,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create public reservation error:", error);
    return NextResponse.json(
      { error: "Erro ao criar reserva" },
      { status: 500 }
    );
  }
}
