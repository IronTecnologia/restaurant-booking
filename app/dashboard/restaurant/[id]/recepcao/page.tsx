"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReceptionCheckinCard from "@/components/ReceptionCheckinCard";

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

export default function ReceptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "checkedin">(
    "all"
  );

  // Get params
  useEffect(() => {
    params.then(({ id }) => {
      setRestaurantId(id);
    });
  }, [params]);

  // Check auth and fetch
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);

    if (restaurantId) {
      fetchReservations(storedToken, restaurantId);
    }
  }, [restaurantId, router]);

  const fetchReservations = async (authToken: string, restId: string) => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const params = new URLSearchParams({
        restaurantId: restId,
        date: today,
      });

      const response = await fetch(
        `/api/dashboard/reservations?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Filtrar confirmadas e check-in
        const filtered = data.filter(
          (r: Reservation) =>
            r.status === "confirmada" || r.status === "checkin"
        );
        // Ordenar por horário
        filtered.sort(
          (a: Reservation, b: Reservation) =>
            new Date(a.reservationDate).getTime() -
            new Date(b.reservationDate).getTime()
        );
        setReservations(filtered);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = async (reservationId: string) => {
    if (!token) return;

    try {
      setUpdating(true);
      const response = await fetch("/api/dashboard/checkins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurantId,
          reservationId,
        }),
      });

      if (response.ok) {
        if (restaurantId) {
          await fetchReservations(token, restaurantId);
        }
      } else {
        alert("Erro ao fazer check-in");
      }
    } catch (error) {
      console.error("Error on checkin:", error);
      alert("Erro ao fazer check-in");
    } finally {
      setUpdating(false);
    }
  };

  const handleFinish = async (reservationId: string) => {
    if (!token) return;

    try {
      setUpdating(true);
      const response = await fetch("/api/dashboard/checkins", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurantId,
          reservationId,
        }),
      });

      if (response.ok) {
        if (restaurantId) {
          await fetchReservations(token, restaurantId);
        }
      } else {
        alert("Erro ao finalizar atendimento");
      }
    } catch (error) {
      console.error("Error on finish:", error);
      alert("Erro ao finalizar");
    } finally {
      setUpdating(false);
    }
  };

  // Filter reservations
  let filteredReservations = reservations;
  if (filter === "pending") {
    filteredReservations = reservations.filter((r) => !r.checkIn);
  } else if (filter === "checkedin") {
    filteredReservations = reservations.filter((r) => r.checkIn);
  }

  // Stats
  const stats = {
    total: reservations.length,
    pending: reservations.filter((r) => !r.checkIn).length,
    checkedIn: reservations.filter((r) => r.checkIn).length,
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🚪 Recepção</h1>
              <p className="text-gray-600 text-sm">
                {new Date().toLocaleDateString("pt-BR")}
              </p>
            </div>
            <button
              onClick={handleBack}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              ← Voltar
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Reservas do dia</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-gray-600">Aguardando chegada</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.checkedIn}</p>
              <p className="text-sm text-gray-600">Na casa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 flex gap-4">
          <button
            onClick={() => setFilter("all")}
            className={`py-4 px-4 font-semibold text-lg border-b-4 transition ${
              filter === "all"
                ? "border-orange-500 text-gray-900"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Todos ({stats.total})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`py-4 px-4 font-semibold text-lg border-b-4 transition ${
              filter === "pending"
                ? "border-orange-500 text-gray-900"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            ⏳ Chegando ({stats.pending})
          </button>
          <button
            onClick={() => setFilter("checkedin")}
            className={`py-4 px-4 font-semibold text-lg border-b-4 transition ${
              filter === "checkedin"
                ? "border-orange-500 text-gray-900"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            👤 Na Casa ({stats.checkedIn})
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando reservas...</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">
              Nenhuma reserva para exibir
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReservations.map((reservation) => (
              <ReceptionCheckinCard
                key={reservation.id}
                reservation={reservation}
                onCheckin={handleCheckin}
                onFinish={handleFinish}
                isLoading={updating}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
