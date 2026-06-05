"use client";

interface Reservation {
  id: string;
  guestName: string;
  reservationDate: string;
  guestCount: number;
  status: string;
  confirmationCode: string;
  table: {
    tableNumber: number;
  };
  checkIn?: {
    arrivedAt: string;
    departedAt?: string;
  };
}

interface ReceptionCheckinCardProps {
  reservation: Reservation;
  onCheckin: (id: string) => Promise<void>;
  onFinish: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export default function ReceptionCheckinCard({
  reservation,
  onCheckin,
  onFinish,
  isLoading,
}: ReceptionCheckinCardProps) {
  const dateTime = new Date(reservation.reservationDate);
  const now = new Date();
  const timeUntilReservation = dateTime.getTime() - now.getTime();
  const minutesUntil = Math.floor(timeUntilReservation / (1000 * 60));
  const isLate = minutesUntil < 0;
  const minutesLate = Math.abs(minutesUntil);

  const handleCheckin = async () => {
    if (confirm(`Confirma check-in para ${reservation.guestName}?`)) {
      await onCheckin(reservation.id);
    }
  };

  const handleFinish = async () => {
    if (confirm(`Confirma finalização do atendimento para ${reservation.guestName}?`)) {
      await onFinish(reservation.id);
    }
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {reservation.guestName}
          </h3>
          <p className="text-xs text-gray-500">{reservation.confirmationCode}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">
            Mesa <span className="text-2xl text-blue-600">{reservation.table.tableNumber}</span>
          </p>
          <p className="text-xs text-gray-600">{reservation.guestCount} pessoa(s)</p>
        </div>
      </div>

      {/* Time Status */}
      <div className="mb-3 p-2 rounded text-center">
        {isLate ? (
          <p className="text-red-600 font-semibold">
            ⏰ {minutesLate} minuto(s) atrasado
          </p>
        ) : (
          <p className="text-green-600 font-semibold">
            ✓ Chega em {minutesUntil} minuto(s)
          </p>
        )}
        <p className="text-xs text-gray-600">
          {dateTime.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Check-in Status */}
      {reservation.checkIn ? (
        <div className="bg-green-50 border border-green-200 rounded p-2 mb-3 text-sm">
          <p className="text-green-800 font-semibold">
            ✓ Check-in realizado
          </p>
          <p className="text-green-700 text-xs">
            {new Date(reservation.checkIn.arrivedAt).toLocaleTimeString("pt-BR")}
          </p>
          {reservation.checkIn.departedAt && (
            <p className="text-green-700 text-xs">
              Saída: {new Date(reservation.checkIn.departedAt).toLocaleTimeString("pt-BR")}
            </p>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3 text-sm">
          <p className="text-yellow-800 font-semibold">
            ⏳ Aguardando chegada
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {!reservation.checkIn ? (
          <button
            onClick={handleCheckin}
            disabled={isLoading}
            className="flex-1 bg-green-600 text-white font-bold py-2 px-3 rounded hover:bg-green-700 disabled:opacity-50 text-center"
          >
            ✓ Check-in
          </button>
        ) : !reservation.checkIn.departedAt ? (
          <button
            onClick={handleFinish}
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white font-bold py-2 px-3 rounded hover:bg-blue-700 disabled:opacity-50 text-center"
          >
            👋 Finalizar
          </button>
        ) : (
          <div className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 px-3 rounded text-center">
            ✓ Atendimento Concluído
          </div>
        )}
      </div>
    </div>
  );
}
