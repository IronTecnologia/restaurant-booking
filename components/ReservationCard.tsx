"use client";

interface Reservation {
  id: string;
  guestName: string;
  guestPhone: string;
  reservationDate: string;
  guestCount: number;
  status: string;
  confirmationCode: string;
  table: {
    tableNumber: number;
  };
  notes?: string;
}

interface ReservationCardProps {
  reservation: Reservation;
  onStatusChange: (id: string, newStatus: string) => Promise<void>;
  isLoading?: boolean;
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  solicitada: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    label: "⏳ Solicitada",
  },
  confirmada: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "✓ Confirmada",
  },
  checkin: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    label: "👤 Check-in",
  },
  finalizada: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    label: "✓ Finalizada",
  },
  "no-show": {
    bg: "bg-red-100",
    text: "text-red-800",
    label: "✗ No-show",
  },
  cancelada: {
    bg: "bg-red-100",
    text: "text-red-800",
    label: "✗ Cancelada",
  },
};

export default function ReservationCard({
  reservation,
  onStatusChange,
  isLoading,
}: ReservationCardProps) {
  const dateTime = new Date(reservation.reservationDate);
  const statusInfo = statusColors[reservation.status] || statusColors.solicitada;

  const handleStatusChange = async (newStatus: string) => {
    if (confirm(`Confirma mudança para: ${newStatus}?`)) {
      await onStatusChange(reservation.id, newStatus);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
      {/* Header with Status */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {reservation.guestName}
          </h3>
          <p className="text-sm text-gray-500">
            Código: {reservation.confirmationCode}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.text}`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Reservation Details */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-600">Data e Hora</p>
          <p className="font-medium text-gray-900">
            {dateTime.toLocaleString("pt-BR")}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Hóspedes</p>
          <p className="font-medium text-gray-900">{reservation.guestCount} pessoa(s)</p>
        </div>
        <div>
          <p className="text-gray-600">Mesa</p>
          <p className="font-medium text-gray-900">Mesa {reservation.table.tableNumber}</p>
        </div>
        <div>
          <p className="text-gray-600">Telefone</p>
          <a
            href={`https://wa.me/${reservation.guestPhone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-green-600 hover:text-green-700"
          >
            {reservation.guestPhone}
          </a>
        </div>
      </div>

      {/* Notes */}
      {reservation.notes && (
        <div className="bg-blue-50 p-3 rounded mb-4 text-sm">
          <p className="text-gray-700">
            <strong>Observações:</strong> {reservation.notes}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        {reservation.status === "solicitada" && (
          <>
            <button
              onClick={() => handleStatusChange("confirmada")}
              disabled={isLoading}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
            >
              Aprovar
            </button>
            <button
              onClick={() => handleStatusChange("cancelada")}
              disabled={isLoading}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
            >
              Rejeitar
            </button>
          </>
        )}

        {(reservation.status === "solicitada" || reservation.status === "confirmada") && (
          <button
            onClick={() => handleStatusChange("checkin")}
            disabled={isLoading}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Check-in
          </button>
        )}

        {reservation.status === "checkin" && (
          <button
            onClick={() => handleStatusChange("finalizada")}
            disabled={isLoading}
            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50"
          >
            Finalizar
          </button>
        )}

        {(reservation.status === "solicitada" ||
          reservation.status === "confirmada" ||
          reservation.status === "checkin") && (
          <button
            onClick={() => handleStatusChange("no-show")}
            disabled={isLoading}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
          >
            No-show
          </button>
        )}
      </div>
    </div>
  );
}
