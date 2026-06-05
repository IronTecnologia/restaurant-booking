"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReservationList from "@/components/ReservationList";
import ReservationForm from "@/components/ReservationForm";
import SettingsPanel from "@/components/SettingsPanel";

interface Reservation {
  id: string;
  status: string;
  reservationDate: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("approved");
  const [showNewForm, setShowNewForm] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchReservations(storedToken);
  }, [router]);

  const fetchReservations = async (token: string) => {
    try {
      const response = await fetch("/api/reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch (error) {
      console.error("Erro ao carregar reservas", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleNewReservation = () => {
    setShowNewForm(!showNewForm);
  };

  const approvedCount = reservations.filter((r) => r.status === "confirmed").length;
  const pendingCount = reservations.filter((r) => r.status === "pending").length;
  const cancelledCount = reservations.filter((r) => r.status === "cancelled").length;

  const filteredReservations = reservations.filter((r) => {
    if (activeTab === "approved") return r.status === "confirmed";
    if (activeTab === "pending") return r.status === "pending";
    if (activeTab === "cancelled") return r.status === "cancelled";
    return true;
  });

  if (!token) {
    return <div>Redirecionando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Reservas</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8 justify-between items-center">
            <div className="flex gap-8">
              <button
                onClick={() => {
                  setActiveTab("approved");
                  setShowNewForm(false);
                }}
                className={`py-4 font-semibold text-lg transition-colors border-b-4 ${
                  activeTab === "approved"
                    ? "border-orange-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                Aprovadas <span className="text-sm ml-2">({approvedCount})</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("pending");
                  setShowNewForm(false);
                }}
                className={`py-4 font-semibold text-lg transition-colors border-b-4 ${
                  activeTab === "pending"
                    ? "border-orange-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                Pendentes <span className="text-sm ml-2">({pendingCount})</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("cancelled");
                  setShowNewForm(false);
                }}
                className={`py-4 font-semibold text-lg transition-colors border-b-4 ${
                  activeTab === "cancelled"
                    ? "border-orange-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                Canceladas <span className="text-sm ml-2">({cancelledCount})</span>
              </button>
            </div>
            <button
              onClick={() => {
                setActiveTab("settings");
                setShowNewForm(false);
              }}
              className={`py-4 px-4 font-semibold text-lg transition-colors border-b-4 ${
                activeTab === "settings"
                  ? "border-orange-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              ⚙️ Configurações
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {showNewForm ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Nova Reserva</h2>
              <button
                onClick={handleNewReservation}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            {token && (
              <ReservationForm
                restaurantId="default"
                token={token}
                onSuccess={() => {
                  setShowNewForm(false);
                  if (token) fetchReservations(token);
                  setActiveTab("pending");
                }}
              />
            )}
          </div>
        ) : activeTab === "settings" ? (
          <SettingsPanel restaurantId="default" token={token || ""} />
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {/* Calendar Sidebar */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedDate.toLocaleString("pt-BR", { month: "long", year: "numeric" }).toUpperCase()}
                  </h3>
                </div>

                {/* Simple Calendar */}
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-gray-600">
                    <div>D</div>
                    <div>S</div>
                    <div>T</div>
                    <div>Q</div>
                    <div>Q</div>
                    <div>S</div>
                    <div>S</div>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
                        className={`p-2 text-sm rounded transition ${
                          selectedDate.getDate() === day
                            ? "bg-orange-500 text-white font-bold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleNewReservation}
                  className="w-full mt-8 bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition"
                >
                  + Nova Reserva
                </button>
              </div>
            </div>

            {/* Reservations List */}
            <div className="col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {activeTab === "approved" && "Reservas Aprovadas"}
                  {activeTab === "pending" && "Reservas Pendentes"}
                  {activeTab === "cancelled" && "Reservas Canceladas"}
                </h3>

                {filteredReservations.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Nenhuma reserva encontrada</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReservations.map((reservation) => (
                      <div
                        key={reservation.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <ReservationItemPreview reservation={reservation} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ReservationItemPreview({ reservation }: { reservation: Reservation }) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <p className="font-semibold text-gray-900">Reserva #{reservation.id.substring(0, 8)}</p>
        <p className="text-sm text-gray-500">
          {new Date(reservation.reservationDate).toLocaleString("pt-BR")}
        </p>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          reservation.status === "confirmed"
            ? "bg-green-100 text-green-800"
            : reservation.status === "pending"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {reservation.status === "confirmed" && "✓ Confirmada"}
        {reservation.status === "pending" && "⏳ Pendente"}
        {reservation.status === "cancelled" && "✕ Cancelada"}
      </span>
    </div>
  );
}
