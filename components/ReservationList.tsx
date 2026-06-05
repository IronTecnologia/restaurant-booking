"use client";

import { useEffect, useState } from "react";

interface Reservation {
  id: string;
  confirmationCode: string;
  reservationDate: string;
  guestCount: number;
  status: string;
  restaurant: {
    name: string;
  };
  table: {
    tableNumber: number;
    seats: number;
  };
}

interface ReservationListProps {
  token: string;
}

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
};

export default function ReservationList({ token }: ReservationListProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("/api/reservations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reservations");
        }

        const data = await response.json();
        setReservations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [token]);

  const handleCancel = async (reservationId: string) => {
    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) return;

    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to cancel reservation");
      }

      setReservations(
        reservations.map((r) =>
          r.id === reservationId ? { ...r, status: "cancelled" } : r
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Um erro ocorreu");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando reservas...</div>;
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        Nenhuma reserva ainda. Crie a sua primeira!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Minhas Reservas</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {reservation.restaurant.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Código: {reservation.confirmationCode}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  reservation.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : reservation.status === "confirmed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {statusLabels[reservation.status] || reservation.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Data e Hora</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(reservation.reservationDate).toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Hóspedes</p>
                <p className="text-sm font-medium text-gray-900">
                  {reservation.guestCount} {reservation.guestCount === 1 ? "Pessoa" : "Pessoas"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mesa</p>
                <p className="text-sm font-medium text-gray-900">
                  Mesa {reservation.table.tableNumber} ({reservation.table.seats} lugares)
                </p>
              </div>
            </div>

            {reservation.status !== "cancelled" && (
              <button
                onClick={() => handleCancel(reservation.id)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Cancelar Reserva
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
