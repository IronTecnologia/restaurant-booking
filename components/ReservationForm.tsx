"use client";

import { useState } from "react";

interface ReservationFormProps {
  restaurantId: string;
  onSuccess?: () => void;
  token: string;
}

export default function ReservationForm({
  restaurantId,
  onSuccess,
  token,
}: ReservationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    reservationDate: "",
    guestCount: 2,
    specialRequests: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurantId,
          ...formData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create reservation");
      }

      setSuccess(true);
      setFormData({
        reservationDate: "",
        guestCount: 2,
        specialRequests: "",
      });

      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Fazer uma Reserva
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Reserva criada! Verifique seu email para confirmação.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data e Hora
        </label>
        <input
          type="datetime-local"
          value={formData.reservationDate}
          onChange={(e) =>
            setFormData({ ...formData, reservationDate: e.target.value })
          }
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Número de Hóspedes
        </label>
        <select
          value={formData.guestCount}
          onChange={(e) =>
            setFormData({ ...formData, guestCount: parseInt(e.target.value) })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? "Pessoa" : "Pessoas"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Pedidos Especiais (Opcional)
        </label>
        <textarea
          value={formData.specialRequests}
          onChange={(e) =>
            setFormData({ ...formData, specialRequests: e.target.value })
          }
          placeholder="Ex.: Perto da janela, alergias, celebração..."
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Criando..." : "Reservar Mesa"}
      </button>
    </form>
  );
}
