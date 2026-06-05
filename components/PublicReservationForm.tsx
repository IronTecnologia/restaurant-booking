"use client";

import { useState } from "react";

interface PublicReservationFormProps {
  restaurantId: string;
  minGuestCount: number;
  maxGuestCount: number;
  minAdvanceHours: number;
  maxAdvanceHours: number;
}

export default function PublicReservationForm({
  restaurantId,
  minGuestCount,
  maxGuestCount,
  minAdvanceHours,
  maxAdvanceHours,
}: PublicReservationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    reservationDate: "",
    guestCount: minGuestCount,
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/public/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          ...formData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao criar reserva");
      }

      const result = await response.json();
      setSuccess(true);

      // Resetar formulário
      setFormData({
        reservationDate: "",
        guestCount: minGuestCount,
        guestName: "",
        guestPhone: "",
        guestEmail: "",
        notes: "",
      });

      // Mostrar mensagem de sucesso por 5 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar reserva");
    } finally {
      setLoading(false);
    }
  };

  // Calcular data mínima e máxima
  const now = new Date();
  const minDate = new Date(now.getTime() + minAdvanceHours * 60 * 60 * 1000);
  const maxDate = new Date(now.getTime() + maxAdvanceHours * 60 * 60 * 1000);

  const formatDateInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Fazer uma Reserva
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          ✓ Reserva criada com sucesso! Verifique seu WhatsApp para a
          confirmação.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Data & Hora */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data e Hora *
          </label>
          <input
            type="datetime-local"
            value={formData.reservationDate}
            onChange={(e) =>
              setFormData({ ...formData, reservationDate: e.target.value })
            }
            min={formatDateInput(minDate)}
            max={formatDateInput(maxDate)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Mínimo de {minAdvanceHours} hora(s) de antecedência
          </p>
        </div>

        {/* Quantidade de Pessoas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de Pessoas *
          </label>
          <select
            value={formData.guestCount}
            onChange={(e) =>
              setFormData({ ...formData, guestCount: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from(
              { length: maxGuestCount - minGuestCount + 1 },
              (_, i) => minGuestCount + i
            ).map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Pessoa" : "Pessoas"}
              </option>
            ))}
          </select>
        </div>

        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome *
          </label>
          <input
            type="text"
            value={formData.guestName}
            onChange={(e) =>
              setFormData({ ...formData, guestName: e.target.value })
            }
            required
            placeholder="Seu nome"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            WhatsApp *
          </label>
          <input
            type="tel"
            value={formData.guestPhone}
            onChange={(e) =>
              setFormData({ ...formData, guestPhone: e.target.value })
            }
            required
            placeholder="+55 11 99999-9999"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Usaremos para confirmação e lembretes
          </p>
        </div>

        {/* Email (Opcional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email (Opcional)
          </label>
          <input
            type="email"
            value={formData.guestEmail}
            onChange={(e) =>
              setFormData({ ...formData, guestEmail: e.target.value })
            }
            placeholder="seu@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observações (Opcional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Ex: Aniversário, alergias, preferência de mesa..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Criando reserva..." : "Reservar Mesa"}
        </button>
      </form>

      {/* Info Footer */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p>
          ℹ️ <strong>Reserva automática:</strong> Será confirmada
          automaticamente se aprovada. Receba a confirmação no WhatsApp!
        </p>
      </div>
    </div>
  );
}
