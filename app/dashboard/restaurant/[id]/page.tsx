"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReservationCard from "@/components/ReservationCard";

interface Reservation {
  id: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  reservationDate: string;
  guestCount: number;
  status: string;
  confirmationCode: string;
  table: {
    tableNumber: number;
  };
  notes?: string;
}

const statusTabs = [
  { value: "solicitada", label: "⏳ Solicitadas", color: "yellow" },
  { value: "confirmada", label: "✓ Confirmadas", color: "green" },
  { value: "checkin", label: "👤 Check-in", color: "blue" },
  { value: "finalizada", label: "✓ Finalizadas", color: "gray" },
  { value: "no-show", label: "✗ No-show", color: "red" },
  { value: "cancelada", label: "✗ Canceladas", color: "red" },
];

export default function RestaurantDashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("solicitada");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Get params
  useEffect(() => {
    params.then(({ id }) => {
      setRestaurantId(id);
    });
  }, [params]);

  // Check auth and fetch reservations
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
  }, [restaurantId, activeTab, selectedDate, router]);

  const fetchReservations = async (
    authToken: string,
    restId: string
  ) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        restaurantId: restId,
        status: activeTab,
        date: selectedDate,
      });

      const response = await fetch(
        `/api/dashboard/reservations?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reservationId: string, newStatus: string) => {
    if (!token) return;

    try {
      setUpdating(true);
      const response = await fetch(
        `/api/dashboard/reservations/${reservationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            restaurantId,
            newStatus,
          }),
        }
      );

      if (response.ok) {
        // Atualizar lista
        if (restaurantId) {
          await fetchReservations(token, restaurantId);
        }
      } else {
        alert("Erro ao atualizar reserva");
      }
    } catch (error) {
      console.error("Error updating reservation:", error);
      alert("Erro ao atualizar");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // Count reservations by status
  const statusCounts = statusTabs.reduce(
    (acc, tab) => {
      acc[tab.value] = reservations.filter(
        (r) => r.status === tab.value
      ).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const filteredReservations = reservations.filter(
    (r) => r.status === activeTab
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Date Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por data:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Tabs */}
        <div className="bg-white border-b border-gray-200 mb-8">
          <div className="flex gap-1 overflow-x-auto">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-4 font-semibold text-lg whitespace-nowrap border-b-4 transition ${
                  activeTab === tab.value
                    ? `border-orange-500 text-gray-900`
                    : `border-transparent text-gray-600 hover:text-gray-900`
                }`}
              >
                {tab.label}{" "}
                <span className="text-sm ml-2">
                  ({statusCounts[tab.value] || 0})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Reservations Grid */}
        <div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando reservas...</p>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Nenhuma reserva com status "{activeTab}" para esta data.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onStatusChange={handleStatusChange}
                  isLoading={updating}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
